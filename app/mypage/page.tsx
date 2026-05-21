import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import MyPageClient from './MyPageClient'

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/mypage')

  const { data: profile } = await supabase.from('mm_users').select('*').eq('id', user.id).single()
  const { data: sub } = await supabase.from('mm_subscriptions').select('*').eq('user_id', user.id).single()
  const { count } = await supabase.from('mm_manuals').select('*', { count: 'exact', head: true }).eq('user_id', user.id)

  return (
    <MyPageClient
      user={{ id: user.id, email: user.email || '', name: profile?.name || '', avatar_url: profile?.avatar_url, auth_provider: profile?.auth_provider, plan: profile?.plan || 'free' }}
      usage={{ dailyUsed: profile?.daily_manual_count || 0, dailyLimit: 3, totalManuals: count || 0 }}
      subscription={sub}
    />
  )
}
