import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'

const StepSchema = z.object({
  title: z.string().max(500).optional(),
  caption: z.string().max(2000).optional(),
  step_order: z.number().int().min(0).optional(),
  screenshot_url: z.string().url().optional().nullable(),
  markers: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
  descriptions: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
  effects: z.record(z.string(), z.unknown()).optional().nullable(),
  shapes: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
})

async function getManualOwner(supabase: ReturnType<typeof import('@/lib/supabase-server').createClient> extends Promise<infer T> ? T : never, manualId: string, userId: string) {
  const { data } = await supabase
    .from('mm_manuals')
    .select('id')
    .eq('id', manualId)
    .eq('user_id', userId)
    .single()
  return !!data
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await getManualOwner(supabase, id, user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('mm_steps')
    .select('*')
    .eq('manual_id', id)
    .order('step_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ steps: data })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owns = await getManualOwner(supabase, id, user.id)
  if (!owns) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const parsed = StepSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { count } = await supabase
    .from('mm_steps')
    .select('*', { count: 'exact', head: true })
    .eq('manual_id', id)

  const { data, error } = await supabase
    .from('mm_steps')
    .insert({ ...parsed.data, manual_id: id, step_order: parsed.data.step_order ?? (count || 0) })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ step: data }, { status: 201 })
}
