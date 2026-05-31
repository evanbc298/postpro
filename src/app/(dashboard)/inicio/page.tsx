'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Onboarding from '@/components/dashboard/Onboarding'

type Stats = { imoveis: number; agendados: number; pendentes: number }
type Post = { id: string; titulo: string; tipo: string; plataformas: string[]; status: string; agendado_para: string }
type Task = { id: number; text: string; done: boolean; tag: string }

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  rascunho:  { label: 'Rascunho',  color: '#94A3B8', bg: 'rgba(100,116,139,0.12)' },
  agendado:  { label: 'Agendado',  color: '#93C5FD', bg: 'rgba(59,130,246,0.12)'  },
  aprovado:  { label: 'Aprovado',  color: '#C4B5FD', bg: 'rgba(139,92,246,0.12)'  },
  publicado: { label: 'Publicado', color: '#6EE7B7', bg: 'rgba(16,185,129,0.12)'  },
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ imoveis: 0, agendados: 0, pendentes: 0 })
  const [proximosPosts, setProximosPosts] = useState<Post[]>([])
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Configurar API key do Upload-Post', done: false, tag: 'hoje' },
    { id: 2, text: 'Cadastrar primeiro imóvel', done: false, tag: 'hoje' },
    { id: 3, text: 'Criar primeiro carrossel', done: false, tag: 'semana' },
  ])

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const [{ data: { user } }, { count: imoveis }, { count: agendados }, { count: pendentes }, { data: posts }] = await Promise.all([
        sb.auth.getUser(),
        sb.from('imoveis').select('*', { count: 'exact', head: true }),
        sb.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'agendado'),
        sb.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'rascunho'),
        sb.from('posts').select('*').not('agendado_para', 'is', null).order('agendado_para').limit(4),
      ])
      const nome = user?.user_metadata?.nome || user?.email?.split('@')[0] || ''
      setNomeUsuario(nome)
      setStats({ imoveis: imoveis || 0, agendados: agendados || 0, pendentes: pendentes || 0 })
      setProximosPosts(posts || [])
    }
    load()
  }, [])

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  const statCards = [
    { label: 'Imóveis ativos', value: stats.imoveis, sub: stats.imoveis === 0 ? 'Cadastre o primeiro' : 'no sistema', color: 'var(--txt)' },
    { label: 'Posts agendados', value: stats.agendados, sub: 'próximos dias', color: 'var(--txt)' },
    { label: 'Alcance esta semana', value: '—', sub: 'conecte o Instagram', color: 'var(--txt)' },
    { label: 'Pendentes aprovação', value: stats.pendentes, sub: stats.pendentes === 0 ? 'Tudo em dia ✓' : 'aguardando ok', color: stats.pendentes > 0 ? 'var(--yellow)' : 'var(--txt)' },
  ]

  const shortcuts = [
    { label: 'Criar carrossel', sub: 'Instagram · Facebook', href: '/criar', bg: 'var(--accent-dim)', color: 'var(--accent2)', emoji: '🖼️' },
    { label: 'Ver agenda', sub: 'Calendário de posts', href: '/agenda', bg: 'rgba(16,185,129,0.1)', color: '#6EE7B7', emoji: '📅' },
    { label: 'Relatórios', sub: 'Desempenho', href: '/relatorios', bg: 'rgba(139,92,246,0.1)', color: '#C4B5FD', emoji: '📊' },
    { label: 'Novo imóvel', sub: 'Cadastrar', href: '/imoveis', bg: 'rgba(245,158,11,0.1)', color: '#FCD34D', emoji: '🏠' },
    { label: 'Aprovações', sub: `${stats.pendentes} pendentes`, href: '/conteudo', bg: 'rgba(99,102,241,0.1)', color: '#A5B4FC', emoji: '✓' },
    { label: 'Configurações', sub: 'API keys e contas', href: '/config', bg: 'rgba(100,116,139,0.1)', color: '#94A3B8', emoji: '⚙️' },
  ]

  return (
    <div>
      <Onboarding />

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>
          {saudacao}{nomeUsuario ? `, ${nomeUsuario}` : ''}
        </div>
        <div style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 4 }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--txt2)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* AI Sugestão */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Sugestão da IA</div>
          <div style={{
            background: 'linear-gradient(135deg,rgba(0,170,255,0.12),rgba(0,170,255,0.04))',
            border: '1px solid rgba(0,170,255,0.25)', borderRadius: 12, padding: 14,
            display: 'flex', gap: 12
          }}>
            <div style={{
              width: 32, height: 32, background: 'var(--accent)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16
            }}>✦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent2)', marginBottom: 4 }}>Ideia pra hoje</div>
              <div style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.5 }}>
                {stats.imoveis === 0
                  ? 'Cadastre seu primeiro imóvel em Imóveis e eu crio o conteúdo automaticamente.'
                  : 'Que tal criar um carrossel destacando os diferenciais do seu imóvel mais recente? Posts visuais geram 2x mais salvamentos.'}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <Link href="/criar" style={{
                  background: 'var(--accent)', color: '#fff', textDecoration: 'none',
                  borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 600
                }}>Criar agora</Link>
                <Link href="/imoveis" style={{
                  background: 'transparent', color: 'var(--txt2)', textDecoration: 'none',
                  border: '1px solid var(--border)', borderRadius: 6, padding: '5px 12px', fontSize: 11
                }}>Ver imóveis</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Atalhos */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Atalhos rápidos</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {shortcuts.map(s => (
              <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
                  padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', transition: 'all 0.15s'
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 7, background: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, flexShrink: 0
                  }}>{s.emoji}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt)' }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 1 }}>{s.sub}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Pra fazer */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Pra fazer</div>
          </div>
          {tasks.map(t => (
            <div key={t.id} onClick={() => toggleTask(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer'
            }}>
              <div style={{
                width: 17, height: 17, borderRadius: 4, flexShrink: 0,
                border: `2px solid ${t.done ? 'var(--green)' : 'var(--border)'}`,
                background: t.done ? 'var(--green)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: '#fff', transition: 'all 0.15s'
              }}>{t.done ? '✓' : ''}</div>
              <div style={{
                fontSize: 12, flex: 1,
                textDecoration: t.done ? 'line-through' : 'none',
                color: t.done ? 'var(--txt3)' : 'var(--txt)'
              }}>{t.text}</div>
              <span style={{
                fontSize: 9, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                background: t.tag === 'hoje' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                color: t.tag === 'hoje' ? '#FCA5A5' : '#FCD34D'
              }}>{t.tag}</span>
            </div>
          ))}
        </div>

        {/* Próximos posts */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Próximos posts</div>
            <Link href="/agenda" style={{ fontSize: 11, color: 'var(--accent2)', textDecoration: 'none' }}>Ver agenda</Link>
          </div>

          {proximosPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--txt3)', fontSize: 12 }}>
              Nenhum post agendado ainda.{' '}
              <Link href="/criar" style={{ color: 'var(--accent2)' }}>Criar agora →</Link>
            </div>
          ) : proximosPosts.map(p => {
            const badge = statusBadge[p.status] || statusBadge.rascunho
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 0', borderBottom: '1px solid var(--border)'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 7, flexShrink: 0,
                  background: 'linear-gradient(135deg,#1A3A6C,#0B1120)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>🏠</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.titulo}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 2 }}>
                    {p.agendado_para
                      ? new Date(p.agendado_para).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                      : ''} · {p.plataformas?.join(', ')}
                  </div>
                </div>
                <span style={{
                  fontSize: 9, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                  background: badge.bg, color: badge.color
                }}>{badge.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
