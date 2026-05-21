'use client'

import WorkspaceSidebar from '@/components/layout/WorkspaceSidebar'
import WorkspaceHeader from '@/components/layout/WorkspaceHeader'
import * as Icon from '@/components/icons'
import type { MmSubscription } from '@/types'

interface Props {
  user: { id: string; email: string; name: string; avatar_url?: string | null; auth_provider?: string | null; plan: string }
  usage: { dailyUsed: number; dailyLimit: number; totalManuals: number }
  subscription: MmSubscription | null
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ padding: 18, borderRadius: 12, background: 'white', border: '1px solid var(--mm-border)' }}>
      {children}
    </section>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14, color: 'var(--mm-text-1)' }}>{children}</h2>
}

function UsageRow({ label, used, max, unit, warn }: { label: string; used: number; max: number | string; unit: string; warn?: boolean }) {
  const pct = typeof max === 'number' ? Math.min(100, (used / max) * 100) : 0
  const color = warn && pct >= 66 ? '#F59E0B' : warn ? '#DC2626' : 'var(--mm-primary)'
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: 'var(--mm-text-2)' }}>{label}</span>
        <span style={{ color: 'var(--mm-text-1)', fontWeight: 500 }}>
          {used}<span style={{ color: 'var(--mm-text-4)' }}> / {max}{typeof max === 'number' && unit}</span>
        </span>
      </div>
      {typeof max === 'number' && (
        <div style={{ height: 5, borderRadius: 3, background: 'var(--mm-border-light)', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }}/>
        </div>
      )}
    </div>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: 12.5, borderTop: '1px solid var(--mm-border-light)' }}>
      <span style={{ color: 'var(--mm-text-3)' }}>{label}</span>
      <span style={{ color: 'var(--mm-text-1)' }}>{value}</span>
    </div>
  )
}

