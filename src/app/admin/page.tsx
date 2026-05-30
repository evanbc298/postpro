'use client'

import { useEffect, useState } from 'react'

type Cliente = {
  id: string; email: string; nome: string; criado_em: string
  ultimo_login: string; imoveis: number; posts: number; publicados: number
}

export default function AdminPage() {
  const [total, setTotal] = useState(0)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/usuarios')
      .then(r => r.json())
      .then(d => { setTotal(d.total); setClientes(d.clientes || []); setLoading(false) })
  }, [])

  const totalImoveis  = clientes.reduce((s, c) => s + c.imoveis, 0)
  const totalPosts    = clientes.reduce((s, c) => s + c.posts, 0)
  const totalPublicados = clientes.reduce((s, c) => s + c.publicados, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 32 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Painel Admin</div>
            <div style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 3 }}>Visão geral dos clientes Postpro</div>
          </div>
          <a href="/" style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--txt2)',
            borderRadius: 8, padding: '7px 14px', fontSize: 12, textDecoration: 'none'
          }}>← Voltar</a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--txt3)', fontSize: 13 }}>Carregando...</div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Clientes ativos', value: total, color: 'var(--accent2)' },
                { label: 'Imóveis cadastrados', value: totalImoveis, color: 'var(--txt)' },
                { label: 'Posts criados', value: totalPosts, color: 'var(--txt)' },
                { label: 'Posts publicados', value: totalPublicados, color: 'var(--green)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 16
                }}>
                  <div style={{ fontSize: 11, color: 'var(--txt2)', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Lista de clientes */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Clientes</div>
                <div style={{ fontSize: 11, color: 'var(--txt3)' }}>{total} no total</div>
              </div>

              {clientes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--txt3)', fontSize: 13 }}>
                  Nenhum cliente ainda.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Cliente', 'Imóveis', 'Posts', 'Publicados', 'Cadastro', 'Último acesso'].map(h => (
                        <th key={h} style={{
                          padding: '10px 16px', textAlign: 'left',
                          fontSize: 10, fontWeight: 600, color: 'var(--txt3)',
                          textTransform: 'uppercase', letterSpacing: '.06em'
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c, i) => (
                      <tr key={c.id} style={{
                        borderBottom: i < clientes.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'background .15s',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0
                            }}>{(c.nome || c.email || '?')[0].toUpperCase()}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.nome || '—'}</div>
                              <div style={{ fontSize: 11, color: 'var(--txt3)' }}>{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{c.imoveis}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.posts}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 5, fontWeight: 600,
                            background: c.publicados > 0 ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.1)',
                            color: c.publicados > 0 ? '#6EE7B7' : 'var(--txt3)'
                          }}>{c.publicados}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--txt3)' }}>
                          {new Date(c.criado_em).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--txt3)' }}>
                          {c.ultimo_login ? new Date(c.ultimo_login).toLocaleDateString('pt-BR') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
