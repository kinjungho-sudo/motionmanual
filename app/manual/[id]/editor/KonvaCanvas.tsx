'use client'

import { useEffect, useRef, useState } from 'react'
import type { MmStep } from '@/types'

type ToolMode = 'select' | 'marker' | 'text' | 'rect' | 'circle' | 'arrow' | 'zoom'
type OutputRatio = '16:9' | '1:1' | '9:16'

interface Marker {
  id: number
  x: number
  y: number
}

interface ZoomBox {
  x: number; y: number; w: number; h: number
}

interface StepEffects {
  transition: string
  duration: number
  clickHighlight: boolean
  showCaption: boolean
  zoomStart?: ZoomBox
  zoomEnd?: ZoomBox
}

interface Props {
  step: MmStep
  tool: ToolMode
  effects: StepEffects
  ratio: OutputRatio
  onMarkersChange: (markers: Record<string, unknown>[]) => void
  onZoomChange: (start: ZoomBox, end: ZoomBox) => void
}

const RATIO_MAP: Record<OutputRatio, number> = {
  '16:9': 16 / 9,
  '1:1': 1,
  '9:16': 9 / 16,
}

export default function KonvaCanvas({
  step, tool, effects, ratio,
  onMarkersChange, onZoomChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setCanvasSize] = useState({ w: 740, h: 416 })
  const [markers, setMarkers] = useState<Marker[]>(() => {
    if (!step.markers) return []
    return (step.markers as Record<string, unknown>[]).map((m, i) => ({
      id: typeof m.id === 'number' ? m.id : i + 1,
      x: typeof m.x === 'number' ? m.x : 50,
      y: typeof m.y === 'number' ? m.y : 50,
    }))
  })
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null)

  // Zoom boxes as % of canvas
  const [zoomStart, setZoomStart] = useState<ZoomBox>(
    effects.zoomStart || { x: 2, y: 4, w: 96, h: 86 }
  )
  const [zoomEnd, setZoomEnd] = useState<ZoomBox>(
    effects.zoomEnd || { x: 60, y: 52, w: 22, h: 20 }
  )

  // Sync effects prop changes
  useEffect(() => {
    if (effects.zoomStart) setZoomStart(effects.zoomStart)
    if (effects.zoomEnd) setZoomEnd(effects.zoomEnd)
  }, [effects.zoomStart, effects.zoomEnd])

  // Resize observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      const w = el.clientWidth
      const h = w / RATIO_MAP[ratio]
      setCanvasSize({ w, h })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ratio])

  // Add marker on canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool !== 'marker') return
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = ((e.clientX - rect.left) / rect.width) * 100
    const yPct = ((e.clientY - rect.top) / rect.height) * 100
    const nextId = markers.length > 0 ? Math.max(...markers.map(m => m.id)) + 1 : 1
    const updated = [...markers, { id: nextId, x: xPct, y: yPct }]
    setMarkers(updated)
    onMarkersChange(updated as unknown as Record<string, unknown>[])
  }

  const removeMarker = (id: number) => {
    const updated = markers.filter(m => m.id !== id)
    setMarkers(updated)
    onMarkersChange(updated as unknown as Record<string, unknown>[])
    if (activeMarkerId === id) setActiveMarkerId(null)
  }

  const showZoom = tool === 'zoom' || effects.transition === 'zoom'

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', maxWidth: 740 }}
    >
      <div
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          aspectRatio: RATIO_MAP[ratio].toString(),
          borderRadius: 8,
          background: 'white',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          position: 'relative',
          cursor: tool === 'marker' ? 'crosshair' : 'default',
        }}
      >
        {/* Background screenshot */}
        {step.screenshot_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={step.screenshot_url}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
          />
        )}

        {!step.screenshot_url && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9CA3AF', fontSize: 13,
          }}>
            스크린샷 없음
          </div>
        )}

        {/* Markers */}
        {markers.map(m => (
          <DraggableMarker
            key={m.id}
            marker={m}
            active={activeMarkerId === m.id}
            onClick={(e) => {
              e.stopPropagation()
              setActiveMarkerId(prev => prev === m.id ? null : m.id)
            }}
            onRemove={() => removeMarker(m.id)}
            onDragEnd={(xPct, yPct) => {
              const updated = markers.map(mk => mk.id === m.id ? { ...mk, x: xPct, y: yPct } : mk)
              setMarkers(updated)
              onMarkersChange(updated as unknown as Record<string, unknown>[])
            }}
          />
        ))}

        {/* Zoom boxes */}
        {showZoom && (
          <>
            <DraggableZoomBox
              box={zoomStart}
              label="시작 장면"
              solid
              color="#06B6D4"
              onChange={box => {
                setZoomStart(box)
                onZoomChange(box, zoomEnd)
              }}
            />
            <DraggableZoomBox
              box={zoomEnd}
              label="종료 장면"
              solid={false}
              color="#06B6D4"
              onChange={box => {
                setZoomEnd(box)
                onZoomChange(zoomStart, box)
              }}
            />
          </>
        )}

        {/* Caption overlay */}
        {step.caption && effects.showCaption && (
          <div style={{
            position: 'absolute',
            bottom: 14, left: '50%', transform: 'translateX(-50%)',
            padding: '6px 14px', borderRadius: 4,
            background: 'rgba(0,0,0,0.72)', color: 'white',
            fontSize: 11, fontWeight: 500,
            maxWidth: '80%', textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {step.caption}
          </div>
        )}
      </div>

      {/* Marker count hint */}
      {tool === 'marker' && (
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
          캔버스를 클릭해 마커를 추가하세요. 마커를 클릭하면 삭제할 수 있습니다.
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// Draggable Marker
// ──────────────────────────────────────────────
function DraggableMarker({
  marker, active, onClick, onRemove, onDragEnd,
}: {
  marker: Marker
  active: boolean
  onClick: (e: React.MouseEvent) => void
  onRemove: () => void
  onDragEnd: (xPct: number, yPct: number) => void
}) {
  const dragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const [showDelete, setShowDelete] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    dragging.current = true
    startPos.current = { x: e.clientX, y: e.clientY }

    const parent = (e.currentTarget as HTMLElement).parentElement!
    const rect = parent.getBoundingClientRect()

    const onMove = (me: MouseEvent) => {
      if (!dragging.current) return
      const xPct = ((me.clientX - rect.left) / rect.width) * 100
      const yPct = ((me.clientY - rect.top) / rect.height) * 100
      const el = document.getElementById(`marker-${marker.id}`)
      if (el) {
        el.style.left = `${Math.max(0, Math.min(100, xPct))}%`
        el.style.top = `${Math.max(0, Math.min(100, yPct))}%`
      }
    }

    const onUp = (me: MouseEvent) => {
      dragging.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      const dx = Math.abs(me.clientX - startPos.current.x)
      const dy = Math.abs(me.clientY - startPos.current.y)
      if (dx < 4 && dy < 4) {
        onClick(me as unknown as React.MouseEvent)
        return
      }
      const xPct = ((me.clientX - rect.left) / rect.width) * 100
      const yPct = ((me.clientY - rect.top) / rect.height) * 100
      onDragEnd(
        Math.max(0, Math.min(100, xPct)),
        Math.max(0, Math.min(100, yPct))
      )
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      id={`marker-${marker.id}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      style={{
        position: 'absolute',
        left: `${marker.x}%`,
        top: `${marker.y}%`,
        transform: 'translate(-50%, -50%)',
        width: 22, height: 22, borderRadius: '50%',
        background: active ? '#4F46E5' : '#DC2626',
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600,
        cursor: 'grab',
        zIndex: 20,
        boxShadow: active
          ? '0 0 0 4px rgba(79,70,229,0.25), 0 2px 8px rgba(79,70,229,0.5)'
          : '0 2px 6px rgba(0,0,0,0.3)',
        transition: 'background 0.15s, box-shadow 0.15s',
        userSelect: 'none',
      }}
    >
      {marker.id}
      {showDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          style={{
            position: 'absolute', top: -8, right: -8,
            width: 16, height: 16, borderRadius: '50%',
            background: '#111827', color: 'white', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, cursor: 'pointer', zIndex: 30,
          }}
        >✕</button>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// Draggable Zoom Box (% coords relative to canvas)
// ──────────────────────────────────────────────
function DraggableZoomBox({
  box, label, solid, color, onChange,
}: {
  box: ZoomBox
  label: string
  solid: boolean
  color: string
  onChange: (b: ZoomBox) => void
}) {
  const boxRef = useRef<HTMLDivElement>(null)

  const startDrag = (e: React.MouseEvent) => {
    e.stopPropagation()
    const parent = boxRef.current?.parentElement
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const origBox = { ...box }

    const onMove = (me: MouseEvent) => {
      const dx = ((me.clientX - startX) / rect.width) * 100
      const dy = ((me.clientY - startY) / rect.height) * 100
      onChange({
        ...origBox,
        x: Math.max(0, Math.min(100 - origBox.w, origBox.x + dx)),
        y: Math.max(0, Math.min(100 - origBox.h, origBox.y + dy)),
      })
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      ref={boxRef}
      onMouseDown={startDrag}
      style={{
        position: 'absolute',
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.w}%`,
        height: `${box.h}%`,
        border: `2px ${solid ? 'solid' : 'dashed'} ${color}`,
        borderRadius: 2,
        cursor: 'move',
        zIndex: 10,
        boxSizing: 'border-box',
      }}
    >
      <span style={{
        position: 'absolute', top: -16, left: 0,
        padding: '1px 7px', borderRadius: 3,
        background: color, color: 'white',
        fontSize: 9.5, fontWeight: 500,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        {label}
      </span>
      {/* Corner handles */}
      {[
        { x: -4, y: -4 }, { x: 'calc(100% - 4px)', y: -4 },
        { x: -4, y: 'calc(100% - 4px)' }, { x: 'calc(100% - 4px)', y: 'calc(100% - 4px)' },
      ].map((pos, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: pos.x, top: pos.y,
            width: 8, height: 8, background: 'white',
            border: `1.5px solid ${color}`, borderRadius: 1,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}
