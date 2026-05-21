'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import WorkspaceSidebar from '@/components/layout/WorkspaceSidebar'
import * as Icon from '@/components/icons'
import type { MmManual, MmStep } from '@/types'

interface Props {
  manual: MmManual
  steps: MmStep[]
  user: { id: string; name: string; plan: string }
  usage: { used: number; limit: number }
}

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  '클릭': { bg: '#EFF6FF', color: '#1D4ED8' },
  '입력': { bg: '#FEF3C7', color: '#92400E' },
  '확인': { bg: '#ECFDF5', color: '#047857' },
  '선택': { bg: '#F5F3FF', color: '#5B21B6' },
}

function parseAction(title: string) {
  const words = title.split(' ')
  const action = Object.keys(ACTION_COLORS).find(a => words[0] === a) || null
  const target = action ? words.slice(1).join(' ') : title
  return { action, target }
}

function AutoSaveBadge({ saving, saved }: { saving: boolean; saved: boolean }) {
  if (saving) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--mm-text-3)' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mm-warning)', animation: 'mm-pulse-soft 1s infinite' }}/>
      저장 중...
    </span>
  )
  if (saved) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--mm-success)' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}/>
      자동 저장됨
    </span>
  )
  return null
}

export default function GuideModeClient({ manual, steps: initialSteps, user, usage }: Props) {
  const router = useRouter()
  const [steps, setSteps] = useState<MmStep[]>(initialSteps)
  const [activeStep, setActiveStep] = useState<string | null>(initialSteps[0]?.id || null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [title, setTitle] = useState(manual.title)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerSave = useCallback(async (newTitle: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaving(true)
    setSaved(false)
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/manuals/${manual.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 500)
  }, [manual.id])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === steps.length) setSelected(new Set())
    else setSelected(new Set(steps.map(s => s.id)))
  }

  const deleteSelected = async () => {
    if (!selected.size) return
    const ids = Array.from(selected)
    await Promise.all(ids.map(id =>
      fetch(`/api/manuals/${manual.id}/steps/${id}`, { method: 'DELETE' })
    ))
    setSteps(prev => prev.filter(s => !ids.includes(s.id)))
    setSelected(new Set())
  }

  const addStep = async () => {
    const res = await fetch(`/api/manuals/${manual.id}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '새 스텝', step_order: steps.length }),
    })
    const { step } = await res.json()
    if (step) {
      setSteps(prev => [...prev, step])
      setActiveStep(step.id)
    }
  }

  const updateStepCaption = useCallback(async (stepId: string, caption: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaving(true)
    setSaved(false)
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/manuals/${manual.id}/steps/${stepId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      })
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 500)
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, caption } : s))
  }, [manual.id])

  return (
    <div className="mm-screen" style={{ display: 'flex', height: '100vh' }}>
      <WorkspaceSidebar active="my-manuals"/>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{ flexShrink: 0, padding: '14px 28px', borderBottom: '1px solid var(--mm-border)', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--mm-text-3)', marginBottom: 8, cursor: 'pointer' }}
            onClick={() => router.push('/dashboard')}>
            <Icon.ChevronLeft size={13}/>
            <span>내 매뉴얼</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); triggerSave(e.target.value) }}
              style={{
                fontSize: 22, fontWeight: 500, color: 'var(--mm-text-1)',
                flex: 1, padding: '2px 6px', marginLeft: -6, borderRadius: 4,
                border: '1px solid transparent', background: 'transparent', outline: 'none',
                fontFamily: 'var(--mm-font)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--mm-border)')}
              onBlur={e => (e.target.style.borderColor = 'transparent')}
            />
            <button className="mm-btn-ghost" style={{ border: '1px solid var(--mm-border)' }}>
              <Icon.Share size={14}/> 공유
            </button>
            <button className="mm-btn-ghost" style={{ border: '1px solid var(--mm-border)' }}>
              <Icon.Download size={14}/> 내보내기
            </button>
            <button className="mm-btn-grad" onClick={() => router.push(`/manual/${manual.id}/editor`)}>
              <Icon.Sparkles size={14}/> 튜토리얼 만들기
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, fontSize: 12, color: 'var(--mm-text-3)' }}>
            <span><strong style={{ color: 'var(--mm-text-2)', fontWeight: 500 }}>{steps.length}</strong> 스텝</span>
            <span>·</span>
            <span>{new Date(manual.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 생성</span>
            <span>·</span>
            <AutoSaveBadge saving={saving} saved={saved}/>
          </div>
        </header>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div style={{
            flexShrink: 0, padding: '10px 28px',
            background: 'var(--mm-bg-header-dark)', color: 'white',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{selected.size}개 스텝 선택됨</span>
            <button className="mm-btn-ghost" style={{ color: 'white', padding: '6px 10px', fontSize: 12 }}>
              <Icon.Copy size={13}/> 복제
            </button>
            <button onClick={deleteSelected} style={{ color: '#FCA5A5', padding: '6px 10px', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--mm-font)' }}>
              <Icon.Trash size={13}/> 삭제
            </button>
            <div style={{ flex: 1 }}/>
            <button onClick={() => setSelected(new Set())} style={{ color: 'rgba(255,255,255,0.6)', padding: '6px 10px', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mm-font)' }}>
              취소
            </button>
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', minHeight: 0, background: 'white' }}>
          {/* Step nav */}
          <nav style={{ width: 240, flexShrink: 0, borderRight: '1px solid var(--mm-border)', background: '#FCFCFD', padding: '14px 8px', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 10px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--mm-text-2)', cursor: 'pointer', flex: 1 }}>
                <input type="checkbox" checked={selected.size === steps.length && steps.length > 0} onChange={toggleAll} style={{ accentColor: '#4F46E5' }}/>
                <span><strong style={{ fontWeight: 500 }}>{steps.length}</strong> 스텝</span>
              </label>
              <button onClick={addStep} title="스텝 추가" style={{ width: 24, height: 24, borderRadius: 4, color: 'var(--mm-text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}>
                <Icon.Plus size={14}/>
              </button>
              <button onClick={deleteSelected} title="선택 삭제" disabled={selected.size === 0} style={{ width: 24, height: 24, borderRadius: 4, color: selected.size > 0 ? 'var(--mm-danger)' : 'var(--mm-text-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: selected.size > 0 ? 'pointer' : 'default' }}>
                <Icon.Trash size={14}/>
              </button>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {steps.map((s, i) => {
                const { action, target } = parseAction(s.title || '')
                const isActive = activeStep === s.id
                return (
                  <li key={s.id}
                    onClick={() => setActiveStep(s.id)}
                    style={{
                      padding: '8px 10px 8px 12px', borderRadius: 6,
                      borderLeft: `2px solid ${isActive ? '#4F46E5' : 'transparent'}`,
                      background: isActive ? 'rgba(79,70,229,0.06)' : 'transparent',
                      display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer',
                    }}>
                    <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)}
                      onClick={e => e.stopPropagation()}
                      style={{ marginTop: 3, accentColor: '#4F46E5', flexShrink: 0 }}/>
                    <span style={{ fontSize: 11, fontWeight: 500, color: isActive ? 'var(--mm-primary)' : 'var(--mm-text-4)', minWidth: 14 }}>{i + 1}.</span>
                    <span style={{ fontSize: 12.5, color: isActive ? 'var(--mm-text-1)' : 'var(--mm-text-2)', fontWeight: isActive ? 500 : 400, lineHeight: 1.4 }}>
                      {action ? `${action} ${target}` : (target || '새 스텝')}
                    </span>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Body */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px 40px' }}>
            <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {steps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--mm-text-3)' }}>
                  <Icon.File size={40} color="var(--mm-border)"/>
                  <p style={{ marginTop: 14, fontSize: 14 }}>스텝이 없습니다. Chrome 확장으로 녹화하거나 직접 추가하세요.</p>
                  <button className="mm-btn-primary" style={{ marginTop: 16 }} onClick={addStep}>
                    <Icon.Plus size={14}/> 스텝 추가
                  </button>
                </div>
              ) : (
                <>
                  {steps.map((s, i) => (
                    <StepCard
                      key={s.id}
                      step={s}
                      index={i}
                      isActive={activeStep === s.id}
                      isSelected={selected.has(s.id)}
                      onSelect={() => setActiveStep(s.id)}
                      onToggleCheck={() => toggleSelect(s.id)}
                      onUpdate={(caption) => updateStepCaption(s.id, caption)}
                      onDelete={async () => {
                        await fetch(`/api/manuals/${manual.id}/steps/${s.id}`, { method: 'DELETE' })
                        setSteps(prev => prev.filter(x => x.id !== s.id))
                        if (activeStep === s.id) setActiveStep(steps[i + 1]?.id || steps[i - 1]?.id || null)
                      }}
                    />
                  ))}

                  <button onClick={addStep} style={{
                    padding: '10px 0', borderRadius: 8,
                    border: '1.5px dashed var(--mm-border)', color: 'var(--mm-text-3)',
                    fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: 'transparent', cursor: 'pointer', fontFamily: 'var(--mm-font)',
                  }}>
                    <Icon.Plus size={13}/> 스텝 추가
                  </button>

                  <div style={{
                    marginTop: 14, padding: '20px 24px', borderRadius: 12,
                    background: 'var(--mm-grad)', color: 'white',
                    display: 'flex', alignItems: 'center', gap: 16,
                    boxShadow: '0 8px 24px rgba(79,70,229,0.25)',
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon.Sparkles size={22} color="white"/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>인터랙티브 튜토리얼로 만들어보세요</div>
                      <div style={{ fontSize: 12.5, opacity: 0.92 }}>줌인 · 자막 · AI 음성으로 영상보다 빠르게 익히는 학습 경험을 만듭니다.</div>
                    </div>
                    <button
                      onClick={() => router.push(`/manual/${manual.id}/editor`)}
                      style={{ background: 'white', color: 'var(--mm-primary)', padding: '10px 18px', borderRadius: 8, fontWeight: 500, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer', fontFamily: 'var(--mm-font)' }}>
                      튜토리얼 만들기 <Icon.ArrowRight size={14}/>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepCard({ step, index, isActive, isSelected, onSelect, onToggleCheck, onUpdate, onDelete }: {
  step: MmStep
  index: number
  isActive: boolean
  isSelected: boolean
  onSelect: () => void
  onToggleCheck: () => void
  onUpdate: (caption: string) => void
  onDelete: () => void
}) {
  const { action, target } = parseAction(step.title || '')
  const actionStyle = action ? ACTION_COLORS[action] : null

  return (
    <article
      onClick={onSelect}
      style={{
        display: 'flex', gap: 14, padding: '14px 16px 18px', borderRadius: 12,
        border: `1px solid ${isActive ? 'rgba(79,70,229,0.40)' : 'var(--mm-border)'}`,
        background: isActive ? 'rgba(79,70,229,0.02)' : 'white',
        boxShadow: isActive ? '0 0 0 3px rgba(79,70,229,0.08)' : 'none',
        transition: 'all 0.15s', position: 'relative', cursor: 'pointer',
      }}>
      <input type="checkbox" checked={isSelected} onChange={onToggleCheck}
        onClick={e => e.stopPropagation()}
        style={{ marginTop: 4, accentColor: '#4F46E5', flexShrink: 0 }}/>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%', background: 'var(--mm-text-1)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0,
          }}>{index + 1}</span>
          {actionStyle && (
            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, background: actionStyle.bg, color: actionStyle.color, flexShrink: 0 }}>
              {action}
            </span>
          )}
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--mm-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{target || step.title}</span>
        </div>

        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={e => onUpdate(e.currentTarget.textContent || '')}
          onClick={e => e.stopPropagation()}
          style={{
            fontSize: 13.5, color: 'var(--mm-text-2)', lineHeight: 1.55,
            marginBottom: step.screenshot_url ? 12 : 0,
            padding: '4px 6px', marginLeft: -6, borderRadius: 4,
            outline: 'none', minHeight: 24,
            border: '1px solid transparent',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--mm-border)')}
          onBlurCapture={e => (e.currentTarget.style.borderColor = 'transparent')}
        >
          {step.caption || '설명을 입력하세요...'}
        </div>

        {step.screenshot_url && (
          <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--mm-border)', aspectRatio: '16/9', background: '#1F2937' }}>
            <img src={step.screenshot_url} alt={step.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button onClick={e => { e.stopPropagation(); onDelete() }} style={{ width: 26, height: 26, borderRadius: 5, color: 'var(--mm-text-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }} title="삭제">
          <Icon.Trash size={13}/>
        </button>
      </div>
    </article>
  )
}
