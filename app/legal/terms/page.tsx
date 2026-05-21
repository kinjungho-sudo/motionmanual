import Link from 'next/link'
import * as Icon from '@/components/icons'

const SECTIONS = [
  { title: '제1조 (목적)', body: '본 약관은 코마인드웍스(이하 "회사")가 제공하는 MotionManual AI 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자의 권리·의무·책임사항을 규정함을 목적으로 합니다.' },
  { title: '제2조 (정의)', body: '"서비스"란 MotionManual AI 웹 애플리케이션, Chrome 확장 프로그램 및 관련 API를 포함합니다. "이용자"란 본 약관에 동의하고 회원가입을 완료한 자를 말합니다.' },
  { title: '제3조 (약관의 효력)', body: '본 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다. 회사는 필요 시 약관을 변경할 수 있으며, 변경 시 7일 전 공지합니다.' },
  { title: '제4조 (이용계약 체결)', body: '이용계약은 이용자가 약관에 동의하고 회원가입을 완료한 후 회사가 승낙함으로써 체결됩니다. 만 14세 미만인 자는 서비스를 이용할 수 없습니다.' },
  { title: '제5조 (개인정보 보호)', body: '회사는 개인정보 보호법 및 관련 법령에 따라 이용자의 개인정보를 처리합니다. 자세한 사항은 개인정보처리방침을 참조하시기 바랍니다.' },
  { title: '제6조 (서비스 제공)', body: '회사는 연중무휴 24시간 서비스를 제공함을 원칙으로 하나, 시스템 점검·업그레이드 등 부득이한 사유 발생 시 사전 공지 후 일시 중단할 수 있습니다.' },
  { title: '제7조 (면책조항)', body: '회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.' },
]

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', fontFamily: 'var(--mm-font)', color: 'var(--mm-text-1)' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 13, color: 'var(--mm-text-3)' }}>
        <Icon.ChevronLeft size={14}/> 홈으로
      </Link>
      <h1 style={{ fontSize: 28, fontWeight: 500, marginBottom: 8 }}>이용약관</h1>
      <p style={{ fontSize: 13, color: 'var(--mm-text-3)', marginBottom: 36 }}>최종 업데이트: 2026년 5월 1일</p>
      {SECTIONS.map((s, i) => (
        <div key={i} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{s.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--mm-text-2)', lineHeight: 1.7 }}>{s.body}</p>
        </div>
      ))}
      <p style={{ fontSize: 13, color: 'var(--mm-text-4)', borderTop: '1px solid var(--mm-border)', paddingTop: 24, marginTop: 40 }}>
        문의: help@comindworks.com · 코마인드웍스
      </p>
    </div>
  )
}
