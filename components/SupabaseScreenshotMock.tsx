'use client'

interface Props { highlightStep?: number }

export default function SupabaseScreenshotMock({ highlightStep = 0 }: Props) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#1C1C1C', fontFamily: 'monospace', fontSize: 11, overflow: 'hidden' }}>
      {/* Left sidebar */}
      <div style={{ width: '18%', background: '#1E1E2E', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '12px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 12px 12px', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>SUPABASE</div>
        {['Table Editor','SQL Editor','Authentication','Storage','Functions','Logs'].map((item, i) => (
          <div key={i} style={{
            padding: '7px 12px', fontSize: 11,
            color: i === 2 ? 'white' : 'rgba(255,255,255,0.55)',
            background: i === 2 ? 'rgba(79,70,229,0.20)' : 'transparent',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: i === 2 ? '#4F46E5' : 'rgba(255,255,255,0.10)' }}/>
            {item}
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'var(--mm-font)', fontWeight: 500 }}>
          Authentication · Providers
        </div>
        <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
          <div style={{ marginBottom: 12, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>OAuth Providers</div>
          {[
            { name: 'Google', enabled: true, active: highlightStep === 3 },
            { name: 'GitHub', enabled: false, active: false },
            { name: 'Apple', enabled: false, active: false },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 6, marginBottom: 6,
              background: p.active ? 'rgba(79,70,229,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${p.active ? 'rgba(79,70,229,0.40)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: p.enabled ? '#4F46E5' : 'rgba(255,255,255,0.10)' }}/>
              <span style={{ flex: 1, fontSize: 11.5, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--mm-font)' }}>{p.name} provider</span>
              <div style={{
                width: 28, height: 16, borderRadius: 8,
                background: p.enabled ? '#4F46E5' : 'rgba(255,255,255,0.15)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 2, left: p.enabled ? 14 : 2,
                  width: 12, height: 12, borderRadius: '50%', background: 'white',
                  transition: 'left 0.2s',
                }}/>
              </div>
              {p.enabled && (
                <div style={{
                  padding: '2px 8px', borderRadius: 4,
                  background: 'rgba(79,70,229,0.25)', color: '#A5B4FC',
                  fontSize: 10, fontFamily: 'var(--mm-font)',
                }}>Configure</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
