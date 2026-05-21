'use client'

import { useState, useEffect } from 'react'

/* ── CSS injected once ── */
const MODAL_CSS = `
.mm-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(17,24,39,0.45);
  z-index: 200;
  display: grid; place-items: center;
  padding: 24px;
  backdrop-filter: blur(4px);
}
.mm-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 64px rgba(17,24,39,0.25);
  overflow: hidden;
  font-family: 'Pretendard','Inter',-apple-system,sans-serif;
  font-size: 13.5px;
  color: #111827;
}
.mm-modal--wide { max-width: 520px; }
.mm-modal__head {
  padding: 22px 24px 8px;
  display: flex; align-items: flex-start; gap: 12px;
}
.mm-modal__title { font-size: 17px; font-weight: 500; margin: 0; flex: 1; color: #111827; }
.mm-modal__close {
  width: 28px; height: 28px;
  border-radius: 50%;
  display: grid; place-items: center;
  color: #6B7280;
  background: #FAFAFA;
  border: none; cursor: pointer; flex: none;
  transition: background 0.18s;
}
.mm-modal__close:hover { background: #E5E7EB; color: #111827; }
.mm-modal__body { padding: 0 24px 8px; color: #4B5563; font-size: 13px; line-height: 1.6; }
.mm-modal__foot {
  padding: 18px 24px 22px;
  display: flex; justify-content: flex-end; gap: 8px;
  border-top: 1px solid #F3F4F6;
  margin-top: 12px;
}

/* Buttons */
.mm-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px; font-weight: 500;
  transition: transform 0.18s, background 0.18s, box-shadow 0.18s;
  white-space: nowrap; line-height: 1;
  border: none; cursor: pointer;
  font-family: inherit;
}
.mm-btn--primary {
  background: linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(79,70,229,0.25);
}
.mm-btn--primary:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(79,70,229,0.32); }
.mm-btn--ghost { color: #4B5563; background: none; }
.mm-btn--ghost:hover { color: #111827; background: #F9FAFB; }

/* Toggle */
.mm-toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; font-size: 12.5px; color: #4B5563;
}
.mm-toggle {
  width: 32px; height: 18px;
  border-radius: 999px;
  background: #E5E7EB;
  position: relative;
  cursor: pointer;
  border: none;
  transition: background 0.18s;
  flex: none;
}
.mm-toggle::after {
  content: ""; position: absolute;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: white;
  top: 2px; left: 2px;
  transition: left 0.18s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
}
.mm-toggle.is-on { background: #4F46E5; }
.mm-toggle.is-on::after { left: 16px; }

/* Share link input */
.mm-share-link {
  display: flex; gap: 6px;
}
.mm-share-link input {
  flex: 1; height: 38px; padding: 0 12px;
  border: 1px solid #E5E7EB; border-radius: 7px;
  background: #FAFAFA; font-size: 12.5px; color: #4B5563;
  font-family: inherit; outline: none;
}
.mm-share-link button {
  padding: 0 14px; height: 38px;
  background: #4F46E5; color: white;
  border-radius: 7px; font-size: 12.5px;
  font-weight: 500; white-space: nowrap; flex: none;
  border: none; cursor: pointer; font-family: inherit;
}

/* Access options */
.mm-access-options { display: grid; gap: 6px; }
.mm-access-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px; cursor: pointer; font-size: 13px;
}
.mm-access-row.is-selected { border-color: #4F46E5; background: #EEF2FF; }
.mm-access-row.is-disabled { opacity: 0.5; cursor: not-allowed; }
.mm-access-radio {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 1.5px solid #E5E7EB;
  flex: none; position: relative;
}
.mm-access-row.is-selected .mm-access-radio { border-color: #4F46E5; }
.mm-access-row.is-selected .mm-access-radio::after {
  content: ""; position: absolute; inset: 3px;
  border-radius: 50%; background: #4F46E5;
}
.mm-access-row__title { font-weight: 500; flex: 1; color: #111827; }

/* Social row */
.mm-social-row {
  display: flex; gap: 8px;
  padding-top: 14px;
  border-top: 1px solid #F3F4F6;
  margin-top: 14px;
}
.mm-social-btn {
  flex: 1; height: 40px;
  border: 1px solid #E5E7EB; border-radius: 8px;
  background: white;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 12.5px; color: #4B5563; font-weight: 500;
  cursor: pointer; font-family: inherit;
  transition: background 0.18s;
}
.mm-social-btn:hover { background: #FAFAFA; }

/* Format cards */
.mm-fmt-cards { display: grid; gap: 8px; }
.mm-fmt-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px;
  border: 1px solid #E5E7EB; border-radius: 10px;
  cursor: pointer;
}
.mm-fmt-card.is-selected { border-color: #4F46E5; background: #EEF2FF; }
.mm-fmt-card__icon {
  width: 36px; height: 36px;
  border-radius: 8px; background: #FAFAFA;
  display: grid; place-items: center; flex: none; color: #6B7280;
}
.mm-fmt-card.is-selected .mm-fmt-card__icon { background: white; color: #4F46E5; }
.mm-fmt-card__title { font-size: 13.5px; font-weight: 500; color: #111827; }
.mm-fmt-card__sub { font-size: 11.5px; color: #6B7280; }

/* Segmented control */
.mm-segmented {
  background: #FAFAFA; display: grid;
  grid-auto-flow: column; grid-auto-columns: 1fr;
  gap: 4px; padding: 4px; border-radius: 8px;
}
.mm-segmented button {
  padding: 7px; font-size: 11.5px; color: #4B5563;
  border-radius: 5px; font-weight: 500;
  background: none; border: none; cursor: pointer;
  font-family: inherit; transition: all 0.18s;
}
.mm-segmented button.is-active {
  background: white; color: #4F46E5;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

/* Phase badge */
.mm-phase-badge {
  display: inline-block;
  padding: 1px 6px;
  background: rgba(245,158,11,0.15);
  color: #B45309; border-radius: 4px;
  font-size: 9.5px; font-weight: 500; white-space: nowrap;
}
.mm-elite-badge {
  display: inline-block;
  padding: 1px 6px;
  background: rgba(79,70,229,0.10);
  color: #4F46E5; border-radius: 4px;
  font-size: 9.5px; font-weight: 500; white-space: nowrap;
}

/* Label */
.mm-label {
  display: block; font-size: 12.5px; font-weight: 500;
  margin-bottom: 6px; color: #4B5563;
}

/* Input */
.mm-input {
  width: 100%; height: 40px; padding: 0 12px;
  border: 1px solid #E5E7EB; border-radius: 8px;
  background: white; font-size: 13.5px;
  outline: none; font-family: inherit; color: #111827;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.mm-input:focus { border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79,70,229,0.12); }

/* Help numbered list */
.mm-help-numbered { list-style: none; padding: 0; counter-reset: hn; }
.mm-help-numbered li {
  counter-increment: hn;
  position: relative;
  padding: 0 0 18px 38px;
  font-size: 14px; color: #4B5563; line-height: 1.6;
}
.mm-help-numbered li::before {
  content: counter(hn);
  position: absolute; left: 0; top: 0;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #EEF2FF; color: #4F46E5;
  display: grid; place-items: center;
  font-size: 12px; font-weight: 500;
}

/* Plan comparison */
.mm-plan-compare {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; max-width: 360px; margin: 0 auto; text-align: left;
}
.mm-plan-tile {
  padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px;
}
.mm-plan-tile--elite {
  border: 2px solid #4F46E5;
  background: #EEF2FF;
}
.mm-plan-tile__label {
  font-size: 11px; color: #6B7280; margin-bottom: 4px;
}
.mm-plan-tile--elite .mm-plan-tile__label {
  color: #4F46E5; font-weight: 500;
}
.mm-plan-tile__value { font-size: 14px; font-weight: 500; color: #111827; }
`

