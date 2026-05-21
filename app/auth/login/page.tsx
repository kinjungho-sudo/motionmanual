'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import * as Icon from '@/components/icons'
import { createClient } from '@/lib/supabase'

function AuthBrandSide({ kind }: { kind: 'login' | 'signup' }) {
  const title = kind === 'login' ? '다시 오신 걸\n환영합니다' : '5분 만에\n시작하세요'
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
        <h2 style={{ fontSize: 36, fontWeight: 500, lineHeight: 1.2, marginBottom: 18, whiteSpace: 'pre-line', letterSpacing: '-0.01em' }}>{title}</h2>
        <p style={{ fontSize: 14, opacity: 0.88, lineHeight: 1.6, marginBottom: 28, maxWidth: 340 }}>
          {kind === 'signup'
            ? '신용카드 없이, 매일 매뉴얼 3개까지 무료로 만들어보세요.'
            : '계속해서 인터랙티브 매뉴얼을 만들고 공유하세요.'}
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,255,255,0.16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={14} color="white"/>
              </span>
              <span style={{ fontSize: 13, opacity: 0.95 }}>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ fontSize: 11, opacity: 0.6, position: 'relative' }}>© 2026 코마인드웍스</div>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    router.push(next)
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${next}` },
    })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 56px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 28, right: 36, fontSize: 13, color: 'var(--mm-text-3)' }}>
        처음이신가요?{' '}
        <Link href="/auth/signup" style={{ color: 'var(--mm-primary)', fontWeight: 500 }}>회원가입</Link>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 380, width: '100%', margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 500, marginBottom: 6 }}>로그인</h1>
        <p style={{ fontSize: 13.5, color: 'var(--mm-text-3)', marginBottom: 28 }}>
          Google 계정으로 접속하여 회원 가입없이 시작하세요.
        </p>

        <button onClick={handleGoogle} style={{
          width: '100%', padding: '11px 14px',
          border: '1px solid var(--mm-border)', borderRadius: 8, background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 13.5, fontWeight: 500, color: 'var(--mm-text-1)', marginBottom: 20,
          cursor: 'pointer', fontFamily: 'var(--mm-font)',
        }}>
          <Icon.GoogleG size={17}/> Google 계정으로 로그인
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--mm-border)' }}/>
          <span style={{ fontSize: 11, color: 'var(--mm-text-4)' }}>또는 이메일로</span>
          <div style={{ flex: 1, height: 1, background: 'var(--mm-border)' }}/>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--mm-text-2)', display: 'block', marginBottom: 5 }}>이메일</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={{
              width: '100%', padding: '10px 12px', border: '1px solid var(--mm-border)', borderRadius: 8,
              background: 'white', fontSize: 13.5, color: 'var(--mm-text-1)', outline: 'none', fontFamily: 'var(--mm-font)',
            }}/>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--mm-text-2)' }}>비밀번호</label>
              <span style={{ fontSize: 11.5, color: 'var(--mm-primary)', cursor: 'pointer' }}>비밀번호 찾기</span>
            </div>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{
              width: '100%', padding: '10px 12px', border: '1px solid var(--mm-border)', borderRadius: 8,
              background: 'white', fontSize: 13.5, color: 'var(--mm-text-1)', outline: 'none', fontFamily: 'var(--mm-font)',
            }}/>
          </div>

          {error && <p style={{ fontSize: 12, color: 'var(--mm-danger)', marginBottom: 12 }}>{error}</p>}

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--mm-text-2)', marginBottom: 18, cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#4F46E5' }}/>
            로그인 상태 유지
          </label>

          <button type="submit" disabled={loading} className="mm-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div style={{
          marginTop: 22, padding: '11px 14px', background: 'var(--mm-border-light)', borderRadius: 8,
          fontSize: 11.5, color: 'var(--mm-text-3)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon.Chrome size={14} color="var(--mm-text-3)"/>
          Chrome 확장 사용자도 여기서 로그인하세요.
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="mm-screen" style={{ display: 'flex', height: '100vh' }}>
      <AuthBrandSide kind="login"/>
      <Suspense fallback={<div style={{ flex: 1 }}/>}>
        <LoginForm/>
      </Suspense>
    </div>
  )
}
