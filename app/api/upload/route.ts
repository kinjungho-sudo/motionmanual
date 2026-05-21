import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  const manualId = form.get('manual_id') as string | null
  const stepId = form.get('step_id') as string | null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!ALLOWED_MIME.includes(file.type)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large' }, { status: 400 })

  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const path = `${user.id}/${manualId || 'misc'}/${stepId || Date.now()}-${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('screenshots').upload(path, file, { upsert: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('screenshots').getPublicUrl(path)
  return NextResponse.json({ url: publicUrl })
}
