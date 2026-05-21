export type UserPlan = 'free' | 'elite' | 'pro'
export type ManualMode = 'guide' | 'tutorial'
export type ManualVisibility = 'private' | 'link' | 'public'
export type WorkspaceType = 'personal' | 'team'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'

export interface MmUser {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  auth_provider: string | null
  google_id: string | null
  plan: UserPlan
  daily_manual_count: number
  daily_reset_at: string | null
  consent_age: boolean
  consent_terms: boolean
  consent_privacy: boolean
  consent_marketing: boolean
  created_at: string
  last_login_at: string | null
}

export interface MmManual {
  id: string
  user_id: string
  workspace_type: WorkspaceType
  title: string
  description: string | null
  mode: ManualMode
  output_ratio: string
  visibility: ManualVisibility
  share_token: string | null
  language: string
  parent_manual_id: string | null
  created_at: string
  updated_at: string
}

export interface MmStep {
  id: string
  manual_id: string
  step_order: number
  title: string | null
  screenshot_url: string | null
  click_x: number | null
  click_y: number | null
  markers: Record<string, unknown>[] | null
  descriptions: Record<string, unknown>[] | null
  effects: Record<string, unknown> | null
  shapes: Record<string, unknown>[] | null
  caption: string | null
  audio_url: string | null
  created_at: string
  updated_at: string
}

export interface MmCaptureSession {
  id: string
  user_id: string
  status: 'pending' | 'capturing' | 'processing' | 'done' | 'error'
  started_at: string | null
  ended_at: string | null
}

export interface MmCaptureEvent {
  id: string
  session_id: string
  screenshot_url: string | null
  click_x: number | null
  click_y: number | null
  url: string | null
  element_text: string | null
  timestamp: string
}

export interface MmViewEvent {
  id: string
  manual_id: string
  viewer_session_id: string | null
  started_at: string
  ended_at: string | null
  completed: boolean
  step_durations: Record<string, number> | null
}

export interface MmSubscription {
  id: string
  user_id: string
  plan: UserPlan
  status: SubscriptionStatus
  next_billing_at: string | null
  payment_method: string | null
  created_at: string
}
