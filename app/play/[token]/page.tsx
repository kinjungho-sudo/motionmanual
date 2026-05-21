import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import PlayerClient from './PlayerClient'

export default async function PlayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createServiceClient()

  const { data: manual } = await supabase
    .from('mm_manuals')
    .select('*, mm_users(name)')
    .eq('share_token', token)
    .in('visibility', ['link', 'public'])
    .single()

  if (!manual) notFound()

  const { data: steps } = await supabase
    .from('mm_steps')
    .select('*')
    .eq('manual_id', manual.id)
    .order('step_order')

  const authorName = (manual.mm_users as { name?: string } | null)?.name || '작성자'

  return (
    <PlayerClient
      manual={{ id: manual.id, title: manual.title, output_ratio: manual.output_ratio }}
      steps={steps || []}
      authorName={authorName}
    />
  )
}
