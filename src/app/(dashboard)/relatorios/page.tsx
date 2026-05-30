'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Post = {
  id: string; titulo: string; status: string
  plataformas: string[]; created_at: string; publicado_em: string
}

export default function RelatoriosPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalImoveis, setTotalImoveis] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const [{ data: ps }, { count }] = await Promise.all([
        sb.from('posts').select('*').order('created_at', { ascending: false }),
        sb.from('imoveis').select('*', { count: 'exact', head: true }),
      ])
      setPosts(ps || [])
      setTotalImoveis(count || 0)
      setLoading(false)
    }
    load()
  }, [])

  const publicados = posts.filter(p => p.status === 'publicado')
  const agendados  = posts.filter(p => p.status === 'agendado')
  const rascunhos  = posts.filter(p => p.status === 'rascunho')

  const igCount = posts.filter(p => p.plataformas?.includes('instagram')).length
  const fbCount = posts.filter(p => p.plataformas?.includes('facebook')).length

  // Posts dos últimos 7 dias
  const seteDias = posts.filter(p => {
    const d = new Date(p.created_at)
    return d >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }).length

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--txt3)', fontSize: 13 }}>Carregando...</div>

  const card = (label: string, value: string | number, sub: string, color = 'var(--txt)') => (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 11, color: 'var(--txt2)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 6 }}>{sub}</div>
    </div>
  )

  const bar = (label: string, value: number, total: number, color: string) => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
          <span>{label}</span>
          <span style={{ color, fontWeight: 600 }}>{value} posts ({pct}%)</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width .5s ease' }} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Relatórios</div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {card('Imóveis ativos', totalImoveis, 'no sistema')}
        {card('Posts publicados', publicados.length, 'no total', 'var(--green)')}
        {card('Agendados', agendados.length, 'próximos dias', 'var(--accent2)')}
        {card('Criados esta semana', seteDias, 'últimos 7 dias')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Por plataforma */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Por plataforma</div>
          {bar('Instagram', igCount, posts.length, 'var(--accent)')}
          {bar('Facebook', fbCount, posts.length, '#818CF8')}
          {posts.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--txt3)', textAlign: 'center', padding: '12px 0' }}>
              Nenhum post criado ainda
            </div>
          )}
        </div>

        {/* Por status */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Por status</div>
          {bar('Publicados', publicados.length, posts.length, 'var(--green)')}
          {bar('Agendados', agendados.length, posts.length, 'var(--accent2)')}
          {bar('Rascunhos', rascunhos.length, posts.length, '#94A3B8')}
          {posts.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--txt3)', textAlign: 'center', padding: '12px 0' }}>
              Nenhum post criado ainda
            </div>
          )}
        </div>
      </div>

      {/* Últimos posts publicados */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Últimos posts publicados</div>
        {publicados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--txt3)', fontSize: 12 }}>
            Nenhum post publicado ainda.{' '}
            <a href="/conteudo" style={{ color: 'var(--accent2)' }}>Publicar agora →</a>
          </div>
        ) : publicados.slice(0, 8).map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderBottom: i < publicados.slice(0, 8).length - 1 ? '1px solid var(--border)' : 'none'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 6, flexShrink: 0,
              background: 'linear-gradient(135deg,#1A3A6C,#0B1120)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}>🏠</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.titulo}
              </div>
              <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 2 }}>
                {p.plataformas?.join(', ')} · {p.publicado_em
                  ? new Date(p.publicado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                  : new Date(p.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
            <span style={{
              fontSize: 9, padding: '2px 8px', borderRadius: 5, fontWeight: 600,
              background: 'rgba(16,185,129,0.12)', color: '#6EE7B7'
            }}>Publicado</span>
          </div>
        ))}
      </div>
    </div>
  )
}
