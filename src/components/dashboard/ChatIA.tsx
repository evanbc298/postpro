'use client'

import { useState, useRef, useEffect } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function ChatIA() {
  const [aberto, setAberto] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, aberto])

  async function enviar(e?: React.FormEvent) {
    e?.preventDefault()
    const texto = input.trim()
    if (!texto || loading) return

    const novaMsg: Msg = { role: 'user', content: texto }
    setMsgs(prev => [...prev, novaMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: texto,
          historico: msgs.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMsgs(prev => [...prev, { role: 'assistant', content: data.resposta || data.error || 'Erro ao responder.' }])
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Não consegui responder agora. Tente de novo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Painel do chat */}
      {aberto && (
        <div style={{
          position: 'fixed', bottom: 72, right: 24, zIndex: 200,
          width: 360, height: 480,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, display: 'flex', flexDirection: 'column',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>✦</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Assistente Postpro</div>
                <div style={{ fontSize: 10, color: 'var(--txt3)' }}>IA de marketing imobiliário</div>
              </div>
            </div>
            <button onClick={() => setAberto(false)} style={{
              background: 'transparent', border: 'none', color: 'var(--txt3)',
              cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4,
            }}>✕</button>
          </div>

          {/* Mensagens */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--txt3)', fontSize: 12, marginTop: 40 }}>
                Pergunte sobre marketing, conteúdo ou como usar a plataforma.
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.role === 'user' ? 'var(--accent)' : 'var(--bg)',
                border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                padding: '9px 13px',
                fontSize: 12,
                lineHeight: 1.55,
                color: m.role === 'user' ? '#fff' : 'var(--txt)',
              }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start', background: 'var(--bg)',
                border: '1px solid var(--border)', borderRadius: '12px 12px 12px 3px',
                padding: '9px 13px', fontSize: 12, color: 'var(--txt3)',
              }}>...</div>
            )}
            <div ref={fimRef} />
          </div>

          {/* Input */}
          <form onSubmit={enviar} style={{
            padding: '10px 12px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 8, background: 'var(--bg)',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Peça algo pra IA..."
              disabled={loading}
              style={{
                flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '8px 12px', color: 'var(--txt)',
                fontSize: 12, outline: 'none',
              }}
            />
            <button type="submit" disabled={loading || !input.trim()} style={{
              background: 'var(--accent)', border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 16, width: 36, cursor: 'pointer',
              opacity: loading || !input.trim() ? 0.5 : 1, transition: 'opacity 0.15s',
            }}>↑</button>
          </form>
        </div>
      )}

      {/* Botão flutuante */}
      <button
        onClick={() => setAberto(v => !v)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          width: 44, height: 44, borderRadius: 12,
          background: aberto ? 'var(--bg2)' : 'var(--accent)',
          border: aberto ? '1px solid var(--border)' : 'none',
          color: '#fff', fontSize: 18, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        {aberto ? '✕' : '✦'}
      </button>
    </>
  )
}
