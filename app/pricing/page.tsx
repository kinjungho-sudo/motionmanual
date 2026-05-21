'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Icon from '@/components/icons'

function LandingHeader() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--mm-border-light)',
      padding: '14px 56px', display: 'flex', alignItems: 'center', gap: 32,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon.Logo size={26}/>
        <span style={{ fontSize: 15, fontWeight: 500 }}>MotionManual <span style={{ color: 'var(--mm-primary)' }}>AI</span></span>
      </Link>
      <nav style={{ display: 'flex', gap: 22, fontSize: 13.5, color: 'var(--mm-text-2)' }}>
        <Link href="/">기능</Link>
        <span>사용 방법</span>
        <Link href="/pricing" style={{ color: 'var(--mm-primary)', fontWeight: 500 }}>요금제</Link>
        <span>기업 문의</span>
      </nav>
      <div style={{ flex: 1 }}/>
      <Link href="/auth/login">
        <button style={{ color: 'var(--mm-text-2)', fontSize: 13.5, padding: '6px 12px', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--mm-font)' }}>로그인</button>
      </Link>
      <Link href="/auth/signup">
        <button className="mm-btn-primary">무료로 시작</button>
      </Link>
    </header>
  )
}

function PricingCard({ tier, icon: I, price, note, cta, ctaDisabled, featured, features }: {
  tier: string; icon: React.ComponentType<{ size?: number }>; price: string; note: string;
  cta: string; ctaDisabled?: boolean; featured?: boolean; features: (string | { label: string; phase3: boolean })[]
}) {
  return (
    <div style={{
      padding: 28, borderRadius: 16, background: 'white',
      border: featured ? '2px solid var(--mm-primary)' : '1px solid var(--mm-border)',
      position: 'relative',
      transform: featured ? 'translateY(-6px)' : 'none',
      boxShadow: featured ? '0 16px 40px rgba(79,70,229,0.15)' : 'none',
    }}>
      {featured && (
        <span style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          padding: '4px 14px', borderRadius: 999,
          background: 'var(--mm-grad)', color: 'white', fontSize: 11, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <Icon.Sparkles size={11}/> 가장 인기
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 9,
          background: featured ? 'var(--mm-grad)' : 'var(--mm-border-light)',
          color: featured ? 'white' : 'var(--mm-text-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I size={18}/>
        </div>
        <span style={{ fontSize: 16, fontWeight: 500 }}>{tier}</span>
      </div>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em' }}>{price}</span>
        <span style={{ fontSize: 13, color: 'var(--mm-text-3)' }}>/월</span>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--mm-text-3)', marginBottom: 22 }}>{note}</p>
      <Link href="/auth/signup">
        <button disabled={ctaDisabled} style={{
          width: '100%', padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: ctaDisabled ? 'var(--mm-border-light)' : (featured ? 'var(--mm-grad)' : 'var(--mm-primary)'),
          color: ctaDisabled ? 'var(--mm-text-3)' : 'white',
          marginBottom: 22, cursor: ctaDisabled ? 'default' : 'pointer',
          border: 'none', fontFamily: 'var(--mm-font)',
        }}>{cta}</button>
      </Link>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map((f, i) => {
          const label = typeof f === 'string' ? f : f.label
          const phase3 = typeof f === 'object' && f.phase3
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: 'var(--mm-text-2)' }}>
              <Icon.Check size={14} color="var(--mm-success)" stroke={2.5} style={{ flexShrink: 0, marginTop: 2 }}/>
              <span style={{ flex: 1 }}>
                {label}
                {phase3 && <span className="mm-badge-phase3" style={{ marginLeft: 6 }}>Phase 3</span>}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ComparisonTable() {
  const rows = [
    { feat: '매일 매뉴얼 생성', free: '3개', elite: '무제한', pro: '무제한', key: true },
    { feat: '튜토리얼 매뉴얼', free: '—', elite: '하루 10개', pro: '무제한', key: true },
    { feat: 'AI 다듬기', free: '하루 5회', elite: '무제한', pro: '무제한' },
    { feat: '줌 효과 (Vrew 스타일)', free: '—', elite: '✓', pro: '✓', key: true },
    { feat: 'AI 음성', free: '—', elite: '—', pro: '한국어 · 영어', key: true, phase3: true },
    { feat: '내보내기 형식', free: 'PDF', elite: 'PDF · HTML · MD', pro: 'PDF · HTML · MD' },
    { feat: '비밀번호 보호', free: '—', elite: '—', pro: '✓' },
    { feat: '저장 용량', free: '500MB', elite: '5GB', pro: '무제한' },
    { feat: '우선 처리', free: '—', elite: '—', pro: '✓' },
    { feat: '기술 지원', free: '커뮤니티', elite: '이메일', pro: '1:1 채널' },
  ]
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--mm-border)', background: 'white' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#FAFAFA' }}>
            <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: 500, color: 'var(--mm-text-2)' }}>기능</th>
            <th style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--mm-text-2)', textAlign: 'center' }}>Free</th>
            <th style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--mm-primary)', textAlign: 'center', background: 'rgba(124,58,237,0.05)' }}>
              Elite <span style={{ fontSize: 10, padding: '1px 6px', background: 'var(--mm-grad)', color: 'white', borderRadius: 3, marginLeft: 4 }}>인기</span>
            </th>
            <th style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--mm-text-2)', textAlign: 'center' }}>Pro</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: '1px solid var(--mm-border-light)' }}>
              <td style={{ padding: '12px 20px', color: 'var(--mm-text-1)', fontWeight: r.key ? 500 : 400 }}>
                {r.feat}
                {r.phase3 && <span className="mm-badge-phase3" style={{ marginLeft: 6 }}>Phase 3</span>}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'center', color: r.free === '—' ? 'var(--mm-text-4)' : 'var(--mm-text-2)' }}>{r.free}</td>
              <td style={{ padding: '12px 16px', textAlign: 'center', background: 'rgba(124,58,237,0.04)', color: r.key ? 'var(--mm-primary)' : 'var(--mm-text-2)', fontWeight: r.key ? 500 : 400 }}>{r.elite}</td>
              <td style={{ padding: '12px 16px', textAlign: 'center', color: r.pro === '—' ? 'var(--mm-text-4)' : 'var(--mm-text-2)', fontWeight: r.key ? 500 : 400 }}>{r.pro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  return (
    <div className="mm-screen" style={{ overflow: 'auto', height: '100vh' }}>
      <LandingHeader/>
      <section style={{ padding: '72px 56px 44px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 999,
          background: 'var(--mm-grad-banner)', fontSize: 11.5, fontWeight: 500, color: 'var(--mm-primary)',
          marginBottom: 22, border: '1px solid rgba(124,58,237,0.16)',
        }}>합리적인 가격</div>
        <h1 style={{ fontSize: 44, fontWeight: 500, marginBottom: 14, letterSpacing: '-0.02em' }}>필요한 만큼만 결제하세요</h1>
        <p style={{ fontSize: 15, color: 'var(--mm-text-3)', marginBottom: 28 }}>기본 매뉴얼은 누구나 무료로. 진짜 필요할 때만 업그레이드하세요.</p>
        <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: 'var(--mm-border-light)', borderRadius: 999, marginBottom: 8 }}>
          {[{ label: '월간 결제', val: false }, { label: '연간 결제', val: true }].map(({ label, val }) => (
            <button key={label} onClick={() => setAnnual(val)} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500,
              background: annual === val ? 'white' : 'transparent',
              color: annual === val ? 'var(--mm-text-1)' : 'var(--mm-text-3)',
              boxShadow: annual === val ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', border: 'none', fontFamily: 'var(--mm-font)',
            }}>
              {label}
              {val && <span style={{ padding: '1px 6px', background: '#D1FAE5', color: '#047857', borderRadius: 4, fontSize: 10, fontWeight: 500 }}>2개월 무료</span>}
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 56px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          <PricingCard tier="Free" icon={Icon.Leaf} price="₩0" note="신용카드 없이 바로 시작" cta="현재 플랜" ctaDisabled features={['매일 매뉴얼 3개','기본 매뉴얼 (가이드 문서)','Chrome 확장','텍스트 · 도형 편집','링크 공유 · PDF 내보내기','저장 용량 500MB']}/>
          <PricingCard tier="Elite" icon={Icon.Rocket} price={annual ? '₩7,500' : '₩9,000'} note="개인 크리에이터를 위한 플랜" cta="업그레이드" featured features={['기본 매뉴얼 무제한','튜토리얼 매뉴얼 하루 10개','AI 다듬기 무제한','줌인 + 자막 효과','HTML · MD 내보내기','저장 용량 5GB']}/>
          <PricingCard tier="Pro" icon={Icon.Crown} price={annual ? '₩12,500' : '₩15,000'} note="파워 유저와 전문가를 위한 플랜" cta="업그레이드" features={['튜토리얼 매뉴얼 무제한',{ label: 'AI 음성 (한국어 · 영어)', phase3: true },'우선 처리 · 빠른 큐','비공개 + 비밀번호 보호','저장 용량 무제한','우선 지원 · 1:1 채널']}/>
        </div>
      </section>

      <section style={{ padding: '0 56px 80px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, textAlign: 'center', marginBottom: 28 }}>기능별 상세 비교</h2>
          <ComparisonTable/>
        </div>
      </section>

      <section style={{ padding: '0 56px 80px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', paddingTop: 64 }}>
          <h2 style={{ fontSize: 26, fontWeight: 500, textAlign: 'center', marginBottom: 32, letterSpacing: '-0.01em' }}>자주 묻는 질문</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { q: '언제든 취소할 수 있나요?', a: '네, 마이페이지 > 구독 정보에서 언제든 취소 가능하며, 결제 기간이 끝날 때까지 사용할 수 있어요.' },
              { q: '무료 플랜에서 만든 매뉴얼은 어떻게 되나요?', a: '플랜 변경과 무관하게 그대로 보관됩니다. 다만 Elite/Pro 전용 기능(줌·자막)은 제한될 수 있어요.' },
              { q: '결제 방법은 무엇이 있나요?', a: '국내 신용카드, 해외 신용카드, 카카오페이를 지원합니다.' },
              { q: '플랜은 도중에 변경할 수 있나요?', a: '언제든 업그레이드/다운그레이드 가능하며, 잔여 기간은 일할 정산됩니다.' },
              { q: '환불 정책이 어떻게 되나요?', a: '결제 후 7일 이내, 매뉴얼 5개 미만 생성 시 100% 환불해드립니다.' },
              { q: '팀이나 기업에서 함께 사용하고 싶어요.', a: '곧 출시될 팀 워크스페이스를 기다리시거나, 기업 데모를 신청해주세요.' },
            ].map((f, i) => (
              <details key={i} style={{ background: 'white', borderRadius: 10, border: '1px solid var(--mm-border)', padding: '14px 18px' }}>
                <summary style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', listStyle: 'none' }}>
                  {f.q} <Icon.ChevronDown size={15} color="var(--mm-text-3)"/>
                </summary>
                <p style={{ fontSize: 13, color: 'var(--mm-text-3)', lineHeight: 1.6, marginTop: 10 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