function useModalCSS() {
  useEffect(() => {
    if (document.getElementById('mm-modal-styles')) return
    const style = document.createElement('style')
    style.id = 'mm-modal-styles'
    style.textContent = MODAL_CSS
    document.head.appendChild(style)
  }, [])
}

function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="mm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      {children}
    </div>
  )
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button className="mm-modal__close" onClick={onClose} aria-label="닫기">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  )
}

/* ── Share Modal ── */
export function ShareModal({ onClose }: { onClose: () => void }) {
  useModalCSS()
  const [isPublic, setIsPublic] = useState(true)
  const [copied, setCopied] = useState(false)
  const shareUrl = 'https://motionmanual.ai/m/k8p2x9'

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Overlay onClose={onClose}>
      <div className="mm-modal mm-modal--wide">
        <div className="mm-modal__head">
          <h3 className="mm-modal__title">매뉴얼 공유</h3>
          <CloseButton onClose={onClose}/>
        </div>
        <div className="mm-modal__body">
          <div className="mm-toggle-row" style={{ padding: '6px 0 14px' }}>
            <div>
              <div style={{ fontWeight: 500, color: '#111827', fontSize: 13 }}>공개 매뉴얼</div>
              <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>링크를 가진 누구나 볼 수 있어요</div>
            </div>
            <button className={`mm-toggle${isPublic ? ' is-on' : ''}`} onClick={() => setIsPublic(v => !v)}/>
          </div>

          <div style={{ padding: 0 }}>
            <label className="mm-label">공유 링크</label>
            <div className="mm-share-link">
              <input value={shareUrl} readOnly/>
              <button onClick={handleCopy}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, display: 'inline', verticalAlign: -2 }}>
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          </div>

          <div style={{ margin: '18px 0 8px' }}>
            <label className="mm-label">액세스 권한</label>
            <div className="mm-access-options">
              <div className="mm-access-row is-selected">
                <span className="mm-access-radio"/>
                <div style={{ flex: 1 }}>
                  <div className="mm-access-row__title">보기 전용</div>
                  <div style={{ fontSize: 11.5, color: '#6B7280' }}>매뉴얼을 시청만 할 수 있어요</div>
                </div>
              </div>
              <div className="mm-access-row is-disabled">
                <span className="mm-access-radio"/>
                <div style={{ flex: 1 }}>
                  <div className="mm-access-row__title">댓글 <span className="mm-phase-badge">Phase 2</span></div>
                  <div style={{ fontSize: 11.5, color: '#6B7280' }}>시청하면서 의견을 남길 수 있어요</div>
                </div>
              </div>
              <div className="mm-access-row is-disabled">
                <span className="mm-access-radio"/>
                <div style={{ flex: 1 }}>
                  <div className="mm-access-row__title">편집 <span className="mm-phase-badge">Phase 2</span></div>
                  <div style={{ fontSize: 11.5, color: '#6B7280' }}>함께 매뉴얼을 편집할 수 있어요</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label className="mm-label">임베드 코드</label>
            <input className="mm-input" value={`<iframe src="https://motionmanual.ai/embed/k8p2x9" width="640" height="360"></iframe>`} readOnly style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11.5, color: '#4B5563' }}/>
          </div>

          <div className="mm-social-row">
            <button className="mm-social-btn">💬 카카오톡</button>
            <button className="mm-social-btn">🟣 슬랙</button>
            <button className="mm-social-btn">✉️ 이메일</button>
          </div>
        </div>
        <div className="mm-modal__foot">
          <button className="mm-btn mm-btn--ghost" onClick={onClose}>닫기</button>
          <button className="mm-btn mm-btn--primary" onClick={onClose}>완료</button>
        </div>
      </div>
    </Overlay>
  )
}

