import Link from 'next/link'
import * as Icon from '@/components/icons'

const SUBCONTRACTORS = [
  { name: 'Supabase Inc.', country: '미국', purpose: '데이터베이스·인증·파일 저장' },
  { name: 'Vercel Inc.', country: '미국', purpose: '웹 호스팅·CDN' },
  { name: 'Anthropic PBC', country: '미국', purpose: 'AI 매뉴얼 생성' },
  { name: 'Google LLC', country: '미국', purpose: 'OAuth 인증' },
]

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', fontFamily: 'var(--mm-font)', color: 'var(--mm-text-1)' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 13, color: 'var(--mm-text-3)' }}>
        <Icon.ChevronLeft size={14}/> 홈으로
      </Link>
      <h1 style={{ fontSize: 28, fontWeight: 500, marginBottom: 8 }}>개인정보처리방침</h1>
      <p style={{ fontSize: 13, color: 'var(--mm-text-3)', marginBottom: 36 }}>최종 업데이트: 2026년 5월 1일 · 시행일: 2026년 5월 18일</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>1. 수집하는 개인정보 항목</h2>
        <p style={{ fontSize: 14, color: 'var(--mm-text-2)', lineHeight: 1.7 }}>
          회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다:<br/>
          <strong>필수:</strong> 이메일 주소, 이름, 비밀번호(암호화 저장)<br/>
          <strong>선택:</strong> 프로필 사진, 마케팅 수신 동의 여부<br/>
          <strong>자동 수집:</strong> IP 주소, 접속 일시, 브라우저 정보, 서비스 이용 기록
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>2. 개인정보의 이용 목적</h2>
        <ul style={{ fontSize: 14, color: 'var(--mm-text-2)', lineHeight: 1.8, listStyle: 'disc', paddingLeft: 20 }}>
          <li>회원 가입 및 관리, 본인 확인</li>
          <li>서비스 제공 및 AI 매뉴얼 생성</li>
          <li>결제 처리 및 구독 관리</li>
          <li>고객 문의 응대 및 공지사항 전달</li>
          <li>서비스 개선 및 통계 분석 (마케팅 동의 시)</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>3. 개인정보 보유 기간</h2>
        <p style={{ fontSize: 14, color: 'var(--mm-text-2)', lineHeight: 1.7 }}>
          회원 탈퇴 시 즉시 삭제됩니다. 단, 관련 법령에 따라 일부 정보는 아래 기간 동안 보관됩니다:<br/>
          전자상거래 기록: 5년 / 소비자 불만 기록: 3년 / 접속 로그: 3개월
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>4. 개인정보 처리 위탁</h2>
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--mm-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: 'var(--mm-text-2)' }}>수탁 업체</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: 'var(--mm-text-2)' }}>국가</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 500, color: 'var(--mm-text-2)' }}>위탁 업무</th>
              </tr>
            </thead>
            <tbody>
              {SUBCONTRACTORS.map((s, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--mm-border-light)' }}>
                  <td style={{ padding: '10px 16px', color: 'var(--mm-text-1)' }}>{s.name}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--mm-text-2)' }}>{s.country}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--mm-text-2)' }}>{s.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>5. 이용자의 권리</h2>
        <p style={{ fontSize: 14, color: 'var(--mm-text-2)', lineHeight: 1.7 }}>
          이용자는 언제든지 개인정보 조회, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
          마이페이지에서 직접 처리하거나 help@comindworks.com으로 문의하세요.
        </p>
      </section>

      <p style={{ fontSize: 13, color: 'var(--mm-text-4)', borderTop: '1px solid var(--mm-border)', paddingTop: 24, marginTop: 40 }}>
        개인정보보호 책임자: 김정호 · help@comindworks.com · 코마인드웍스
      </p>
    </div>
  )
}