export default function MyPageClient({ user, usage, subscription }: Props) {
  const initials = user.name ? user.name.charAt(0) : user.email.charAt(0)
  const pct = usage.dailyUsed / usage.dailyLimit

  return (
    <div className="mm-screen" style={{ display: 'flex', height: '100vh' }}>
      <WorkspaceSidebar active="mypage"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <WorkspaceHeader usage={{ used: usage.dailyUsed, limit: usage.dailyLimit }} userName={user.name}/>
        <main style={{ flex: 1, overflow: 'auto', padding: '32px 40px 40px', background: 'var(--mm-bg-side)' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 4 }}>마이페이지</h1>
            <p style={{ fontSize: 13, color: 'var(--mm-text-3)', marginBottom: 24 }}>계정 정보와 구독 상태를 관리하세요.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Card>
                  <CardTitle>프로필 정보</CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0 16px' }}>
                    <div style={{
                      width: 72, height: 72, borderRadius: '50%', background: 'var(--mm-grad)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 28, fontWeight: 500,
                    }}>{initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 17, fontWeight: 500 }}>{user.name || '사용자'}</span>
                        {user.auth_provider === 'google' && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 7px', borderRadius: 999,
                            background: '#F3F4F6', fontSize: 10.5, fontWeight: 500, color: 'var(--mm-text-2)',
                          }}>
                            <Icon.GoogleG size={11}/> Google 연동
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--mm-text-3)' }}>{user.email}</div>
                    </div>
                    <button className="mm-btn-ghost" style={{ border: '1px solid var(--mm-border)' }}>사진 변경</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, borderTop: '1px solid var(--mm-border-light)', paddingTop: 16 }}>
                    {[
                      { label: '이름', value: user.name || '—' },
                      { label: '이메일', value: user.email, locked: true },
                      { label: '가입일', value: '2026년 5월' },
                      { label: '마지막 로그인', value: '오늘' },
                    ].map((r, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 11, color: 'var(--mm-text-3)', marginBottom: 3 }}>{r.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--mm-text-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {r.value}
                          {r.locked && <Icon.Lock size={11} color="var(--mm-text-4)"/>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardTitle>계정 관리</CardTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                    {[
                      {
                        icon: Icon.Lock, title: '비밀번호 변경',
                        sub: user.auth_provider === 'google' ? 'Google 계정으로 가입하셨어요. Google 계정에서 관리하세요.' : '현재 비밀번호를 입력해 변경할 수 있어요.',
                        action: user.auth_provider === 'google' ? (
                          <button style={{ padding: '7px 12px', borderRadius: 6, fontSize: 12, color: 'var(--mm-text-2)', border: '1px solid var(--mm-border)', display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', background: 'white', fontFamily: 'var(--mm-font)' }}>
                            Google 계정으로 <Icon.ArrowUpRight size={11}/>
                          </button>
                        ) : null,
                      },
                      {
                        icon: Icon.X, title: '로그아웃', sub: '이 기기에서 로그아웃합니다.',
                        action: (
                          <form action="/api/auth/signout" method="POST">
                            <button type="submit" className="mm-btn-ghost" style={{ border: '1px solid var(--mm-border)' }}>로그아웃</button>
                          </form>
                        ),
                      },
                    ].map((a, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                        borderRadius: 8, background: 'var(--mm-bg-side)', border: '1px solid var(--mm-border-light)',
                      }}>
                        <div style={{ width: 32, height: 32, borderRadius: 7, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mm-text-2)', border: '1px solid var(--mm-border-light)' }}>
                          <a.icon size={15}/>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--mm-text-3)', marginTop: 1 }}>{a.sub}</div>
                        </div>
                        {a.action}
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', border: '1px solid var(--mm-border-light)' }}>
                        <Icon.Trash size={15}/>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#DC2626' }}>회원 탈퇴</div>
                        <div style={{ fontSize: 11.5, color: 'var(--mm-text-3)', marginTop: 1 }}>모든 매뉴얼이 영구 삭제됩니다. 되돌릴 수 없어요.</div>
                      </div>
                      <button style={{ padding: '7px 12px', borderRadius: 6, fontSize: 12, color: '#DC2626', fontWeight: 500, border: '1px solid rgba(220,38,38,0.30)', cursor: 'pointer', background: 'white', fontFamily: 'var(--mm-font)' }}>탈퇴하기</button>
                    </div>
                  </div>
                </Card>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: 20, borderRadius: 14, background: 'var(--mm-grad)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }}/>
                  <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center', padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', fontSize: 10.5, fontWeight: 500, marginBottom: 10 }}>
                    <Icon.Star size={11}/> 현재 플랜
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 2, position: 'relative', textTransform: 'capitalize' }}>{user.plan}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16, position: 'relative' }}>{user.plan === 'free' ? '₩0/월' : user.plan === 'elite' ? '₩9,000/월' : '₩15,000/월'}</div>
                  {user.plan === 'free' && (
                    <button style={{ width: '100%', padding: '9px', background: 'white', color: 'var(--mm-primary)', borderRadius: 7, fontSize: 12.5, fontWeight: 500, position: 'relative', cursor: 'pointer', border: 'none', fontFamily: 'var(--mm-font)' }}>
                      Elite로 업그레이드 →
                    </button>
                  )}
                </div>

                <Card>
                  <CardTitle>이번 달 사용량</CardTitle>
                  <UsageRow label="오늘 만든 매뉴얼" used={usage.dailyUsed} max={usage.dailyLimit} unit="개" warn={pct >= 0.66}/>
                  <UsageRow label="저장된 매뉴얼" used={usage.totalManuals} max="무제한" unit="개"/>
                  <UsageRow label="저장 용량" used={148} max={500} unit="MB"/>
                  <div style={{ fontSize: 10.5, color: 'var(--mm-text-4)', marginTop: 6 }}>매일 자정에 초기화됩니다.</div>
                </Card>

                <Card>
                  <CardTitle>구독 정보</CardTitle>
                  <KV label="결제 방법" value={subscription?.payment_method || '—'}/>
                  <KV label="다음 결제일" value={subscription?.next_billing_at ? new Date(subscription.next_billing_at).toLocaleDateString('ko-KR') : '—'}/>
                  <span style={{ fontSize: 11.5, color: 'var(--mm-primary)', marginTop: 6, display: 'inline-block', cursor: 'pointer' }}>결제 내역 보기 →</span>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
