'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Step = {
  id: string
  titulo: string
  descricao: string
  href: string
  cta: string
  done: boolean
}

export default function Onboarding() {
  const [steps, setSteps] = useState<Step[]>([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    async function check() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return

      const [{ data: config }, { data: imoveis }, { data: posts }] = await Promise.all([
        sb.from('config_cliente').select('upload_post_key, logo_url').eq('user_id', user.id).single(),
        sb.from('imoveis').select('id').eq('user_id', user.id).limit(1),
        sb.from('posts').select('id').eq('user_id', user.id).limit(1),
      ])

      setSteps([
        {
          id: 'logo',
          titulo: 'Adicione sua logo',
          descricao: 'Sua logo aparece em todos os carrosséis gerados pelo sistema.',
          href: '/config',
          cta: 'Ir para Configurações',
          done: !!config?.logo_url,
        },
        {
          id: 'upload_post',
          titulo: 'Conecte suas redes sociais',
          descricao: 'Cole a API key do Upload-Post pra publicar no Instagram e Facebook.',
          href: '/config',
          cta: 'Ir para Configurações',
          done: !!config?.upload_post_key,
        },
        {
          id: 'imovel',
          titulo: 'Cadastre seu primeiro imóvel',
          descricao: 'Suba as fotos, preço e localização. O sistema usa esses dados pra criar o conteúdo.',
          href: '/imoveis',
          cta: 'Cadastrar imóvel',
          done: (imoveis?.length || 0) > 0,
        },
        {
          id: 'post',
          titulo: 'Crie seu primeiro carrossel',
          descricao: 'Selecione um imóvel, gere a legenda com IA e agende a publicação.',
          href: '/criar',
          cta: 'Criar carrossel',
          done: (posts?.length || 0) > 0,
        },
      ])
      setLoading(false)
    }
    check()
  }, [])

  if (loading) return null

  const concluidos = steps.filter(s => s.done).length
  const total = steps.length
  const tudo = concluidos === total

  if (tudo) return null

  const pct = Math.round((concluidos / total) * 100)

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 20, marginBottom: 20,
      borderLeft: '3px solid var(--accent)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsed ? 0 : 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              Configure seu sistema {concluidos > 0 && <span style={{ color: 'var(--accent2)' }}>— {concluidos} de {total} concluídos</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>
              Siga os passos abaixo pra começar a publicar
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Barra de progresso */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 80, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 3, transition: 'width .4s ease' }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{pct}%</span>
          </div>
          <button onClick={() => setCollapsed(c => !c)} style={{
            background: 'var(--hover)', border: 'none', color: 'var(--txt3)',
            borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 12
          }}>
            {collapsed ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {steps.map((step, i) => (
            <div key={step.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 10,
              background: step.done ? 'rgba(16,185,129,0.06)' : 'var(--bg)',
              border: `1px solid ${step.done ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
              opacity: step.done ? 0.7 : 1,
              transition: 'all .2s',
            }}>
              {/* Número/check */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: step.done ? 'var(--green)' : 'var(--accent-dim)',
                border: `2px solid ${step.done ? 'var(--green)' : 'var(--accent)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: step.done ? 13 : 11, fontWeight: 700,
                color: step.done ? '#fff' : 'var(--accent2)',
                transition: 'all .2s',
              }}>
                {step.done ? '✓' : i + 1}
              </div>

              {/* Texto */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  textDecoration: step.done ? 'line-through' : 'none',
                  color: step.done ? 'var(--txt3)' : 'var(--txt)',
                }}>
                  {step.titulo}
                </div>
                {!step.done && (
                  <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>
                    {step.descricao}
                  </div>
                )}
              </div>

              {/* CTA */}
              {!step.done && (
                <a href={step.href} style={{
                  background: 'var(--accent)', color: '#fff', textDecoration: 'none',
                  borderRadius: 7, padding: '6px 14px', fontSize: 11, fontWeight: 600,
                  flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                  {step.cta} →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
