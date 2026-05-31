'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const palavras = ['Instagram', 'Facebook', 'Redes Sociais']

const stats = [
  { num: '10s', label: 'pra gerar um carrossel' },
  { num: '100%', label: 'com sua identidade' },
  { num: 'Zero', label: 'custo de designer' },
]

const slides = [
  { tipo: 'LANÇAMENTO', titulo: 'Beach Market Tower', local: 'Balneário Camboriú · SC', preco: 'Alto padrão', img: '/imovel-1.jpg' },
  { tipo: 'OPORTUNIDADE', titulo: 'Residencial Praia Brava', local: 'Itajaí · SC', preco: 'Vista panorâmica', img: '/imovel-2.jpg' },
  { tipo: 'DESTAQUE', titulo: 'Anastásia Tower', local: 'Balneário Camboriú · SC', preco: 'Arquitetura exclusiva', img: '/imovel-3.jpg' },
]

const features = ['Carrossel automático com sua logo', 'Legenda gerada por IA', 'Publica direto no Instagram', 'Agendamento de posts', 'Gestão de imóveis', 'Relatórios de desempenho']

export default function LandingPage() {
  const [palavra, setPalavra] = useState(0)
  const [visivel, setVisivel] = useState(true)
  const [slide, setSlide] = useState(0)
  const [publicado, setPublicado] = useState(false)
  const [publicando, setPublicando] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setVisivel(false)
      setTimeout(() => { setPalavra(p => (p + 1) % palavras.length); setVisivel(true) }, 350)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 3200)
    return () => clearInterval(t)
  }, [])

  function simular() {
    if (publicando || publicado) return
    setPublicando(true)
    setTimeout(() => { setPublicando(false); setPublicado(true) }, 1800)
    setTimeout(() => setPublicado(false), 5000)
  }

  const s = slides[slide]

  return (
    <div style={{ background: '#070D1A', color: '#EEF2FF', minHeight: '100vh', overflow: 'hidden', fontFamily: 'inherit' }}>

      {/* Grid de fundo */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(0,170,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,170,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Blur orbs */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,100,255,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '30%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(80,0,255,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 62,
        background: 'rgba(7,13,26,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Image src="/logo.png" alt="Postpro" width={110} height={34} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/login" style={{ color: '#8899BB', fontSize: 13, textDecoration: 'none', padding: '7px 16px', borderRadius: 8, border: '1px solid transparent', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#EEF2FF' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#8899BB' }}>
            Entrar
          </a>
          <a href="/cadastro" style={{
            background: 'linear-gradient(135deg, #0080FF, #00AAFF)',
            color: '#fff', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', padding: '8px 20px', borderRadius: 9,
            boxShadow: '0 4px 20px rgba(0,150,255,0.35)',
          }}>Começar grátis →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 40px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1,
        gap: 60, flexWrap: 'wrap',
      }}>

        {/* ESQUERDA — Copy */}
        <div style={{ flex: '1 1 420px', maxWidth: 580 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(0,170,255,0.08)', border: '1px solid rgba(0,170,255,0.2)',
            borderRadius: 30, padding: '5px 14px', marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00AAFF', display: 'inline-block', boxShadow: '0 0 8px #00AAFF' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#33BBFF', letterSpacing: '.06em' }}>MARKETING IMOBILIÁRIO COM IA</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(34px, 4.5vw, 62px)', fontWeight: 900, lineHeight: 1.08, marginBottom: 20, letterSpacing: '-2px' }}>
            Seu imóvel no{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00AAFF, #33DDFF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              opacity: visivel ? 1 : 0, transition: 'opacity 0.3s',
            }}>{palavras[palavra]}</span>
            <br />sem depender de<br />
            <span style={{ color: '#3A4A6A' }}>designer ou agência.</span>
          </h1>

          <p style={{ fontSize: 16, color: '#8899BB', lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
            Sobe as fotos do imóvel, a IA cria o carrossel com sua identidade visual e publica automaticamente. Você só aprova.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 40, flexWrap: 'wrap' }}>
            {stats.map(st => (
              <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#00AAFF', letterSpacing: '-1px' }}>{st.num}</span>
                <span style={{ fontSize: 11, color: '#4A5A7A', lineHeight: 1.3, maxWidth: 80 }}>{st.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
            <a href="/cadastro" style={{
              background: 'linear-gradient(135deg, #0070FF, #00AAFF)',
              color: '#fff', fontSize: 14, fontWeight: 700,
              textDecoration: 'none', padding: '13px 28px', borderRadius: 10,
              boxShadow: '0 8px 32px rgba(0,150,255,0.4)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Quero meu sistema agora
              <span style={{ fontSize: 16 }}>→</span>
            </a>
            <a href="https://wa.me/5547996958399?text=Quero+saber+mais+sobre+o+Postpro" target="_blank" rel="noreferrer" style={{
              background: 'rgba(255,255,255,0.05)', color: '#EEF2FF', fontSize: 13,
              textDecoration: 'none', padding: '13px 22px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>💬</span> Falar no WhatsApp
            </a>
          </div>

          {/* Features checklist */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
            {features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6A7A9A' }}>
                <span style={{ color: '#00AAFF', fontSize: 14 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        {/* DIREITA — Mockup do produto */}
        <div style={{ flex: '0 0 auto', position: 'relative' }}>

          {/* Frame do phone */}
          <div style={{
            width: 260, height: 490,
            background: 'linear-gradient(145deg, #1A2540, #0E1628)',
            borderRadius: 40,
            border: '2px solid rgba(255,255,255,0.12)',
            padding: 10,
            boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.04)',
            position: 'relative',
          }}>
            {/* Notch */}
            <div style={{
              position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
              width: 80, height: 24, background: '#0E1628', borderRadius: 12, zIndex: 10,
            }} />

            {/* Tela */}
            <div style={{
              width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden',
              position: 'relative', background: '#0B1120',
            }}>
              {/* Foto de fundo com transição */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url('${s.img}')`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'background-image 0.6s ease',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.3) 55%, rgba(0,0,0,.2) 100%)' }} />

              {/* Header do slide */}
              <div style={{ position: 'absolute', top: 34, left: 14, right: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg,#0080FF,#00AAFF)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>P</div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>POSTPRO</span>
                </div>
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,.5)' }}>1/5</span>
              </div>

              {/* Conteúdo do slide */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 20px' }}>
                <div style={{ fontSize: 8, color: '#33BBFF', fontWeight: 700, letterSpacing: '.08em', marginBottom: 5 }}>{s.tipo}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>{s.titulo}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#00AAFF', marginBottom: 3 }}>{s.preco}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.55)' }}>{s.local}</div>
              </div>

              {/* Indicadores */}
              <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                {slides.map((_, i) => (
                  <div key={i} style={{ width: i === slide ? 16 : 4, height: 4, borderRadius: 2, background: i === slide ? '#00AAFF' : 'rgba(255,255,255,0.3)', transition: 'all .3s' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Badge flutuante — IA gerando */}
          <div style={{
            position: 'absolute', top: 40, right: -60,
            background: '#131C2E', border: '1px solid rgba(0,170,255,0.25)',
            borderRadius: 10, padding: '8px 12px', fontSize: 10, color: '#33BBFF', fontWeight: 600,
            whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'floatA 3s ease-in-out infinite',
          }}>
            ✦ IA gerando legenda...
          </div>

          {/* Badge flutuante — Publicado */}
          <div onClick={simular} style={{
            position: 'absolute', bottom: 80, right: -70,
            background: publicado ? 'rgba(16,185,129,0.15)' : '#131C2E',
            border: `1px solid ${publicado ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 10, padding: '8px 14px',
            fontSize: 10, fontWeight: 600, cursor: 'pointer',
            color: publicado ? '#6EE7B7' : '#EEF2FF',
            whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            transition: 'all .3s', animation: 'floatB 3.5s ease-in-out infinite',
          }}>
            {publicando ? '⏳ Publicando...' : publicado ? '✓ Publicado no Instagram!' : '↗ Publicar agora'}
          </div>

          {/* Badge flutuante — stats */}
          <div style={{
            position: 'absolute', top: 160, left: -80,
            background: '#131C2E', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '8px 12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'floatC 4s ease-in-out infinite',
          }}>
            <div style={{ fontSize: 9, color: '#4A5A7A', marginBottom: 4, fontWeight: 600 }}>ALCANCE</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#EEF2FF' }}>2.847</div>
            <div style={{ fontSize: 9, color: '#00AAFF', marginTop: 2 }}>↑ 34% essa semana</div>
          </div>

          {/* Plataformas */}
          <div style={{ position: 'absolute', bottom: 20, left: -60, display: 'flex', gap: 6, animation: 'floatC 5s ease-in-out infinite' }}>
            {['📷 Instagram', '📘 Facebook'].map(p => (
              <div key={p} style={{
                background: '#131C2E', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '5px 10px', fontSize: 9, fontWeight: 600, color: '#8899BB',
                whiteSpace: 'nowrap',
              }}>{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé mínimo */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '16px 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
      }}>
        <Image src="/logo.png" alt="Postpro" width={90} height={28} style={{ objectFit: 'contain' }} />
        <div style={{ fontSize: 11, color: '#3A4A6A' }}>Conteúdo inteligente para quem vende imóveis</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="/login" style={{ fontSize: 11, color: '#4A5A7A', textDecoration: 'none' }}>Entrar</a>
          <a href="/cadastro" style={{ fontSize: 11, color: '#4A5A7A', textDecoration: 'none' }}>Cadastrar</a>
        </div>
      </footer>

      {/* WhatsApp */}
      <a href="https://wa.me/5547996958399?text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Postpro." target="_blank" rel="noreferrer"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          width: 52, height: 52, borderRadius: '50%',
          background: '#25D366', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.5)', textDecoration: 'none', fontSize: 24,
          transition: 'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes floatC { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      `}</style>
    </div>
  )
}
