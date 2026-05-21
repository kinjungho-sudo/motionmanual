'use client'

import WorkspaceSidebar from '@/components/layout/WorkspaceSidebar'
import WorkspaceHeader from '@/components/layout/WorkspaceHeader'
import * as Icon from '@/components/icons'
import type { MmManual } from '@/types'

interface Props {
  user: { id: string; email: string; name: string }
  manuals: MmManual[]
  usage: { used: number; limit: number }
}

const COLORS = ['#EEF2FF', '#FAE8FF', '#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3']
const TINTS = ['#A5B4FC', '#D8B4FE', '#FCD34D', '#93C5FD', '#6EE7B7', '#F9A8D4']

const DEMO_MANUALS = [
  { id: 'd1', title: 'Supabase 프로젝트 시작하기', step_count: 6, mode: 'tutorial', created_at: '오늘', cover: 3 },
  { id: 'd2', title: 'Figma 컴포넌트 만들기', step_count: 12, mode: 'guide', created_at: '어제', cover: 1 },
  { id: 'd3', title: 'Notion 페이지 공유 설정', step_count: 4, mode: 'guide', created_at: '3일 전', cover: 2 },
  { id: 'd4', title: 'Vercel 도메인 연결', step_count: 8, mode: 'tutorial', created_at: '5월 16일', cover: 4 },
  { id: 'd5', title: 'GitHub PR 리뷰 워크플로', step_count: 9, mode: 'tutorial', created_at: '5월 15일', cover: 5 },
  { id: 'd6', title: 'Slack 워크플로 자동화', step_count: 5, mode: 'guide', created_at: '5월 14일', cover: 0 },
]

function ManualCard({ title, steps, mode, date, cover }: { title: string; steps: number; mode: string; date: string; cover: number }) {
  const bg = COLORS[cover % COLORS.length]
  const tint = TINTS[cover % TINTS.length]
  return (
    <div style={{
      borderRadius: 12, border: '1px solid var(--mm-border)',
      background: 'white', overflow: 'hidden', cursor: 'pointer',
      transition: 'all 0.15s',
    }}>
      <div style={{
        aspectRatio: '16/9', background: bg,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '78%', height: '70%', borderRadius: 6, background: 'white',
          boxShadow: '0 4px 14px rgba(0,0,0,0.10)', padding: 8,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ height: 5, width: '40%', background: tint, borderRadius: 2 }}/>
          <div style={{ height: 4, width: '90%', background: '#F3F4F6', borderRadius: 2 }}/>
          <div style={{ height: 4, width: '75%', background: '#F3F4F6', borderRadius: 2 }}/>
          <div style={{ flex: 1 }}/>
          <div style={{ height: 12, width: '38%', background: tint, borderRadius: 3, alignSelf: 'flex-end', opacity: 0.7 }}/>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 5 }}>
          <span style={{
            padding: '2px 7px', borderRadius: 999,
            background: 'rgba(255,255,255,0.92)', color: 'var(--mm-text-2)',
            fontSize: 10, fontWeight: 500,
          }}>{steps} 스텝</span>
          {mode === 'tutorial' ? (
            <span className="mm-badge-ai" style={{ fontSize: 9 }}>
              <Icon.Sparkles size={9}/> 튜토리얼
            </span>
          ) : (
            <span style={{
              padding: '2px 7px', borderRadius: 999,
              background: 'rgba(255,255,255,0.92)', color: 'var(--mm-text-3)',
              fontSize: 10, fontWeight: 500,
            }}>기본</span>
          )}
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <h3 style={{
          fontSize: 14, fontWeight: 500, color: 'var(--mm-text-1)', marginBottom: 6,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</h3>
        <div style={{ fontSize: 11.5, color: 'var(--mm-text-4)' }}>{date}</div>
      </div>
    </div>
  )
}

export default function DashboardClient({ user, manuals, usage }: Props) {
  const showManuals = manuals.length > 0 ? manuals : DEMO_MANUALS

  return (
    <div className="mm-screen" style={{ display: 'flex', height: '100vh' }}>
      <WorkspaceSidebar active="home"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <WorkspaceHeader usage={usage} userName={user.name || user.email}/>
        <main style={{ flex: 1, overflow: 'auto', padding: '32px 40px 40px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <h1 style={{ fontSize: 28, fontWeight: 500, color: 'var(--mm-text-1)', marginBottom: 4 }}>
              {user.name || ''}님, 환영합니다 <span style={{ color: 'var(--mm-text-4)' }}>👋</span>
            </h1>
            <p style={{ fontSize: 14, color: 'var(--mm-text-3)', marginBottom: 28 }}>오늘도 멋진 매뉴얼을 만들어볼까요?</p>

            <div style={{
              padding: '14px 18px', borderRadius: 12,
              background: 'var(--mm-grad-banner)', border: '1px solid rgba(124,58,237,0.16)',
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8, background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--mm-primary)', boxShadow: 'var(--mm-shadow-1)',
              }}>
                <Icon.Chrome size={18}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--mm-text-1)' }}>Chrome 확장을 설치하고 녹화를 시작하세요</div>
                <div style={{ fontSize: 12, color: 'var(--mm-text-3)' }}>웹 작업을 시작하면 자동으로 스크린샷을 캡처합니다.</div>
              </div>
              <button className="mm-btn-primary" style={{ background: 'white', color: 'var(--mm-primary)', border: '1px solid var(--mm-border)' }}>
                확장 설치 <Icon.ArrowRight size={13}/>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 500, color: 'var(--mm-text-1)' }}>최근 매뉴얼</h2>
              <span style={{ fontSize: 12.5, color: 'var(--mm-primary)', cursor: 'pointer' }}>모두 보기 →</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {showManuals.map((m, i) => (
                <ManualCard
                  key={(m as { id?: string }).id || i}
                  title={(m as { title: string }).title}
                  steps={(m as { step_count?: number }).step_count || 0}
                  mode={(m as { mode: string }).mode}
                  date={((m as { created_at?: string }).created_at || '').split('T')[0]}
                  cover={i}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
