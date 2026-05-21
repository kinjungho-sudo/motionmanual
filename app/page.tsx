import Link from 'next/link'
import * as Icon from '@/components/icons'
import SupabaseScreenshotMock from '@/components/SupabaseScreenshotMock'

export default function LandingPage() {
  return (
    <div className="mm-screen" style={{ overflow: 'auto', height: '100vh' }}>
      <LandingHeader />
      <Hero />
      <ProblemSection />
      <SolutionSteps />
      <DiffBanner />
      <UseCasesSection />
      <PricingTeaser />
      <B2BSection />
      <FinalCTA />
      <FooterSection />
    </div>
  )
}

function LandingHeader() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--mm-border-light)',
      padding: '14px 56px',
      display: 'flex', alignItems: 'center', gap: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon.Logo size={26}/>
        <span style={{ fontSize: 15, fontWeight: 500 }}>MotionManual <span style={{ color: 'var(--mm-primary)' }}>AI</span></span>
      </div>
      <nav style={{ display: 'flex', gap: 22, fontSize: 13.5, color: 'var(--mm-text-2)' }}>
        <span style={{ cursor: 'pointer' }}>기능</span>
        <span style={{ cursor: 'pointer' }}>사용 방법</span>
        <Link href="/pricing" style={{ cursor: 'pointer' }}>요금제</Link>
        <span style={{ cursor: 'pointer' }}>기업 문의</span>
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

