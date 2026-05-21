import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/dashboard')

  const { data: manuals } = await supabase
    .from('mm_manuals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(12)

  const { data: profile } = await supabase
    .from('mm_users')
    .select('name, plan, daily_manual_count')
    .eq('id', user.id)
    .single()

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email || '', name: profile?.name || '' }}
      manuals={manuals || []}
      usage={{ used: profile?.daily_manual_count || 0, limit: 3 }}
    />
  )
}
