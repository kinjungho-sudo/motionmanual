'use client'

import Link from 'next/link'
import * as Icon from '@/components/icons'

type NavId = 'home' | 'my-manuals' | 'my-shared' | 'team-manuals' | 'team-shared' | 'settings' | 'mypage'

interface Props { active?: NavId }

interface NavItem {
  id: NavId
  label: string
  icon: React.ComponentType<{ size?: number }>
  href?: string
  count?: number
}

const items: NavItem[] = [
  { id: 'home', label: '홈', icon: Icon.Home, href: '/dashboard' },
]
const myItems: NavItem[] = [
  { id: 'my-manuals', label: '내 매뉴얼', icon: Icon.File, href: '/dashboard', count: 12 },
  { id: 'my-shared', label: '공유한 매뉴얼', icon: Icon.Link, href: '/dashboard', count: 4 },
]
const teamItems: NavItem[] = [
  { id: 'team-manuals', label: '팀 매뉴얼', icon: Icon.Users },
  { id: 'team-shared', label: '팀 공유', icon: Icon.Link },
]
const bottomItems: NavItem[] = [
  { id: 'settings', label: '설정', icon: Icon.Settings, href: '/mypage' },
  { id: 'mypage', label: '마이페이지', icon: Icon.User, href: '/mypage' },
]

function NavItem({ item, isActive, disabled }: { item: NavItem; isActive: boolean; disabled?: boolean }) {
  const inner = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 10px', borderRadius: 6,
      background: isActive ? 'rgba(79,70,229,0.08)' : 'transparent',
      color: isActive ? 'var(--mm-primary)' : (disabled ? 'var(--mm-text-4)' : 'var(--mm-text-2)'),
      fontWeight: isActive ? 500 : 400,
      fontSize: 13,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.55 : 1,
    }}>
      <item.icon size={15} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.count != null && <span style={{ fontSize: 11, color: 'var(--mm-text-4)' }}>{item.count}</span>}
    </div>
  )
  if (disabled || !item.href) return inner
  return <Link href={item.href} style={{ display: 'block' }}>{inner}</Link>
}

export default function WorkspaceSidebar({ active = 'home' }: Props) {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--mm-bg-side)',
      borderRight: '1px solid var(--mm-border)',
      display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ padding: '14px 14px 8px' }}>
        <Link href="/dashboard" style={{ display: 'block' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
          }}>
            <Icon.Logo size={22}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--mm-text-1)' }}>내 워크스페이스</div>
              <div style={{ fontSize: 10.5, color: 'var(--mm-text-4)' }}>Free 플랜</div>
            </div>
            <Icon.ChevronDown size={13} color="var(--mm-text-4)" />
          </div>
        </Link>
      </div>

      <div style={{ padding: '4px 10px' }}>
        {items.map(it => <NavItem key={it.id} item={it} isActive={active === it.id} />)}
      </div>

      <div style={{ padding: '12px 10px 4px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--mm-text-4)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '4px 10px 6px' }}>
          나의 워크스페이스
        </div>
        {myItems.map(it => <NavItem key={it.id} item={it} isActive={active === it.id} />)}
      </div>

      <div style={{ padding: '12px 10px 4px' }}>
        <div style={{
          fontSize: 10.5, fontWeight: 500, color: 'var(--mm-text-4)',
          textTransform: 'uppercase', letterSpacing: '0.04em',
          padding: '4px 10px 6px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          팀 워크스페이스
          <span style={{
            background: '#FEF3C7', color: '#92400E',
            fontSize: 8.5, fontWeight: 500,
            padding: '1px 5px', borderRadius: 3,
            textTransform: 'none', letterSpacing: 0,
          }}>곧 출시</span>
        </div>
        {teamItems.map(it => <NavItem key={it.id} item={it} isActive={false} disabled />)}
      </div>

      <div style={{ flex: 1 }}/>

      <div style={{ padding: '10px 10px 14px', borderTop: '1px solid var(--mm-border-light)' }}>
        {bottomItems.map(it => <NavItem key={it.id} item={it} isActive={active === it.id} />)}
      </div>
    </aside>
  )
}