/* ── Export Modal ── */
type ExportFormat = 'pdf' | 'html' | 'markdown'
type ImageQuality = 'standard' | 'high'

export function ExportModal({ onClose, onExport }: { onClose: () => void; onExport?: (fmt: ExportFormat) => void }) {
  useModalCSS()
  const [fmt, setFmt] = useState<ExportFormat>('pdf')
  const [includeDesc, setIncludeDesc] = useState(true)
  const [showPageNum, setShowPageNum] = useState(true)
  const [quality, setQuality] = useState<ImageQuality>('high')

  return (
    <Overlay onClose={onClose}>
      <div className="mm-modal mm-modal--wide">
        <div className="mm-modal__head">
          <h3 className="mm-modal__title">내보내기</h3>
          <CloseButton onClose={onClose}/>
        </div>
        <div className="mm-modal__body">
          <label className="mm-label">형식</label>
          <div className="mm-fmt-cards" style={{ marginBottom: 18 }}>
            <div className={`mm-fmt-card${fmt === 'pdf' ? ' is-selected' : ''}`} onClick={() => setFmt('pdf')}>
              <div className="mm-fmt-card__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <div className="mm-fmt-card__title">PDF</div>
                <div className="mm-fmt-card__sub">인쇄 가능한 PDF 문서</div>
              </div>
            </div>
            <div className={`mm-fmt-card${fmt === 'html' ? ' is-selected' : ''}`} onClick={() => setFmt('html')}>
              <div className="mm-fmt-card__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div>
                <div className="mm-fmt-card__title">HTML <span className="mm-elite-badge">Elite+</span></div>
                <div className="mm-fmt-card__sub">웹 게시용 인터랙티브 페이지</div>
              </div>
            </div>
            <div className={`mm-fmt-card${fmt === 'markdown' ? ' is-selected' : ''}`} onClick={() => setFmt('markdown')}>
              <div className="mm-fmt-card__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
                </svg>
              </div>
              <div>
                <div className="mm-fmt-card__title">Markdown <span className="mm-elite-badge">Elite+</span></div>
                <div className="mm-fmt-card__sub">개발 문서·블로그용 .md</div>
              </div>
            </div>
          </div>

          <label className="mm-label">옵션</label>
          <div className="mm-toggle-row">
            항목 설명 포함
            <button className={`mm-toggle${includeDesc ? ' is-on' : ''}`} onClick={() => setIncludeDesc(v => !v)}/>
          </div>
          <div className="mm-toggle-row">
            페이지 번호 표시
            <button className={`mm-toggle${showPageNum ? ' is-on' : ''}`} onClick={() => setShowPageNum(v => !v)}/>
          </div>

          <label className="mm-label" style={{ marginTop: 14 }}>이미지 품질</label>
          <div className="mm-segmented">
            <button className={quality === 'standard' ? 'is-active' : ''} onClick={() => setQuality('standard')}>표준</button>
            <button className={quality === 'high' ? 'is-active' : ''} onClick={() => setQuality('high')}>고품질</button>
          </div>
        </div>
        <div className="mm-modal__foot">
          <button className="mm-btn mm-btn--ghost" onClick={onClose}>닫기</button>
          <button className="mm-btn mm-btn--primary" onClick={() => { onExport?.(fmt); onClose() }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            내보내기
          </button>
        </div>
      </div>
    </Overlay>
  )
}

/* ── Chrome Extension Modal ── */
export function ChromeExtensionModal({ onClose }: { onClose: () => void }) {
  useModalCSS()
  return (
    <Overlay onClose={onClose}>
      <div className="mm-modal">
        <div className="mm-modal__head">
          <h3 className="mm-modal__title">Chrome 확장이 필요해요</h3>
          <CloseButton onClose={onClose}/>
        </div>
        <div className="mm-modal__body" style={{ textAlign: 'center', padding: '0 24px 20px' }}>
          <div style={{ width: 80, height: 80, margin: '8px auto 18px', borderRadius: 20, background: 'linear-gradient(135deg,#EEF2FF 0%,#F5F3FF 100%)', display: 'grid', placeItems: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#4F46E5"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
              <path d="M12 2 A10 10 0 0 1 20.66 7 L13.46 11.16 A2 2 0 0 0 12 8z" fill="#DC2626"/>
              <path d="M20.66 7 A10 10 0 0 1 16 21.21 L13 13.46 A2 2 0 0 0 14 11.16z" fill="#FBBC05"/>
              <path d="M16 21.21 A10 10 0 0 1 3.34 17 L10.54 12.84 A2 2 0 0 0 12 16z" fill="#34A853"/>
            </svg>
          </div>
          <p style={{ fontSize: 14, color: '#111827', margin: '0 0 18px' }}>매뉴얼을 만들려면 Chrome 확장 프로그램을 설치해주세요.</p>
          <ol className="mm-help-numbered" style={{ textAlign: 'left', maxWidth: 320, margin: '0 auto' }}>
            <li>아래 버튼을 클릭하여 Chrome 웹스토어로 이동</li>
            <li><b>Chrome에 추가</b> 클릭</li>
            <li>설치 후 우상단 확장 아이콘에서 시작</li>
          </ol>
        </div>
        <div className="mm-modal__foot">
          <button className="mm-btn mm-btn--ghost" onClick={onClose}>나중에</button>
          <button className="mm-btn mm-btn--primary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="2" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Chrome 웹스토어에서 설치
          </button>
        </div>
      </div>
    </Overlay>
  )
}

/* ── Limit Reached Modal ── */
export function LimitReachedModal({ onClose }: { onClose: () => void }) {
  useModalCSS()
  return (
    <Overlay onClose={onClose}>
      <div className="mm-modal">
        <div className="mm-modal__head">
          <h3 className="mm-modal__title">오늘의 무료 한도를 다 사용하셨어요</h3>
          <CloseButton onClose={onClose}/>
        </div>
        <div className="mm-modal__body" style={{ textAlign: 'center', padding: '0 24px 22px' }}>
          <div style={{ width: 80, height: 80, margin: '8px auto 18px', borderRadius: 20, background: 'rgba(245,158,11,0.10)', display: 'grid', placeItems: 'center', color: '#F59E0B' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <p style={{ fontSize: 14, color: '#111827', margin: '0 0 18px' }}>
            Elite 플랜으로 업그레이드하면 매뉴얼을 무제한으로 만들 수 있어요.
          </p>
          <div className="mm-plan-compare">
            <div className="mm-plan-tile">
              <div className="mm-plan-tile__label">Free (현재)</div>
              <div className="mm-plan-tile__value">매일 3개</div>
            </div>
            <div className="mm-plan-tile mm-plan-tile--elite">
              <div className="mm-plan-tile__label">Elite ₩9,000/월</div>
              <div className="mm-plan-tile__value">기본 매뉴얼 무제한</div>
            </div>
          </div>
        </div>
        <div className="mm-modal__foot">
          <button className="mm-btn mm-btn--ghost" onClick={onClose}>내일 다시 시도</button>
          <a href="/pricing" className="mm-btn mm-btn--primary" style={{ textDecoration: 'none' }}>업그레이드 보기</a>
        </div>
      </div>
    </Overlay>
  )
}

/* ── Hook for easy usage ── */
export type ModalType = 'share' | 'export' | 'chrome' | 'limit' | null

export function useModal() {
  const [open, setOpen] = useState<ModalType>(null)
  return {
    open,
    openModal: (m: ModalType) => setOpen(m),
    closeModal: () => setOpen(null),
  }
}

/* ── Modal Router ── */
export function ModalRouter({ open, onClose, onExport }: {
  open: ModalType
  onClose: () => void
  onExport?: (fmt: ExportFormat) => void
}) {
  if (open === 'share') return <ShareModal onClose={onClose}/>
  if (open === 'export') return <ExportModal onClose={onClose} onExport={onExport}/>
  if (open === 'chrome') return <ChromeExtensionModal onClose={onClose}/>
  if (open === 'limit') return <LimitReachedModal onClose={onClose}/>
  return null
}
