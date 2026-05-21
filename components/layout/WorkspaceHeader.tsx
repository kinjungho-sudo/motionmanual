'use client'

import Link from 'next/link'
import * as Icon from '@/components/icons'

interface Props {
  children?: React.ReactNode
  usage?: { used: number; limit: number }
  userName?: string
}

export default function WorkspaceHeader({ children, usage = { used: 2, limit: 3 }, userName = '김' }: Props) {
  const pct = usage.used / usage.limit
  const usageClass = pct >= 1 ? 'danger' : pct >= 0.66 ? 'warn' : ''

  return (
    <header style={{
      height: 56, flexShrink: 0,
      borderBottom: '1px solid var(--mm-border)',
      background: 'white',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 12,
    }}>
      <div style={{
        flex: 1, maxWidth: 360,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px',
        background: 'var(--mm-border-light)',
        border: '1px solid transparent',
        borderRadius: 8,
        fontSize: 13, color: 'var(--mm-text-3)',
      }}>
        <Icon.Search size={14} color="var(--mm-text-3)" />
        <input placeholder="매뉴얼 검색..." style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          fontSize: 13, color: 'var(--mm-text-1)',
          fontFamily: 'var(--mm-font)',
        }}/>
        <span style={{
          fontSize: 10, color: 'var(--mm-text-4)',
          padding: '1px 5px', background: 'white',
          borderRadius: 3, border: '1px solid var(--mm-border)',
        }}>⌘K</span>
      </div>

      {children}

      <div style={{ flex: 1 }}/>

      <Link href="/dashboard">
        <button className="mm-btn-primary">
          <Icon.Plus size={14}/> 새 매뉴얼
        </button>
      </Link>

      <button style={{
        width: 34, height: 34, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--mm-text-2)',
      }}>
        <Icon.Bell size={16}/>
      </button>

      <div className={`mm-chip-usage ${usageClass}`}>
        오늘 매뉴얼 <strong>{usage.used}/{usage.limit}</strong>
      </div>

      <Link href="/mypage">
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--mm-grad)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 500, fontSize: 12,
          cursor: 'pointer',
        }}>{userName.charAt(0)}</div>
      </Link>
    </header>
  )
}
