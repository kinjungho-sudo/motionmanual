import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MotionManual AI',
  description: '화면 녹화 한 번으로 AI 인터랙티브 매뉴얼을 자동 생성',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
