'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { MmManual, MmStep } from '@/types'

// Konva must be dynamically imported (no SSR)
const KonvaCanvas = dynamic(() => import('./KonvaCanvas'), { ssr: false })

type TransitionType = 'zoom' | 'fade' | 'slide' | 'none'
type DurationSec = 4 | 6 | 8
type ActiveTab = 'effects' | 'voice' | 'all'
type VoiceSource = 'ai' | 'rec'
type OutputRatio = '16:9' | '1:1' | '9:16'

interface StepEffects {
  transition: TransitionType
  duration: DurationSec
  clickHighlight: boolean
  showCaption: boolean
  zoomStart?: { x: number; y: number; w: number; h: number }
  zoomEnd?: { x: number; y: number; w: number; h: number }
}

const DEFAULT_EFFECTS: StepEffects = {
  transition: 'zoom',
  duration: 6,
  clickHighlight: true,
  showCaption: true,
}

interface Props {
  manual: MmManual
  steps: MmStep[]
}

// ──────────────────────────────────────────────
// Small shared UI atoms
// ──────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 32, height: 18, borderRadius: 9,
        background: checked ? '#4F46E5' : '#E5E7EB',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.15s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: checked ? 16 : 2,
        width: 14, height: 14, borderRadius: '50%',
        background: 'white',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        transition: 'left 0.15s',
      }} />
    </div>
  )
}

function Segmented<T extends string>({
  options, active, onChange,
}: {
  options: { label: string; value: T }[]
  active: T
  onChange: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 2, padding: 2, background: '#F3F4F6', borderRadius: 6 }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            flex: 1, padding: '6px 4px', fontSize: 11.5, borderRadius: 5,
            fontWeight: o.value === active ? 500 : 400,
            background: o.value === active ? 'white' : 'transparent',
            color: o.value === active ? '#111827' : '#6B7280',
            boxShadow: o.value === active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            border: 'none', cursor: 'pointer',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {children}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11.5, color: '#4B5563', marginBottom: 6 }}>{children}</div>
}

