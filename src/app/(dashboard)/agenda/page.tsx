'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Post = { id: string; titulo: string; tipo: string; plataformas: string[]; agendado_para: string; status: string }

const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function AgendaPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [mes, setMes] = useState(new Date().getMonth())
  const [ano, setAno] = useState(new Date().getFullYear())

  useEffect(() => {
    createClient().from('posts').select('*')
      .not('agendado_para', 'is', null)
      .order('agendado_para')
      .then(({ data }) => setPosts(data || []))
  }, [])

  const hoje = new Date()
  const primeiroDia = new Date(ano, mes, 1).getDay()
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()
  const diasAnterior = new Date(ano, mes, 0).getDate()

  function postsDoDia(dia: number) {
    return posts.filter(p => {
      const d = new Date(p.agendado_para)
      return d.getDate() === dia && d.getMonth() === mes && d.getFullYear() === ano
    })
  }

  function navMes(dir: number) {
    const d = new Date(ano, mes + dir)
    setMes(d.getMonth())
    setAno(d.getFullYear())
  }

  const cells = []
  for (let i = 0; i < primeiroDia; i++) cells.push({ day: diasAnterior - primeiroDia + 1 + i, current: false })
  for (let i = 1; i <= diasNoMes; i++) cells.push({ day: i, current: true })
  const restante = 42 - cells.length
  for (let i = 1; i <= restante; i++) cells.push({ day: i, current: false })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Agenda</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navMes(-1)} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--txt2)',
            borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14
          }}>‹</button>
          <div style={{ fontSize: 13, fontWeight: 600, minWidth: 140, textAlign: 'center' }}>
            {meses[mes]} {ano}
          </div>
          <button onClick={() => navMes(1)} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--txt2)',
            borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14
          }}>›</button>
          <a href="/criar" style={{
            background: 'var(--accent)', color: '#fff', textDecoration: 'none',
            borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 600, marginLeft: 8
          }}>+ Agendar</a>
        </div>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14, fontSize: 11, color: 'var(--txt3)' }}>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'rgba(0,170,255,0.4)', marginRight: 4 }}></span>Instagram</span>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'rgba(99,102,241,0.4)', marginRight: 4 }}></span>Facebook</span>
      </div>

      {/* Dias da semana */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
        {dias.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--txt3)', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {cells.map((cell, i) => {
          const isToday = cell.current && cell.day === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
          const dayPosts = cell.current ? postsDoDia(cell.day) : []
          return (
            <div key={i} style={{
              minHeight: 72, background: 'var(--bg2)',
              border: `1px solid ${isToday ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 8, padding: 7, opacity: cell.current ? 1 : 0.35,
              cursor: 'pointer'
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: isToday ? 700 : 500,
                color: isToday ? 'var(--accent2)' : 'var(--txt)',
              }}>{cell.day}</div>
              {dayPosts.map(p => (
                <div key={p.id} style={{
                  marginTop: 3, fontSize: 9, padding: '1px 5px', borderRadius: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  background: p.plataformas?.includes('instagram') ? 'rgba(0,170,255,0.2)' : 'rgba(99,102,241,0.2)',
                  color: p.plataformas?.includes('instagram') ? '#93C5FD' : '#A5B4FC',
                }}>{p.titulo}</div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Posts do mês */}
      {posts.filter(p => {
        const d = new Date(p.agendado_para)
        return d.getMonth() === mes && d.getFullYear() === ano
      }).length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Posts agendados em {meses[mes]}</div>
          {posts.filter(p => {
            const d = new Date(p.agendado_para)
            return d.getMonth() === mes && d.getFullYear() === ano
          }).map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0', borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: 12, color: 'var(--accent2)', minWidth: 80 }}>
                {new Date(p.agendado_para).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                {' '}
                {new Date(p.agendado_para).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ flex: 1, fontSize: 12 }}>{p.titulo}</div>
              <div style={{ fontSize: 10, color: 'var(--txt3)' }}>{p.plataformas?.join(', ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