function Hero() {
  return (
    <section style={{ padding: '72px 56px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 999,
          background: 'var(--mm-grad-banner)',
          fontSize: 12, fontWeight: 500, color: 'var(--mm-primary)',
          marginBottom: 22, border: '1px solid rgba(124,58,237,0.16)',
        }}>
          <Icon.Sparkles size={13}/> AI 인터랙티브 매뉴얼 플랫폼
        </div>
        <h1 style={{
          fontSize: 48, fontWeight: 500, lineHeight: 1.15,
          color: 'var(--mm-text-1)', marginBottom: 20, letterSpacing: '-0.02em',
        }}>
          사람들이 읽지 않는<br/>
          <span style={{
            background: 'var(--mm-grad)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>매뉴얼을 따라하게</span> 만드는 AI
        </h1>
        <p style={{ fontSize: 16, color: 'var(--mm-text-2)', lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
          PPT보다 빠르게 만들고, 영상보다 빠르게 익히고, 둘 다 못 하는{' '}
          <strong style={{ fontWeight: 500, color: 'var(--mm-text-1)' }}>인터랙티브 학습</strong>을 제공합니다.
        </p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <Link href="/auth/signup">
            <button className="mm-btn-grad" style={{ padding: '13px 22px', fontSize: 14 }}>
              무료로 시작하기 <Icon.ArrowRight size={15}/>
            </button>
          </Link>
          <button style={{
            padding: '13px 22px', fontSize: 14,
            background: 'white', color: 'var(--mm-text-1)',
            border: '1px solid var(--mm-border)', borderRadius: 8,
            display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--mm-font)',
          }}>
            <Icon.PlayCircle size={15}/> 데모 보기
          </button>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--mm-text-3)' }}>
          {['신용카드 불필요', '매일 3개 무료', '언제든 취소'].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon.Check size={13} color="var(--mm-success)" stroke={2.5}/> {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        position: 'relative', borderRadius: 14,
        background: 'var(--mm-bg-dark)',
        boxShadow: '0 30px 80px rgba(79,70,229,0.18), 0 8px 24px rgba(0,0,0,0.10)',
        overflow: 'hidden',
        transform: 'perspective(1400px) rotateY(-4deg) rotateX(2deg)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
          background: 'rgba(0,0,0,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>
            ))}
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
            Supabase 프로젝트 시작하기 · 5/6
          </div>
        </div>
        <div style={{ position: 'relative', aspectRatio: '16/10', background: '#0A0A0F', padding: 22 }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }}>
            <SupabaseScreenshotMock highlightStep={3}/>
            {[{ id: 1, x: 18, y: 38 }, { id: 2, x: 36, y: 56 }, { id: 3, x: 76, y: 64 }].map(m => (
              <div key={m.id} className={`mm-marker ${m.id === 3 ? 'active' : ''}`}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}>
                {m.id}
              </div>
            ))}
            <div style={{
              position: 'absolute', left: '69%', top: '60%', width: '14%', height: '8%',
              border: '2px solid #4F46E5', borderRadius: 4, boxShadow: '0 0 0 4px rgba(79,70,229,0.22)',
            }}/>
            <div style={{
              position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
              padding: '5px 11px', borderRadius: 4,
              background: 'rgba(0,0,0,0.78)', color: 'white', fontSize: 10, fontWeight: 500,
            }}>
              Configure Google provider 를 클릭합니다
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const probs = [
    { icon: Icon.File, title: 'PDF는 아무도 안 읽어요', body: '40페이지 매뉴얼? 첫 줄에서 닫아버립니다.', tint: '#FEE2E2', accent: '#DC2626' },
    { icon: Icon.Video, title: '영상 제작은 지옥이에요', body: '대본 · 녹화 · 편집 · 자막. 하루가 사라집니다.', tint: '#FEF3C7', accent: '#D97706' },
    { icon: Icon.Layout, title: 'PPT는 너무 오래 걸려요', body: '스크린샷 캡처하고 화살표 그리고… 끝이 안 보여요.', tint: '#E0E7FF', accent: 'var(--mm-primary)' },
  ]
  return (
    <section style={{ padding: '64px 56px', background: '#FAFAFA' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 500, marginBottom: 12, letterSpacing: '-0.01em' }}>이런 문제, 한 번쯤 겪어보셨죠?</h2>
        <p style={{ fontSize: 15, color: 'var(--mm-text-3)', marginBottom: 44 }}>매뉴얼 하나 만드는 데 며칠이 걸립니다. 그런데 막상 보는 사람은 아무도 없습니다.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {probs.map((p, i) => (
            <div key={i} style={{ padding: 28, borderRadius: 14, background: 'white', border: '1px solid var(--mm-border)', textAlign: 'left' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: p.tint, color: p.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                <p.icon size={20}/>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>{p.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--mm-text-3)', lineHeight: 1.6 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionSteps() {
  const steps = [
    { n: 1, title: 'Chrome 확장으로 녹화', body: '평소처럼 웹을 사용하면, 클릭마다 자동으로 스크린샷이 캡처됩니다.', icon: Icon.Chrome },
    { n: 2, title: 'AI가 자동으로 정리', body: '캡처된 화면을 분석해 가이드 문서와 인터랙티브 튜토리얼로 변환합니다.', icon: Icon.Sparkles },
    { n: 3, title: '링크 하나로 공유', body: '동료에게 링크를 보내면, 풀스크린 학습 경험이 바로 시작됩니다.', icon: Icon.Link },
  ]
  return (
    <section style={{ padding: '80px 56px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 32, fontWeight: 500, marginBottom: 12, letterSpacing: '-0.01em' }}>3단계면 충분합니다</h2>
          <p style={{ fontSize: 15, color: 'var(--mm-text-3)' }}>녹화 · AI 정리 · 공유. 그게 전부입니다.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 38, left: '17%', right: '17%',
            height: 2, background: 'linear-gradient(90deg, transparent, var(--mm-border) 12%, var(--mm-border) 88%, transparent)',
            zIndex: 0,
          }}/>
          {steps.map((s) => (
            <div key={s.n} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'white', border: '1px solid var(--mm-border)',
                margin: '0 auto 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', boxShadow: 'var(--mm-shadow-1)',
              }}>
                <s.icon size={26} color="var(--mm-primary)"/>
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--mm-grad)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 500,
                }}>{s.n}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--mm-text-3)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FormulaTile({ label, icon: I, primary }: { label: string; icon: React.ComponentType<{ size?: number }>; primary?: boolean }) {
  return (
    <div style={{
      width: 110, padding: '18px 12px', borderRadius: 12,
      background: primary ? 'white' : 'rgba(255,255,255,0.14)',
      color: primary ? 'var(--mm-primary)' : 'white',
      textAlign: 'center', backdropFilter: 'blur(8px)',
      border: primary ? 'none' : '1px solid rgba(255,255,255,0.18)',
    }}>
      <I size={26}/>
      <div style={{ fontSize: 11.5, fontWeight: 500, marginTop: 10, lineHeight: 1.3 }}>{label}</div>
    </div>
  )
}

function DiffBanner() {
  return (
    <section style={{ padding: '24px 56px' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '48px 56px', borderRadius: 20,
        background: 'var(--mm-grad)', color: 'white',
        position: 'relative', overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56, alignItems: 'center',
        boxShadow: '0 20px 60px rgba(79,70,229,0.30)',
      }}>
        <div style={{
          position: 'absolute', top: -80, right: -60,
          width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.10)',
        }}/>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            핵심 차별점
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            하나의 매뉴얼 데이터로<br/>세 가지 방식으로 모두 보여줍니다.
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center', position: 'relative' }}>
          <FormulaTile label="PPT 매뉴얼" icon={Icon.Layout}/>
          <span style={{ fontSize: 28, fontWeight: 300 }}>+</span>
          <FormulaTile label="영상 튜토리얼" icon={Icon.Video}/>
          <span style={{ fontSize: 28, fontWeight: 300 }}>=</span>
          <FormulaTile label="MotionManual" icon={Icon.Sparkles} primary/>
        </div>
      </div>
    </section>
  )
}

function UseCasesSection() {
  const cases = [
    { icon: Icon.Users, title: '교육 강사', body: '수강생 실습 가이드를 5분 만에 제작합니다.', stat: '강의 준비 70% 절감' },
    { icon: Icon.Video, title: '유튜브 크리에이터', body: '영상 보조 자료 · 쇼츠/릴스 추출까지.', stat: '편집 시간 1/3 단축' },
    { icon: Icon.Mail, title: '고객 지원팀', body: '반복 문의를 인터랙티브 답변으로 자동화.', stat: '문의 40% 자동 해결' },
    { icon: Icon.Folder, title: '사내 교육', body: '신입 온보딩 · 업무 SOP를 한 번에.', stat: '온보딩 5일 → 2일' },
  ]
  return (
    <section style={{ padding: '80px 56px', background: '#FAFAFA' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 500, marginBottom: 12, letterSpacing: '-0.01em' }}>이런 분들이 쓰고 있어요</h2>
          <p style={{ fontSize: 15, color: 'var(--mm-text-3)' }}>매뉴얼이 필요한 곳이라면 어디서든.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {cases.map((c, i) => (
            <div key={i} style={{ padding: 22, borderRadius: 14, background: 'white', border: '1px solid var(--mm-border)' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9,
                background: 'var(--mm-grad-banner)', color: 'var(--mm-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                <c.icon size={18}/>
              </div>
              <h3 style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontSize: 12.5, color: 'var(--mm-text-3)', lineHeight: 1.55, marginBottom: 12 }}>{c.body}</p>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--mm-primary)', padding: '4px 8px', background: 'var(--mm-grad-banner)', borderRadius: 5, display: 'inline-block' }}>
                {c.stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingTeaser() {
  const tiers = [
    { name: 'Free', price: '₩0', icon: Icon.Leaf, sub: '신용카드 없이 바로', cta: '시작하기', featured: false },
    { name: 'Elite', price: '₩9,000', icon: Icon.Rocket, sub: '개인 크리에이터', cta: '업그레이드', featured: true },
    { name: 'Pro', price: '₩15,000', icon: Icon.Crown, sub: '파워 유저 · 전문가', cta: '문의하기', featured: false },
  ]
  return (
    <section style={{ padding: '80px 56px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontSize: 32, fontWeight: 500, marginBottom: 12, letterSpacing: '-0.01em' }}>합리적인 가격</h2>
          <p style={{ fontSize: 15, color: 'var(--mm-text-3)' }}>기본은 무료. 진짜 필요할 때만 업그레이드하세요.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {tiers.map((p, i) => (
            <div key={i} style={{
              padding: 24, borderRadius: 14, background: 'white',
              border: p.featured ? '2px solid var(--mm-primary)' : '1px solid var(--mm-border)',
              textAlign: 'center', position: 'relative',
              transform: p.featured ? 'translateY(-4px)' : 'none',
              boxShadow: p.featured ? '0 12px 32px rgba(79,70,229,0.15)' : 'none',
            }}>
              {p.featured && (
                <span style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  padding: '3px 10px', borderRadius: 999,
                  background: 'var(--mm-grad)', color: 'white', fontSize: 10.5, fontWeight: 500,
                }}>가장 인기</span>
              )}
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: p.featured ? 'var(--mm-grad)' : 'var(--mm-border-light)',
                color: p.featured ? 'white' : 'var(--mm-text-2)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>
                <p.icon size={19}/>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 28, fontWeight: 500, marginBottom: 2 }}>
                {p.price}<span style={{ fontSize: 13, color: 'var(--mm-text-3)', fontWeight: 400 }}>/월</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--mm-text-3)', marginBottom: 14 }}>{p.sub}</div>
              <Link href="/pricing">
                <button style={{
                  width: '100%', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: p.featured ? 'var(--mm-grad)' : 'var(--mm-border-light)',
                  color: p.featured ? 'white' : 'var(--mm-text-1)',
                  cursor: 'pointer', border: 'none', fontFamily: 'var(--mm-font)',
                }}>
                  {p.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function B2BSection() {
  const metrics = [
    { stat: '70%', label: '교육 시간 절감', icon: Icon.Clock },
    { stat: '40%', label: '반복 문의 감소', icon: Icon.Mail },
    { stat: '5분', label: '평균 매뉴얼 제작', icon: Icon.Zap },
  ]
  return (
    <section style={{ padding: '88px 56px', background: '#0A0A0F', color: 'white' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', gap: 6, alignItems: 'center',
          padding: '4px 12px', borderRadius: 999,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
          fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginBottom: 24,
        }}>For Business</div>
        <h2 style={{ fontSize: 36, fontWeight: 500, marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          기업의 교육과 고객 지원,<br/>
          <span style={{
            background: 'var(--mm-grad)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>자동화하세요</span>
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 44 }}>
          보안 솔루션 기업 · SaaS · MSP. 신입 온보딩부터 고객 지원까지.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 44 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              padding: 28, borderRadius: 14,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left',
            }}>
              <m.icon size={20} color="#A5B4FC"/>
              <div style={{
                fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 12, marginBottom: 4,
                background: 'var(--mm-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                display: 'inline-block',
              }}>{m.stat}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <button className="mm-btn-grad" style={{ padding: '13px 26px', fontSize: 14 }}>
          기업 데모 신청하기 <Icon.ArrowRight size={15}/>
        </button>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{ padding: '80px 56px' }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto', padding: '64px 56px', borderRadius: 20,
        background: 'var(--mm-grad-banner)', border: '1px solid rgba(124,58,237,0.18)', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 34, fontWeight: 500, marginBottom: 14, letterSpacing: '-0.02em' }}>
          오늘 처음 만드는 매뉴얼,<br/>5분이면 충분합니다.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--mm-text-3)', marginBottom: 28 }}>
          신용카드 없이 바로 시작하세요. 매일 매뉴얼 3개를 무료로 만들 수 있어요.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/auth/signup">
            <button className="mm-btn-grad" style={{ padding: '13px 26px', fontSize: 14 }}>
              무료로 시작하기 <Icon.ArrowRight size={15}/>
            </button>
          </Link>
          <button style={{
            padding: '13px 22px', fontSize: 14, background: 'white',
            color: 'var(--mm-text-1)', border: '1px solid var(--mm-border)', borderRadius: 8, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--mm-font)',
          }}>
            기업 문의
          </button>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  const groups = [
    { title: '제품', items: ['기능','요금제','Chrome 확장','업데이트'] },
    { title: '회사', items: ['소개','블로그','채용','문의'] },
    { title: '법적 고지', items: ['이용약관','개인정보처리방침','쿠키 정책'] },
  ]
  return (
    <footer style={{ borderTop: '1px solid var(--mm-border)', padding: '40px 56px 28px', background: 'white' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon.Logo size={22}/>
            <span style={{ fontSize: 14, fontWeight: 500 }}>MotionManual <span style={{ color: 'var(--mm-primary)' }}>AI</span></span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--mm-text-3)', lineHeight: 1.6, maxWidth: 280 }}>
            사람들이 읽지 않는 매뉴얼을 따라하게 만드는 AI 인터랙티브 매뉴얼 플랫폼.
          </p>
        </div>
        {groups.map((g, i) => (
          <div key={i}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, color: 'var(--mm-text-1)' }}>{g.title}</div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {g.items.map((item, j) => (
                <li key={j} style={{ fontSize: 12.5, color: 'var(--mm-text-3)', cursor: 'pointer' }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ paddingTop: 18, borderTop: '1px solid var(--mm-border-light)', display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--mm-text-4)' }}>
        <span>© 2026 코마인드웍스 · 모든 권리 보유</span>
        <span>MotionManual AI v1.0</span>
      </div>
    </footer>
  )
}
