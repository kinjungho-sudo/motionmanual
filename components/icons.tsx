'use client'

import React from 'react'

interface IconProps {
  size?: number
  color?: string
  stroke?: number
  style?: React.CSSProperties
  className?: string
}

const I = (path: React.ReactNode, viewBox = '0 0 24 24') =>
  function Icon({ size = 16, color = 'currentColor', stroke = 1.6, style, className }: IconProps) {
    return (
      <svg width={size} height={size} viewBox={viewBox} fill="none" stroke={color}
        strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
        style={style} className={className} aria-hidden="true">
        {path}
      </svg>
    )
  }

export const Home = I(<><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></>)
export const File = I(<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></>)
export const Link = I(<><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07L11.17 5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 1 0 11 21.07L12.83 19"/></>)
export const Users = I(<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>)
export const Settings = I(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>)
export const User = I(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>)
export const Search = I(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>)
export const Bell = I(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>)
export const Plus = I(<><path d="M12 5v14M5 12h14"/></>)
export const Star = I(<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>)
export const Sparkles = I(<><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><path d="m12 8 1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z" fill="currentColor"/></>)
export const Share = I(<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></>)
export const Download = I(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></>)
export const ChevronLeft = I(<path d="m15 18-6-6 6-6"/>)
export const ChevronRight = I(<path d="m9 18 6-6-6-6"/>)
export const ChevronDown = I(<path d="m6 9 6 6 6-6"/>)
export const ChevronUp = I(<path d="m18 15-6-6-6 6"/>)
export const Play = I(<polygon points="6 3 20 12 6 21"/>)
export const Pause = I(<><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>)
export const X = I(<path d="M18 6 6 18M6 6l12 12"/>)
export const Check = I(<polyline points="20 6 9 17 4 12"/>)
export const Copy = I(<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>)
export const Trash = I(<><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>)
export const Edit = I(<><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></>)
export const Pen = I(<><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></>)
export const Image = I(<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>)
export const Type = I(<><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></>)
export const Mic = I(<><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></>)
export const Video = I(<><polygon points="23 7 16 12 23 17"/><rect x="1" y="5" width="15" height="14" rx="2"/></>)
export const Square = I(<rect x="4" y="4" width="16" height="16" rx="1"/>)
export const Circle = I(<circle cx="12" cy="12" r="9"/>)
export const Triangle = I(<path d="M12 3 22 20H2z"/>)
export const ArrowRight = I(<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>)
export const Zoom = I(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M8 11h6M11 8v6"/></>)
export const Eye = I(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>)
export const Globe = I(<><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14.5 14.5 0 0 1 4 9 14.5 14.5 0 0 1-4 9 14.5 14.5 0 0 1-4-9 14.5 14.5 0 0 1 4-9z"/></>)
export const Lock = I(<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>)
export const Mail = I(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></>)
export const Rocket = I(<><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15 9 12a14 14 0 0 1 4-8 8.5 8.5 0 0 1 7 7 14 14 0 0 1-8 4z"/><path d="M9 12 6.5 9.5C5.41 8.41 5.42 6.62 6.5 5.5l1-1 4 4"/><path d="M15 9 12.5 6.5a3.5 3.5 0 0 0-5 0L7 7l4 4"/><circle cx="15" cy="9" r="1"/></>)
export const Crown = I(<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7z"/>)
export const Leaf = I(<><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96 21 6 21 12 17.59 16.41A7 7 0 0 1 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></>)
export const Folder = I(<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>)
export const Chrome = I(<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></>)
export const Menu = I(<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>)
export const Maximize = I(<><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></>)
export const PanelRight = I(<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></>)
export const PlayCircle = I(<><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/></>)
export const Clock = I(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>)
export const Volume = I(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></>)
export const MoreHorizontal = I(<><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>)
export const Layout = I(<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>)
export const CheckCircle = I(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>)
export const ArrowUpRight = I(<><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></>)
export const Zap = I(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>)

interface LogoProps { size?: number }
export function Logo({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mm-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#mm-logo-grad)"/>
      <path d="M7 16V8l5 6 5-6v8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

interface GoogleGProps { size?: number }
export function GoogleG({ size = 16 }: GoogleGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C33.6 5.9 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 8 3l5.7-5.7C33.6 5.9 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5C29 35.3 26.6 36 24 36c-5.3 0-9.7-3.4-11.3-8L6 32.9C9.3 39.6 16 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2.1-2 3.9-3.7 5.2l6 5C40.6 35 44 30.1 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  )
}
