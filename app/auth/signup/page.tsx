'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Icon from '@/components/icons'
import { createClient } from '@/lib/supabase'

function AuthBrandSide() {
  const features = [
    { icon: Icon.Chrome, label: 'Chrome 확장으로 한 번에 녹화' },
    { icon: Icon.Sparkles, label: 'AI가 자동으로 매뉴얼 정리' },
    { icon: Icon.Link, label: '링크 하나로 풀스크린 학습' },
  ]
  return (
    <div style={{
      width: '44%', flexShrink: 0, background: 'var(--mm-grad)', color: 'white',
      padding: '40px 44px', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -80, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }}/>
      <div style={{ position: 'absolute', bottom: -100, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(0,0,0,0.10)' }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <Icon.Logo size={28}/>
        <span style={{ fontSize: 15, fontWeight: 500 }}>MotionManual <span style={{ opacity: 0.8 }}>AI</span></span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <h2 style={{ fontSize: 36, fontWeight: 500, lineHeight: 1.2, marginBottom: 18, whiteSpace: 'pre-line', letterSpacing: '-0.01em' }}>
          {'5분 만에\n시작하세요'}
        </h2>
        <p style={{ fontSize: 14, opacity: 0.88, lineHeight: 1.6, marginBottom: 28, maxWidth: 340 }}>
          신용카드 없이, 매일 매뉴얼 3개까지 무료로 만들어보세요.
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={14} color="white"/>
              </span>
              <span style={{ fontSize: 13, opacity: 0.95 }}>{f.label}</span>
            </li>
          ))}
        </ul>
        <div style={{
          marginTop: 28, padding: 14, background: 'rgba(255,255,255,0.08)', borderRadius: 10,
          fontSize: 12.5, lineHeight: 1.5, backdropFilter: 'blur(8px)',
        }}>
          <strong style={{ fontWeight: 500 }}>🎁 신규 가입 혜택</strong><br/>
          첫 7일간 Elite 플랜 무료 체험
        </div>
      </div>
      <div style={{ fontSize: 11, opacity: 0.6, position: 'relative' }}>© 2026 코마인드웍스</div>
    </div>
  )
}

