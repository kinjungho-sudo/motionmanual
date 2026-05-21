'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import type { MmStep } from '@/types'

interface Marker {
  id: number
  x: number
  y: number
}

interface Description {
  id: number
  title: string
  body: string
}

interface PlayerStep extends MmStep {
  parsedMarkers: Marker[]
  parsedDescriptions: Description[]
}

interface Props {
  manual: { id: string; title: string; output_ratio: string }
  steps: MmStep[]
  authorName: string
}

function parseMarkers(raw: Record<string, unknown>[] | null): Marker[] {
  if (!raw) return []
  return raw.map((m, i) => ({
    id: typeof m.id === 'number' ? m.id : i + 1,
    x: typeof m.x === 'number' ? m.x : 50,
    y: typeof m.y === 'number' ? m.y : 50,
  }))
}

function parseDescriptions(raw: Record<string, unknown>[] | null): Description[] {
  if (!raw) return []
  return raw.map((d, i) => ({
    id: typeof d.id === 'number' ? d.id : i + 1,
    title: typeof d.title === 'string' ? d.title : `항목 ${i + 1}`,
    body: typeof d.body === 'string' ? d.body : '',
  }))
}

export default function PlayerClient({ manual, steps, authorName }: Props) {
  const playerSteps: PlayerStep[] = steps.map(s => ({
    ...s,
    parsedMarkers: parseMarkers(s.markers),
    parsedDescriptions: parseDescriptions(s.descriptions),
  }))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDescPanel, setShowDescPanel] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null)

  const total = playerSteps.length
  const current = playerSteps[currentIndex]

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= total) return
    setCurrentIndex(idx)
    setActiveMarkerId(null)
  }, [total])

  const handleMarkerClick = (id: number) => {
    setActiveMarkerId(prev => prev === id ? null : id)
  }

  const handleDescClick = (id: number) => {
    setActiveMarkerId(prev => prev === id ? null : id)
  }

  const hasDescriptions = current?.parsedDescriptions?.length > 0
  const hasMarkers = current?.parsedMarkers?.length > 0

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0A0A0F',
      color: '#F9FAFB',
      overflow: 'hidden',
      fontFamily: 'var(--mm-font, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    }}>
      {/* Top header */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '14px 22px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: 'var(--mm-primary, #4F46E5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
        }}>M</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{manual.title}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)' }}>
            {authorName} · {total} 슬라이드
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowSidebar(v => !v)}
          title="슬라이드 목록"
          style={{
            width: 32, height: 32, borderRadius: 6,
            color: showSidebar ? 'rgba(165,180,252,0.9)' : 'rgba(255,255,255,0.65)',
            background: showSidebar ? 'rgba(79,70,229,0.22)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="18" rx="1"/>
            <rect x="14" y="3" width="7" height="18" rx="1"/>
          </svg>
        </button>
      </header>

      {/* Left sidebar */}
      <aside style={{
        position: 'absolute', top: 0, bottom: 0, left: 0,
        width: showSidebar ? 200 : 0,
        zIndex: 5,
        background: 'rgba(10, 12, 20, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: showSidebar ? '60px 12px 20px' : '0',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s ease',
      }}>
        {showSidebar && (
          <>
            <div style={{
              fontSize: 10.5, color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: '0 8px 10px',
            }}>슬라이드</div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflow: 'auto', listStyle: 'none', padding: 0, margin: 0 }}>
              {playerSteps.map((s, idx) => {
                const state = idx < currentIndex ? 'done' : idx === currentIndex ? 'current' : 'queued'
                return (
                  <li
                    key={s.id}
                    onClick={() => goTo(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 8px', borderRadius: 6,
                      background: state === 'current' ? 'rgba(79,70,229,0.20)' : 'transparent',
                      fontSize: 11.5,
                      color: state === 'queued' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.92)',
                      fontWeight: state === 'current' ? 500 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                      background:
                        state === 'done' ? '#10B981' :
                        state === 'current' ? '#4F46E5' :
                        'rgba(255,255,255,0.12)',
                      color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 600,
                    }}>
                      {state === 'done' ? (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : idx + 1}
                    </div>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.title || `스텝 ${idx + 1}`}
                    </span>
                  </li>
                )
              })}
            </ul>
            <div style={{
              padding: '10px 8px',
              fontSize: 10.5, color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.4,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              marginTop: 8,
            }}>
              클릭해서 원하는 슬라이드로 이동할 수 있어요
            </div>
          </>
        )}
      </aside>

      {/* Sidebar edge hint */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{
            position: 'absolute', left: 200, top: '50%', transform: 'translateY(-50%)',
            zIndex: 6,
            width: 16, height: 32, borderRadius: '0 8px 8px 0',
            background: 'rgba(10,12,20,0.78)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.45)',
            cursor: 'pointer',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </div>
      )}

      {/* Center canvas */}
      <div style={{
        position: 'absolute',
        top: 60, bottom: 90,
        left: showSidebar ? 220 : 24,
        right: (showDescPanel && hasDescriptions) ? 340 : 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'left 0.25s ease, right 0.3s ease',
      }}>
        <div style={{
          width: '100%',
          aspectRatio: manual.output_ratio || '16/9',
          maxHeight: '100%',
          borderRadius: 12,
          background: '#1a1a2e',
          boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {current?.screenshot_url ? (
            <Image
              src={current.screenshot_url}
              alt={current.title || `스텝 ${currentIndex + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.2)', fontSize: 14,
            }}>
              스크린샷 없음
            </div>
          )}

          {/* Markers */}
          {hasMarkers && current.parsedMarkers.map(m => (
            <button
              key={m.id}
              onClick={() => handleMarkerClick(m.id)}
              className={`mm-marker ${m.id === activeMarkerId ? 'active' : ''}`}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              {m.id}
            </button>
          ))}

          {/* Caption */}
          {current?.caption && (
            <div style={{
              position: 'absolute',
              bottom: 18, left: '50%', transform: 'translateX(-50%)',
              padding: '8px 18px', borderRadius: 6,
              background: 'rgba(0,0,0,0.78)', color: 'white',
              fontSize: 13, fontWeight: 500,
              maxWidth: '80%', textAlign: 'center',
              pointerEvents: 'none',
            }}>
              {current.caption}
            </div>
          )}
        </div>
      </div>

      {/* Right description panel */}
      {showDescPanel && hasDescriptions && (
        <aside style={{
          position: 'absolute', top: 60, bottom: 90, right: 0,
          width: 320,
          background: 'rgba(20, 22, 32, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          padding: '18px 18px 8px',
          overflow: 'auto',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>항목별 설명</div>
            <button
              onClick={() => setShowDescPanel(false)}
              style={{
                width: 26, height: 26, borderRadius: 6,
                color: 'rgba(255,255,255,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.parsedDescriptions.map(desc => {
              const isActive = activeMarkerId === desc.id
              return (
                <div
                  key={desc.id}
                  onClick={() => handleDescClick(desc.id)}
                  style={{
                    padding: 12, borderRadius: 8,
                    background: isActive ? 'rgba(79,70,229,0.16)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? 'rgba(79,70,229,0.40)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: isActive ? '#4F46E5' : 'rgba(255,255,255,0.10)',
                      color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 600,
                    }}>{desc.id}</span>
                    <span style={{
                      fontSize: 12.5, fontWeight: 500,
                      color: isActive ? 'white' : 'rgba(255,255,255,0.85)',
                    }}>{desc.title}</span>
                  </div>
                  <p style={{
                    fontSize: 11.5,
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.55,
                    paddingLeft: 28,
                    margin: 0,
                  }}>{desc.body}</p>
                </div>
              )
            })}
          </div>
        </aside>
      )}

      {/* Bottom control bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 84,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, transparent 100%)',
        padding: '20px 24px 16px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {/* Play controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: currentIndex === 0 ? 'rgba(255,255,255,0.25)' : 'white',
              background: 'transparent', border: 'none', cursor: currentIndex === 0 ? 'default' : 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'white', color: '#111',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
              border: 'none', cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === total - 1}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: currentIndex === total - 1 ? 'rgba(255,255,255,0.25)' : 'white',
              background: 'transparent', border: 'none', cursor: currentIndex === total - 1 ? 'default' : 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Progress dots + label */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {playerSteps.map((_, idx) => {
              const state = idx < currentIndex ? 'done' : idx === currentIndex ? 'current' : 'queued'
              return (
                <div
                  key={idx}
                  onClick={() => goTo(idx)}
                  style={{
                    width: state === 'current' ? 14 : 8,
                    height: state === 'current' ? 14 : 8,
                    borderRadius: '50%',
                    background:
                      state === 'done' ? '#4F46E5' :
                      state === 'current' ? 'white' :
                      'rgba(255,255,255,0.25)',
                    boxShadow: state === 'current' ? '0 0 0 3px rgba(79,70,229,0.45)' : 'none',
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                />
              )
            })}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>
            <strong style={{ color: 'white', fontWeight: 500 }}>{currentIndex + 1}</strong>
            {' '}/ {total} 슬라이드
            {current?.title && (
              <> · {current.title}</>
            )}
          </div>
        </div>

        {/* Panel toggles */}
        <div style={{ display: 'flex', gap: 8 }}>
          {hasDescriptions && (
            <button
              onClick={() => setShowDescPanel(v => !v)}
              title="설명 패널"
              style={{
                width: 32, height: 32, borderRadius: 6,
                background: showDescPanel ? 'rgba(79,70,229,0.25)' : 'rgba(255,255,255,0.06)',
                color: showDescPanel ? '#A5B4FC' : 'rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
