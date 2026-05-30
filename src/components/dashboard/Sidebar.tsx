'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const nav = [
  { section: 'Principal', items: [
    { href: '/', label: 'Início', emoji: '⊞' },
    { href: '/imoveis', label: 'Imóveis', emoji: '🏠' },
  ]},
  { section: 'Conteúdo', items: [
    { href: '/criar', label: 'Criar', emoji: '✦' },
    { href: '/conteudo', label: 'Conteúdo', emoji: '▦', badge: '3' },
    { href: '/agenda', label: 'Agenda', emoji: '◫' },
  ]},
  { section: 'Análise', items: [
    { href: '/relatorios', label: 'Relatórios', emoji: '↗' },
  ]},
  { section: 'Ajustes', items: [
    { href: '/config', label: 'Configurações', emoji: '⚙' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{
      width: 220,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border)' }}>
        <Image src="/logo.png" alt="Postpro" width={140} height={46} style={{ objectFit: 'contain' }} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {nav.map(({ section, items }) => (
          <div key={section}>
            <div style={{
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--txt3)',
              padding: '12px 8px 4px',
            }}>
              {section}
            </div>
            {items.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '8px 10px',
                    borderRadius: 8,
                    marginBottom: 2,
                    color: active ? 'var(--accent2)' : 'var(--txt2)',
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    fontSize: 13,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: 14 }}>{item.emoji}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        background: 'var(--accent)',
                        color: '#fff',
                        fontSize: 9,
                        padding: '1px 5px',
                        borderRadius: 8,
                        fontWeight: 700,
                      }}>{item.badge}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>P</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)' }}>Minha conta</div>
            <div style={{ fontSize: 10, color: 'var(--txt3)' }}>Plano Pro</div>
          </div>
          <button onClick={logout} title="Sair" style={{
            background: 'transparent', border: 'none', color: 'var(--txt3)',
            cursor: 'pointer', fontSize: 14, padding: 4, lineHeight: 1,
          }}>⏻</button>
        </div>
      </div>
    </aside>
  )
}
