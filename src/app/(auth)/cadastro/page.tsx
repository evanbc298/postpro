'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/inicio')
  }

  return (
    <div style={{ width: '100%', maxWidth: 420, padding: '0 16px' }}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 32,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Image src="/logo.png" alt="Postpro" width={160} height={60} style={{ objectFit: 'contain' }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Criar conta</div>
          <div style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 4 }}>
            Comece a automatizar seu marketing imobiliário
          </div>
        </div>

        <form onSubmit={handleCadastro}>
          {[
            { label: 'Nome', value: nome, set: setNome, type: 'text', placeholder: 'Seu nome' },
            { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'seu@email.com' },
            { label: 'Senha', value: password, set: setPassword, type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.label} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 6 }}>
                {field.label}
              </label>
              <input
                type={field.type}
                value={field.value}
                onChange={e => field.set(e.target.value)}
                placeholder={field.placeholder}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '9px 12px',
                  color: 'var(--txt)',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>
          ))}

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              color: '#FCA5A5',
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 8,
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Criando conta...' : 'Criar conta grátis'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--txt3)' }}>
          Já tem conta?{' '}
          <a href="/login" style={{ color: 'var(--accent2)', textDecoration: 'none' }}>Entrar</a>
        </div>
      </div>
    </div>
  )
}
