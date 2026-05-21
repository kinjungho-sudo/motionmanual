import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'

const UpdateSchema = z.object({
  title: z.string().max(500).optional(),
  caption: z.string().max(2000).optional(),
  step_order: z.number().int().min(0).optional(),
  screenshot_url: z.string().url().optional().nullable(),
  markers: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
  descriptions: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
  effects: z.record(z.string(), z.unknown()).optional().nullable(),
  shapes: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  const { id, stepId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: manual } = await supabase
    .from('mm_manuals').select('id').eq('id', id).eq('user_id', user.id).single()
  if (!manual) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error } = await supabase
    .from('mm_steps')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', stepId)
    .eq('manual_id', id)
    .select()
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ step: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  const { id, stepId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: manual } = await supabase
    .from('mm_manuals').select('id').eq('id', id).eq('user_id', user.id).single()
  if (!manual) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase
    .from('mm_steps')
    .delete()
    .eq('id', stepId)
    .eq('manual_id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
