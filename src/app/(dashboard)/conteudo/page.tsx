'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Post = {
  id: string; titulo: string; legenda: string; tipo: string
  plataformas: string[]; status: string; agendado_para: string
  created_at: string; imovel_id: string
}

type Imovel = { id: string; fotos: { url: string; is_capa: boolean }[] }

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  rascunho:  { label: 'Rascunho',  color: '#94A3B8', bg: 'rgba(100,116,139,0.1)' },
  agendado:  { label: 'Agendado',  color: '#93C5FD', bg: 'rgba(59,130,246,0.1)'  },
  aprovado:  { label: 'Aprovado',  color: '#C4B5FD', bg: 'rgba(139,92,246,0.1)'  },
  publicado: { label: 'Publicado', color: '#6EE7B7', bg: 'rgba(16,185,129,0.1)'  },
  erro:      { label: 'Erro',      color: '#FCA5A5', bg: 'rgba(239,68,68,0.1)'   },
}

const filtros = ['Todos', 'Rascunho', 'Agendado', 'Aprovado', 'Publicado']

export default function ConteudoPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [filtro, setFiltro] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [publicando, setPublicando] = useState<string | null>(null)
  const [erros, setErros] = useState<Record<string, string>>({})

  async function load() {
    const sb = createClient()
    const [{ data: ps }, { data: ims }] = await Promise.all([
      sb.from('posts').select('*').order('created_at', { ascending: false }),
      sb.from('imoveis').select('id, fotos'),
    ])
    setPosts(ps || [])
    setImoveis(ims || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function atualizar(id: string, status: string) {
    await createClient().from('posts').update({ status }).eq('id', id)
    load()
  }

  async function publicar(post: Post) {
    setPublicando(post.id)
    setErros(prev => ({ ...prev, [post.id]: '' }))

    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    const { data: config } = await sb.from('config_cliente').select('upload_post_key').eq('user_id', user?.id).single()

    if (!config?.upload_post_key) {
      setErros(prev => ({ ...prev, [post.id]: 'Configure a API key do Upload-Post em Configurações.' }))
      setPublicando(null)
      return
    }

    // Pega as fotos do imóvel
    const imovel = imoveis.find(i => i.id === post.imovel_id)
    const fotos = imovel?.fotos || []
    const mediaUrls = fotos.map(f => f.url)

    if (mediaUrls.length === 0) {
      setErros(prev => ({ ...prev, [post.id]: 'Imóvel sem fotos. Adicione fotos antes de publicar.' }))
      setPublicando(null)
      return
    }

    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: config.upload_post_key,
        plataformas: post.plataformas,
        legenda: post.legenda,
        mediaUrls,
        agendarPara: post.agendado_para || null,
      }),
    })

    const json = await res.json()

    if (json.success) {
      await sb.from('posts').update({ status: 'publicado', publicado_em: new Date().toISOString() }).eq('id', post.id)
      load()
    } else {
      setErros(prev => ({ ...prev, [post.id]: json.error || 'Erro ao publicar.' }))
    }

    setPublicando(null)
  }

  async function excluir(id: string) {
    await createClient().from('posts').delete().eq('id', id)
    load()
  }

  const visiveis = posts.filter(p =>
    filtro === 'Todos' ? true : p.status === filtro.toLowerCase()
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Conteúdo</div>
          <div style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 2 }}>{posts.length} posts no total</div>
        </div>
        <a href="/criar" style={{
          background: 'var(--accent)', color: '#fff', textDecoration: 'none',
          borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600
        }}>+ Criar</a>
      </div>

      {/* Filtros */}
      <div style={{
        display: 'flex', gap: 4, background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 9, padding: 3, marginBottom: 16, width: 'fit-content'
      }}>
        {filtros.map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
            border: 'none', background: filtro === f ? 'var(--accent)' : 'transparent',
            color: filtro === f ? '#fff' : 'var(--txt2)', transition: 'all 0.15s'
          }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--txt3)', fontSize: 13 }}>Carregando...</div>
      ) : visiveis.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--txt3)', border: '2px dashed var(--border)', borderRadius: 12 }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
          <div style={{ marginBottom: 8 }}>Nenhum post {filtro !== 'Todos' ? `com status "${filtro.toLowerCase()}"` : 'ainda'}.</div>
          <a href="/criar" style={{ color: 'var(--accent2)', fontSize: 12 }}>Criar conteúdo →</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visiveis.map(post => {
            const badge = statusBadge[post.status] || statusBadge.rascunho
            const imovel = imoveis.find(i => i.id === post.imovel_id)
            const capa = imovel?.fotos?.find(f => f.is_capa)?.url || imovel?.fotos?.[0]?.url
            const estaPublicando = publicando === post.id
            const erro = erros[post.id]

            return (
              <div key={post.id}>
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12
                }}>
                  {/* Thumb */}
                  <div style={{
                    width: 52, height: 65, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
                    background: 'linear-gradient(135deg,#1A3A6C,#0B1120)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {capa
                      ? <img src={capa} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 20 }}>🏠</span>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.titulo}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>
                      {post.tipo} · {post.plataformas?.join(', ')}
                      {post.agendado_para
                        ? ` · ${new Date(post.agendado_para).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`
                        : ''}
                    </div>
                    {post.legenda && (
                      <div style={{ fontSize: 11, color: 'var(--txt2)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.legenda}
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  <span style={{
                    fontSize: 9, padding: '3px 8px', borderRadius: 5, fontWeight: 600,
                    background: badge.bg, color: badge.color, flexShrink: 0
                  }}>{badge.label}</span>

                  {/* Ações */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {post.status === 'rascunho' && (
                      <button onClick={() => atualizar(post.id, 'aprovado')} style={{
                        background: 'rgba(16,185,129,0.12)', color: '#6EE7B7',
                        border: '1px solid rgba(16,185,129,0.2)', borderRadius: 6,
                        padding: '5px 10px', fontSize: 11, cursor: 'pointer'
                      }}>✓ Aprovar</button>
                    )}
                    {(post.status === 'aprovado' || post.status === 'agendado') && (
                      <button onClick={() => publicar(post)} disabled={estaPublicando} style={{
                        background: 'var(--accent-dim)', color: 'var(--accent2)',
                        border: '1px solid rgba(0,170,255,0.2)', borderRadius: 6,
                        padding: '5px 10px', fontSize: 11, cursor: estaPublicando ? 'wait' : 'pointer',
                        opacity: estaPublicando ? 0.7 : 1
                      }}>
                        {estaPublicando ? '⏳ Publicando...' : '↗ Publicar agora'}
                      </button>
                    )}
                    {post.status === 'publicado' && (
                      <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ Publicado</span>
                    )}
                    <button onClick={() => excluir(post.id)} style={{
                      background: 'rgba(239,68,68,0.08)', color: '#FCA5A5',
                      border: '1px solid rgba(239,68,68,0.15)', borderRadius: 6,
                      padding: '5px 8px', fontSize: 11, cursor: 'pointer'
                    }}>✕</button>
                  </div>
                </div>

                {/* Erro inline */}
                {erro && (
                  <div style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: '0 0 8px 8px', padding: '7px 14px',
                    fontSize: 11, color: '#FCA5A5', marginTop: -1
                  }}>
                    ⚠ {erro}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
