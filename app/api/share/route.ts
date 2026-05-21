import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'

const Schema = z.object({
  manualId: z.string().uuid(),
  visibility: z.enum(['private', 'link', 'public']),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { manualId, visibility } = parsed.data

  let shareToken: string | null = null
  if (visibility !== 'private') {
    const { data: existing } = await supabase
      .from('mm_manuals')
      .select('share_token')
      .eq('id', manualId)
      .eq('user_id', user.id)
      .single()
    shareToken = existing?.share_token || crypto.randomUUID().replace(/-/g, '')
  }

  const { data, error } = await supabase
    .from('mm_manuals')
    .update({ visibility, share_token: shareToken, updated_at: new Date().toISOString() })
    .eq('id', manualId)
    .eq('user_id', user.id)
    .select('visibility, share_token')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ visibility: data.visibility, shareToken: data.share_token })
}
