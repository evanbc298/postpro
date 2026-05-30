import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET() {
  // Verifica se o usuário logado é admin
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL

  if (!user || (adminEmail && user.email !== adminEmail)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const { data: { users }, error } = await adminClient.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const ids = users.map(u => u.id)

  const [{ data: imoveis }, { data: posts }] = await Promise.all([
    adminClient.from('imoveis').select('user_id').in('user_id', ids),
    adminClient.from('posts').select('user_id, status').in('user_id', ids),
  ])

  const resultado = users.map(u => ({
    id: u.id,
    email: u.email,
    nome: u.user_metadata?.nome || '',
    criado_em: u.created_at,
    ultimo_login: u.last_sign_in_at,
    imoveis: imoveis?.filter(i => i.user_id === u.id).length || 0,
    posts: posts?.filter(p => p.user_id === u.id).length || 0,
    publicados: posts?.filter(p => p.user_id === u.id && p.status === 'publicado').length || 0,
  }))

  return NextResponse.json({ total: users.length, clientes: resultado })
}
