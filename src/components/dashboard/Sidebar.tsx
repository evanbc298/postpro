'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useState } from 'react'

const nav = [
  { section: 'Principal', items: [
    { href: '/inicio', label: 'Início', emoji: '⊞' },
    { href: '/imoveis', label: 'Imóveis', emoji: '🏠' },
  ]},
  { section: 'Conteúdo', items: [
    { href: '/criar', label: 'Criar', emoji: '✦' },
    { href: '/conteudo', label: 'Conteúdo', emoji: '▦' },
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
  const [mobileOpen, setMobileOpen] = useState(false)

  async function logout() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <Image src="/logo.png" alt="Postpro" width={140} height={46} style={{ objectFit: 'contain' }} priority />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {nav.map(({ section, items }) => (
          <div key={section}>
            <div style={{
              fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--txt3)', padding: '12px 8px 4px',
            }}>{section}</div>
            {items.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className={`nav-link${active ? ' active' : ''}`}
                  onClick={() => setMobileOpen(false)}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.emoji}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0, color: '#fff'
          }}>P</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt)' }}>Minha conta</div>
            <div style={{ fontSize: 10, color: 'var(--txt3)' }}>Plano Pro</div>
          </div>
          <button onClick={logout} title="Sair" style={{
            background: 'transparent', border: 'none', color: 'var(--txt3)',
            cursor: 'pointer', fontSize: 16, padding: 4, lineHeight: 1,
            transition: 'color 0.15s',
          }}>⏻</button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0,
        height: 52, background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
        zIndex: 50,
      }} className="mobile-topbar">
        <Image src="/logo.png" alt="Postpro" width={100} height={32} style={{ objectFit: 'contain' }} />
        <button onClick={() => setMobileOpen(true)} style={{
          background: 'var(--hover)', border: 'none', color: 'var(--txt)',
          borderRadius: 7, width: 34, height: 34, cursor: 'pointer', fontSize: 18
        }}>☰</button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 98, display: 'none',
        }} className="mobile-overlay" />
      )}

      {/* Sidebar desktop */}
      <aside className="sidebar-desktop" style={{
        width: 'var(--sidebar)', background: 'var(--bg2)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', flexShrink: 0, height: '100vh',
      }}>
        {sidebarContent}
      </aside>

      {/* Sidebar mobile drawer */}
      <aside style={{
        position: 'fixed', top: 0, left: mobileOpen ? 0 : '-100%', bottom: 0,
        width: 240, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', zIndex: 99,
        transition: 'left 0.25s ease',
      }} className="mobile-sidebar">
        <button onClick={() => setMobileOpen(false)} style={{
          position: 'absolute', top: 12, right: 12,
          background: 'var(--hover)', border: 'none', color: 'var(--txt2)',
          borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 14
        }}>✕</button>
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-topbar   { display: flex !important; }
          .mobile-overlay  { display: block !important; }
        }
      `}</style>
    </>
  )
}