function getPasswordStrength(pw: string): number {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [allAgree, setAllAgree] = useState(false)
  const [consents, setConsents] = useState({ age: false, terms: false, privacy: false, marketing: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pwStrength = getPasswordStrength(password)
  const strengthLabels = ['', '약함', '보통', '강함', '매우 강함']
  const strengthColors = ['', '#DC2626', '#F59E0B', '#10B981', '#059669']

  function toggleAll(checked: boolean) {
    setAllAgree(checked)
    setConsents({ age: checked, terms: checked, privacy: checked, marketing: checked })
  }

  function toggleConsent(key: keyof typeof consents, checked: boolean) {
    const next = { ...consents, [key]: checked }
    setConsents(next)
    setAllAgree(Object.values(next).every(Boolean))
  }

  const requiredMet = consents.age && consents.terms && consents.privacy
  const canSubmit = name && email && password.length >= 8 && requiredMet

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('mm_users').upsert({
        id: data.user.id, email, name,
        auth_provider: 'email',
        consent_age: consents.age,
        consent_terms: consents.terms,
        consent_privacy: consents.privacy,
        consent_marketing: consents.marketing,
      })
    }
    router.push('/dashboard')
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    })
  }

  return (
    <div className="mm-screen" style={{ display: 'flex', height: '100vh' }}>
      <AuthBrandSide/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 56px', position: 'relative', overflowY: 'auto' }}>
        <div style={{ position: 'absolute', top: 28, right: 36, fontSize: 13, color: 'var(--mm-text-3)' }}>
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" style={{ color: 'var(--mm-primary)', fontWeight: 500 }}>로그인</Link>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontSize: 26, fontWeight: 500, marginBottom: 6 }}>회원가입</h1>
          <p style={{ fontSize: 13.5, color: 'var(--mm-text-3)', marginBottom: 22 }}>누구나 쉽게, 무료로 시작해보세요.</p>

          <button onClick={handleGoogle} style={{
            width: '100%', padding: '10px 14px',
            border: '1px solid var(--mm-border)', borderRadius: 8, background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 13, fontWeight: 500, color: 'var(--mm-text-1)', marginBottom: 16,
            cursor: 'pointer', fontFamily: 'var(--mm-font)',
          }}>
            <Icon.GoogleG size={16}/> Google로 가입하기
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--mm-border)' }}/>
            <span style={{ fontSize: 11, color: 'var(--mm-text-4)' }}>또는</span>
            <div style={{ flex: 1, height: 1, background: 'var(--mm-border)' }}/>
          </div>

          <form onSubmit={handleSignup}>
            {[
              { label: '이름', placeholder: '홍길동', value: name, onChange: setName, type: 'text' },
              { label: '이메일', placeholder: 'you@example.com', value: email, onChange: setEmail, type: 'email' },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--mm-text-2)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={f.value} onChange={e => f.onChange(e.target.value)} style={{
                  width: '100%', padding: '10px 12px', border: '1px solid var(--mm-border)', borderRadius: 8,
                  background: 'white', fontSize: 13.5, outline: 'none', fontFamily: 'var(--mm-font)',
                }}/>
              </div>
            ))}

            <div style={{ marginBottom: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--mm-text-2)', display: 'block', marginBottom: 5 }}>비밀번호</label>
              <input type="password" placeholder="8자 이상" value={password} onChange={e => setPassword(e.target.value)} style={{
                width: '100%', padding: '10px 12px', border: '1px solid var(--mm-border)', borderRadius: 8,
                background: 'white', fontSize: 13.5, outline: 'none', fontFamily: 'var(--mm-font)',
              }}/>
            </div>

            {password && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: i < pwStrength ? strengthColors[pwStrength] : 'var(--mm-border)',
                    }}/>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--mm-text-3)' }}>
                  <span style={{ color: strengthColors[pwStrength], fontWeight: 500 }}>{strengthLabels[pwStrength]}</span>
                  {pwStrength >= 3 && ' · 숫자, 영문, 특수문자 포함'}
                </div>
              </div>
            )}

            {/* PIPA 4-gate */}
            <div style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--mm-border)', background: '#FCFCFD', marginBottom: 16 }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 500, color: 'var(--mm-text-1)',
                paddingBottom: 10, borderBottom: '1px dashed var(--mm-border)', marginBottom: 10, cursor: 'pointer',
              }}>
                <input type="checkbox" checked={allAgree} onChange={e => toggleAll(e.target.checked)} style={{ accentColor: '#4F46E5' }}/>
                전체 동의
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { key: 'age' as const, required: true, label: '만 14세 이상입니다' },
                  { key: 'terms' as const, required: true, label: '이용약관 동의', link: '/legal/terms' },
                  { key: 'privacy' as const, required: true, label: '개인정보 수집·이용 동의', link: '/legal/privacy', sub: '위탁: Supabase, Vercel, Anthropic (미국)' },
                  { key: 'marketing' as const, required: false, label: '마케팅 정보 수신 동의' },
                ].map((g) => (
                  <label key={g.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--mm-text-2)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={consents[g.key]} onChange={e => toggleConsent(g.key, e.target.checked)} style={{ marginTop: 2, accentColor: '#4F46E5' }}/>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: g.required ? 'var(--mm-text-1)' : 'var(--mm-text-3)' }}>
                        <span style={{ color: g.required ? '#DC2626' : 'var(--mm-text-4)', marginRight: 4 }}>[{g.required ? '필수' : '선택'}]</span>
                        {g.label}
                      </span>
                      {g.link && <Link href={g.link} style={{ marginLeft: 6, color: 'var(--mm-primary)', fontSize: 11.5 }}>보기</Link>}
                      {g.sub && <div style={{ fontSize: 10.5, color: 'var(--mm-text-4)', marginTop: 2 }}>{g.sub}</div>}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && <p style={{ fontSize: 12, color: 'var(--mm-danger)', marginBottom: 12 }}>{error}</p>}

            <button type="submit" disabled={!canSubmit || loading} className="mm-btn-grad" style={{
              width: '100%', justifyContent: 'center', padding: '11px', fontSize: 13.5,
              opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}>
              {loading ? '가입 중...' : <>무료로 시작하기 <Icon.ArrowRight size={14}/></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