// ──────────────────────────────────────────────
// Slides Panel (left 170px)
// ──────────────────────────────────────────────
function SlidesPanel({
  steps, activeIndex, onSelect,
}: {
  steps: MmStep[]
  activeIndex: number
  onSelect: (i: number) => void
}) {
  return (
    <aside style={{
      width: 170, flexShrink: 0,
      background: 'white',
      borderRight: '1px solid #E5E7EB',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '12px', borderBottom: '1px solid #F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12,
      }}>
        <span style={{ fontWeight: 500 }}>
          슬라이드 <strong style={{ color: '#4F46E5' }}>{steps.length}</strong>
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {steps.map((s, i) => (
          <div
            key={s.id}
            onClick={() => onSelect(i)}
            style={{
              borderRadius: 6,
              border: `2px solid ${i === activeIndex ? '#4F46E5' : 'transparent'}`,
              padding: 4, cursor: 'pointer', background: 'white',
              boxShadow: i === activeIndex
                ? '0 4px 12px rgba(79,70,229,0.18)'
                : '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: 9.5, color: '#6B7280', padding: '0 2px 3px',
            }}>
              <span style={{
                width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                background: i === activeIndex ? '#4F46E5' : '#F3F4F6',
                color: i === activeIndex ? 'white' : '#4B5563',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 500,
              }}>{i + 1}</span>
              <span style={{
                fontSize: 8.5, padding: '1px 5px', borderRadius: 3,
                background: '#EEF2FF', color: '#4F46E5',
              }}>
                {(s.effects as { transition?: string } | null)?.transition || '없음'}
              </span>
            </div>
            <div style={{
              aspectRatio: '16/9', borderRadius: 3,
              background: '#1A1F2E', overflow: 'hidden', position: 'relative',
            }}>
              {s.screenshot_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.screenshot_url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            <div style={{
              fontSize: 9.5, color: '#4B5563',
              padding: '4px 2px 1px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {s.title || `스텝 ${i + 1}`}
            </div>
          </div>
        ))}

        {steps.length === 0 && (
          <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', padding: '20px 0' }}>
            스텝 없음
          </div>
        )}
      </div>
    </aside>
  )
}

// ──────────────────────────────────────────────
// Canvas Toolbar
// ──────────────────────────────────────────────
type ToolMode = 'select' | 'marker' | 'text' | 'rect' | 'circle' | 'arrow' | 'zoom'

function CanvasToolbar({
  activeTool, onTool, ratio,
}: {
  activeTool: ToolMode
  onTool: (t: ToolMode) => void
  ratio: OutputRatio
}) {
  const tools: { mode: ToolMode; label?: string; icon: React.ReactNode }[] = [
    { mode: 'select', icon: <SelectIcon /> },
    { mode: 'marker', label: '마커', icon: <MarkerIcon /> },
    { mode: 'text', label: '텍스트', icon: <TypeIcon /> },
    { mode: 'rect', icon: <SquareIcon /> },
    { mode: 'circle', icon: <CircleIcon /> },
    { mode: 'arrow', icon: <ArrowIcon /> },
    { mode: 'zoom', label: '줌 설정', icon: <ZoomIcon /> },
  ]

  const groups = [
    tools.slice(0, 1),
    tools.slice(1, 3),
    tools.slice(3, 6),
    tools.slice(6),
  ]

  return (
    <div style={{
      height: 44, flexShrink: 0,
      background: 'white', borderBottom: '1px solid #E5E7EB',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 4,
    }}>
      {groups.map((group, gi) => (
        <div key={gi} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {gi > 0 && <div style={{ width: 1, height: 18, background: '#E5E7EB', margin: '0 4px' }} />}
          {group.map(t => (
            <button
              key={t.mode}
              onClick={() => onTool(t.mode)}
              title={t.label || t.mode}
              style={{
                padding: '5px 8px', borderRadius: 6,
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 12,
                background: activeTool === t.mode ? '#EEF2FF' : 'transparent',
                color: activeTool === t.mode ? '#4F46E5' : '#4B5563',
                border: 'none', cursor: 'pointer',
              }}
            >
              {t.icon}
              {t.label && <span>{t.label}</span>}
            </button>
          ))}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 11, color: '#9CA3AF' }}>
        {ratio} · {ratio === '16:9' ? '1920×1080' : ratio === '1:1' ? '1080×1080' : '1080×1920'}
      </span>
    </div>
  )
}

// ──────────────────────────────────────────────
// Canvas Footer
// ──────────────────────────────────────────────
function CanvasFooter({
  slideIndex, total, onPrev, onNext, duration,
}: {
  slideIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
  duration: number
}) {
  return (
    <div style={{
      height: 48, flexShrink: 0,
      background: 'white', borderTop: '1px solid #E5E7EB',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 14, padding: '0 16px',
    }}>
      <button
        onClick={onPrev}
        disabled={slideIndex === 0}
        style={{
          width: 30, height: 30, borderRadius: 6,
          color: slideIndex === 0 ? '#D1D5DB' : '#4B5563',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #E5E7EB', background: 'white', cursor: slideIndex === 0 ? 'default' : 'pointer',
        }}
      >
        <ChevronLeftIcon />
      </button>
      <button style={{
        width: 36, height: 36, borderRadius: '50%',
        background: '#4F46E5', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', cursor: 'pointer',
      }}>
        <PlayIcon />
      </button>
      <button
        onClick={onNext}
        disabled={slideIndex === total - 1}
        style={{
          width: 30, height: 30, borderRadius: 6,
          color: slideIndex === total - 1 ? '#D1D5DB' : '#4B5563',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #E5E7EB', background: 'white', cursor: slideIndex === total - 1 ? 'default' : 'pointer',
        }}
      >
        <ChevronRightIcon />
      </button>
      <div style={{ width: 1, height: 18, background: '#E5E7EB', margin: '0 4px' }} />
      <span style={{ fontSize: 12, color: '#4B5563' }}>
        <strong style={{ fontWeight: 500, color: '#111827' }}>{slideIndex + 1}</strong>
        <span style={{ color: '#9CA3AF' }}> / {total}</span>
        <span style={{ color: '#9CA3AF', marginLeft: 8 }}>· {duration}초</span>
      </span>
    </div>
  )
}

// ──────────────────────────────────────────────
// Effects Tab
// ──────────────────────────────────────────────
function EffectsTab({
  effects, onChange,
}: {
  effects: StepEffects
  onChange: (e: Partial<StepEffects>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionLabel>이 슬라이드 효과</SectionLabel>

      <div>
        <FieldLabel>전환</FieldLabel>
        <Segmented
          options={[
            { label: '줌', value: 'zoom' },
            { label: '페이드', value: 'fade' },
            { label: '슬라이드', value: 'slide' },
            { label: '없음', value: 'none' },
          ]}
          active={effects.transition}
          onChange={v => onChange({ transition: v })}
        />
      </div>

      <div>
        <FieldLabel>재생 시간</FieldLabel>
        <Segmented<string>
          options={[
            { label: '4초', value: '4' },
            { label: '6초', value: '6' },
            { label: '8초', value: '8' },
          ]}
          active={String(effects.duration)}
          onChange={v => onChange({ duration: Number(v) as DurationSec })}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12.5, color: '#111827' }}>클릭 강조</span>
        <Toggle checked={effects.clickHighlight} onChange={v => onChange({ clickHighlight: v })} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12.5, color: '#111827' }}>자막 표시</span>
        <Toggle checked={effects.showCaption} onChange={v => onChange({ showCaption: v })} />
      </div>

      {effects.transition === 'zoom' && (
        <div style={{
          padding: 12, borderRadius: 8,
          background: 'rgba(6,182,212,0.06)',
          border: '1px solid rgba(6,182,212,0.20)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <ZoomIcon color="#06B6D4" />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#0E7490' }}>줌 경로</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <ZoomFrameCard
              label="시작 장면"
              sub={effects.zoomStart
                ? `${Math.round(effects.zoomStart.x)},${Math.round(effects.zoomStart.y)} · ${Math.round(effects.zoomStart.w)}×${Math.round(effects.zoomStart.h)}`
                : '전체 영역'}
              solid
            />
            <div style={{ display: 'flex', justifyContent: 'center', color: '#06B6D4' }}>
              <ChevronDownIcon />
            </div>
            <ZoomFrameCard
              label="종료 장면"
              sub={effects.zoomEnd
                ? `${Math.round(effects.zoomEnd.x)},${Math.round(effects.zoomEnd.y)} · ${Math.round(effects.zoomEnd.w)}×${Math.round(effects.zoomEnd.h)}`
                : '캔버스에서 설정'}
              solid={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ZoomFrameCard({ label, sub, solid }: { label: string; sub: string; solid: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: 8, borderRadius: 6, background: 'white',
      border: `1.5px ${solid ? 'solid' : 'dashed'} #06B6D4`,
    }}>
      <div style={{
        width: 24, height: 18,
        border: `1.5px ${solid ? 'solid' : 'dashed'} #06B6D4`,
        borderRadius: 2, flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#111827' }}>{label}</div>
        <div style={{ fontSize: 10, color: '#6B7280', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Voice Tab
// ──────────────────────────────────────────────
function VoiceTab({
  caption, onCaption, voiceSource, onVoiceSource,
}: {
  caption: string
  onCaption: (v: string) => void
  voiceSource: VoiceSource
  onVoiceSource: (v: VoiceSource) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        padding: 12, borderRadius: 10,
        background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(124,58,237,0.06) 100%)',
        border: '1px solid rgba(124,58,237,0.16)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <SparklesIcon color="#4F46E5" />
          <span style={{ fontSize: 12, fontWeight: 500, color: '#4F46E5' }}>음성·자막 모드</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['ai', 'rec'] as VoiceSource[]).map(src => (
            <button
              key={src}
              onClick={() => onVoiceSource(src)}
              style={{
                flex: 1, padding: '8px',
                background: voiceSource === src ? 'white' : 'transparent',
                border: `1.5px solid ${voiceSource === src ? '#4F46E5' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: 7, fontSize: 11.5,
                color: voiceSource === src ? '#4F46E5' : '#4B5563',
                fontWeight: voiceSource === src ? 500 : 400,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                cursor: 'pointer',
              }}
            >
              {src === 'ai' ? <SparklesIcon /> : <MicIcon />}
              {src === 'ai' ? 'AI 음성' : '직접 녹음'}
              {src === 'ai' && (
                <span style={{
                  fontSize: 8, padding: '1px 5px', borderRadius: 3,
                  background: 'rgba(124,58,237,0.12)', color: '#7C3AED', fontWeight: 500,
                }}>Phase 3</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 8, lineHeight: 1.4 }}>
          AI가 자막과 음성을 자동으로 생성합니다. 마음에 들지 않으면 아래에서 직접 조정하세요.
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <FieldLabel>자막</FieldLabel>
        </div>
        <textarea
          value={caption}
          onChange={e => onCaption(e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: 9, borderRadius: 6,
            border: '1.5px solid #4F46E5',
            background: 'rgba(79,70,229,0.02)',
            fontSize: 12, lineHeight: 1.5, color: '#111827',
            resize: 'vertical', boxSizing: 'border-box',
            fontFamily: 'inherit',
          }}
          placeholder="자막 텍스트를 입력하세요..."
        />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Global Tab
// ──────────────────────────────────────────────
function GlobalTab({
  ratio, onRatio,
}: {
  ratio: OutputRatio
  onRatio: (r: OutputRatio) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionLabel>전체 설정</SectionLabel>
      <div>
        <FieldLabel>출력 비율</FieldLabel>
        <Segmented
          options={[
            { label: '16:9', value: '16:9' },
            { label: '1:1', value: '1:1' },
            { label: '9:16', value: '9:16' },
          ]}
          active={ratio}
          onChange={onRatio}
        />
        <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 6, lineHeight: 1.4 }}>
          모든 슬라이드에 즉시 적용됩니다
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Options Panel (right 290px)
// ──────────────────────────────────────────────
function OptionsPanel({
  activeTab, onTab,
  effects, onEffects,
  caption, onCaption,
  voiceSource, onVoiceSource,
  ratio, onRatio,
}: {
  activeTab: ActiveTab
  onTab: (t: ActiveTab) => void
  effects: StepEffects
  onEffects: (e: Partial<StepEffects>) => void
  caption: string
  onCaption: (v: string) => void
  voiceSource: VoiceSource
  onVoiceSource: (v: VoiceSource) => void
  ratio: OutputRatio
  onRatio: (r: OutputRatio) => void
}) {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'effects', label: '효과' },
    { id: 'voice', label: '음성·자막' },
    { id: 'all', label: '전체' },
  ]

  return (
    <aside style={{
      width: 290, flexShrink: 0,
      background: 'white',
      borderLeft: '1px solid #E5E7EB',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            style={{
              flex: 1, padding: '11px 8px',
              fontSize: 12.5,
              fontWeight: activeTab === t.id ? 500 : 400,
              color: activeTab === t.id ? '#4F46E5' : '#6B7280',
              borderBottom: `2px solid ${activeTab === t.id ? '#4F46E5' : 'transparent'}`,
              marginBottom: -1,
              background: 'transparent', border: 'none',
              borderBottom2: undefined,
              cursor: 'pointer',
            } as React.CSSProperties}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
        {activeTab === 'effects' && (
          <EffectsTab effects={effects} onChange={onEffects} />
        )}
        {activeTab === 'voice' && (
          <VoiceTab
            caption={caption}
            onCaption={onCaption}
            voiceSource={voiceSource}
            onVoiceSource={onVoiceSource}
          />
        )}
        {activeTab === 'all' && (
          <GlobalTab ratio={ratio} onRatio={onRatio} />
        )}
      </div>
    </aside>
  )
}

// ──────────────────────────────────────────────
// Main EditorClient
// ──────────────────────────────────────────────
export default function EditorClient({ manual, steps: initialSteps }: Props) {
  const router = useRouter()
  const [steps, setSteps] = useState<MmStep[]>(initialSteps)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeTool, setActiveTool] = useState<ToolMode>('select')
  const [activeTab, setActiveTab] = useState<ActiveTab>('effects')
  const [voiceSource, setVoiceSource] = useState<VoiceSource>('ai')
  const [ratio, setRatio] = useState<OutputRatio>(
    (manual.output_ratio as OutputRatio) || '16:9'
  )
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentStep = steps[activeIndex]

  // Per-step effects state
  const [effectsMap, setEffectsMap] = useState<Record<string, StepEffects>>(() => {
    const m: Record<string, StepEffects> = {}
    initialSteps.forEach(s => {
      m[s.id] = { ...DEFAULT_EFFECTS, ...(s.effects as Partial<StepEffects> | null) }
    })
    return m
  })

  const currentEffects = currentStep ? (effectsMap[currentStep.id] ?? DEFAULT_EFFECTS) : DEFAULT_EFFECTS

  const updateEffects = useCallback((patch: Partial<StepEffects>) => {
    if (!currentStep) return
    setEffectsMap(prev => ({
      ...prev,
      [currentStep.id]: { ...prev[currentStep.id], ...patch },
    }))
    scheduleStepSave(currentStep.id, patch)
  }, [currentStep]) // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleStepSave = useCallback((stepId: string, effects: Partial<StepEffects>) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaving(true)
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/manuals/${manual.id}/steps/${stepId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ effects }),
      })
      setSaving(false)
      setSavedAt(new Date())
    }, 800)
  }, [manual.id])

  const updateCaption = useCallback((caption: string) => {
    if (!currentStep) return
    setSteps(prev => prev.map((s, i) => i === activeIndex ? { ...s, caption } : s))
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaving(true)
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/manuals/${manual.id}/steps/${currentStep.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      })
      setSaving(false)
      setSavedAt(new Date())
    }, 500)
  }, [currentStep, activeIndex, manual.id])

  const handlePublish = async () => {
    await fetch(`/api/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manualId: manual.id, visibility: 'link' }),
    })
    router.push(`/manual/${manual.id}`)
  }

  const savedLabel = saving
    ? '저장 중...'
    : savedAt
    ? `마지막 저장 · ${Math.round((Date.now() - savedAt.getTime()) / 1000)}초 전`
    : '변경사항 없음'

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    }}>
      {/* Dark header */}
      <header style={{
        height: 52, flexShrink: 0,
        background: '#111827',
        borderBottom: '1px solid #1F2937',
        display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 12,
        color: 'white',
      }}>
        <button
          onClick={() => router.push(`/manual/${manual.id}`)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 10px', borderRadius: 6,
            color: '#9CA3AF', fontSize: 12,
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}
        >
          <XIcon /> 종료
        </button>
        <div style={{ width: 1, height: 18, background: '#374151' }} />
        <div style={{
          width: 20, height: 20, borderRadius: 5,
          background: '#4F46E5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
        }}>M</div>
        <span style={{ fontSize: 13, color: 'white' }}>{manual.title}</span>
        <span style={{
          padding: '3px 8px', borderRadius: 4,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'white', fontSize: 10, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 3,
        }}>
          <SparklesIcon size={11} /> 튜토리얼 만들기
        </span>

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: 11, color: '#6B7280' }}>{savedLabel}</span>

        <button
          onClick={() => router.push(`/play/${manual.share_token}`)}
          disabled={!manual.share_token}
          style={{
            padding: '6px 12px', borderRadius: 6, color: 'white', fontSize: 12,
            border: '1px solid #374151', background: 'transparent', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            opacity: manual.share_token ? 1 : 0.4,
          }}
        >
          <EyeIcon /> 미리보기
        </button>
        <button
          onClick={handlePublish}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white', border: 'none', cursor: 'pointer',
          }}
        >
          게시
        </button>
      </header>

      {/* Body: 3 columns */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, background: '#F9FAFB' }}>
        <SlidesPanel
          steps={steps}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />

        {/* Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <CanvasToolbar
            activeTool={activeTool}
            onTool={setActiveTool}
            ratio={ratio}
          />

          {/* Canvas area */}
          <div style={{
            flex: 1,
            background: '#F3F4F6',
            backgroundImage: 'radial-gradient(circle, #E5E7EB 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            padding: '20px 28px',
            overflow: 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {currentStep ? (
              <KonvaCanvas
                step={currentStep}
                tool={activeTool}
                effects={currentEffects}
                ratio={ratio}
                onMarkersChange={(markers) => {
                  setSteps(prev => prev.map((s, i) => i === activeIndex ? { ...s, markers } : s))
                  scheduleStepSave(currentStep.id, {})
                }}
                onZoomChange={(zoomStart, zoomEnd) => {
                  updateEffects({ zoomStart, zoomEnd })
                }}
              />
            ) : (
              <div style={{
                width: '100%', maxWidth: 740,
                aspectRatio: '16/9',
                borderRadius: 8,
                background: 'white',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9CA3AF', fontSize: 14,
              }}>
                슬라이드를 선택하세요
              </div>
            )}
          </div>

          <CanvasFooter
            slideIndex={activeIndex}
            total={steps.length}
            onPrev={() => setActiveIndex(i => Math.max(0, i - 1))}
            onNext={() => setActiveIndex(i => Math.min(steps.length - 1, i + 1))}
            duration={currentEffects.duration}
          />
        </div>

        <OptionsPanel
          activeTab={activeTab}
          onTab={setActiveTab}
          effects={currentEffects}
          onEffects={updateEffects}
          caption={currentStep?.caption || ''}
          onCaption={updateCaption}
          voiceSource={voiceSource}
          onVoiceSource={setVoiceSource}
          ratio={ratio}
          onRatio={r => {
            setRatio(r)
            fetch(`/api/manuals/${manual.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ output_ratio: r }),
            })
          }}
        />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Inline SVG icons (no dependency)
// ──────────────────────────────────────────────
function SelectIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3l14 9-7 1-4 7-3-17z"/>
    </svg>
  )
}
function MarkerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}
function TypeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  )
}
function SquareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>
  )
}
function CircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  )
}
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}
function ZoomIcon({ color }: { color?: string } = {}) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  )
}
function SparklesIcon({ size = 14, color }: { size?: number; color?: string } = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/>
    </svg>
  )
}
function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  )
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}
function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}
function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}
