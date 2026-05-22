import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import EditorClient from './EditorClient'

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?next=/manual/${id}/editor`)

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

  return (
    <EditorClient
      manual={manual}
      steps={steps || []}
    />
  )
}
