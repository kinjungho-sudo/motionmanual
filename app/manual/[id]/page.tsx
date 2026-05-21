import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import GuideModeClient from './GuideModeClient'

export default async function ManualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?next=/manual/${id}`)

  const { data: manual } = await supabase
    .from('mm_manuals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!manual) notFound()

  const { data: steps } = await supabase
    .from('mm_steps')
    .select('*')
    .eq('manual_id', id)
    .order('step_order')

  const { data: profile } = await supabase
    .from('mm_users')
    .select('name, daily_manual_count, plan')
    .eq('id', user.id)
    .single()

  return (
    <GuideModeClient
      manual={manual}
      steps={steps || []}
      user={{ id: user.id, name: profile?.name || '', plan: profile?.plan || 'free' }}
      usage={{ used: profile?.daily_manual_count || 0, limit: 3 }}
    />
  )
}
