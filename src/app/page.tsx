'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/* ── Slides de exemplo (template Elegante) ── */
const slides = [
  {
    img: '/imovel-1.jpg.jpg',
    tipo: 'LANÇAMENTO', titulo: 'Beach Market Tower', local: 'Balneário Camboriú, SC',
    preco: 'A consultar', detalhe: 'Alto padrão · Frente mar',
  },
  {
    img: '/imovel-2.jpg.jpg',
    tipo: 'LANÇAMENTO', titulo: 'Residencial Praia Brava', local: 'Itajaí, SC',
    preco: 'A consultar', detalhe: 'Piscina infinity · Vista panorâmica',
  },
  {
    img: '/imovel-3.jpg.jpg',
    tipo: 'LANÇAMENTO', titulo: 'Anastásia Tower', local: 'Balneário Camboriú, SC',
    preco: 'A consultar', detalhe: 'Arquitetura exclusiva · Alto padrão',
  },
]

const palavras = ['Instagram', 'Facebook', 'Redes Sociais']

export default function LandingPage() {
  const [slideAtivo, setSlideAtivo] = useState(0)
  const [palavra, setPalavra] = useState(0)
  const [visivel, setVisivel] = useState(true)
  const [publicando, setPublicando] = useState(false)
  const [publicado, setPublicado] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Troca slides automaticamente
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSlideAtivo(s => (s + 1) % slides.length)
    }, 3000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  // Troca palavra no hero
  useEffect(() => {
    const t = setInterval(() => {
      setVisivel(false)
      setTimeout(() => { setPalavra(p => (p + 1) % palavras.length); setVisivel(true) }, 400)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  // Simula publicação ao clicar
  function simularPublicacao() {
    if (publicando || publicado) return
    setPublicando(true)
    setTimeout(() => { setPublicando(false); setPublicado(true) }, 2000)
    setTimeout(() => setPublicado(false), 5000)
  }

  const s = slides[slideAtivo]

  return (
    <div style={{ background: '#0B1120', color: '#F0F4FF', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
        background: 'rgba(11,17,32,0.9)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <Image src="/logo.png" alt="Postpro" width={120} height={38} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/login" style={{ color: '#8899BB', fontSize: 13, textDecoration: 'none', padding: '7px 16px' }}>
            Entrar
          </a>
          <a href="#setup" style={{
            background: '#00AAFF', color: '#fff', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', padding: '8px 20px', borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,170,255,0.35)'
          }}>Quero o setup →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', padding: '120px 40px 80px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 60, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
        maxWidth: 1200, margin: '0 auto'
      }}>
        {/* Partículas de fundo */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i % 2 === 0 ? 300 : 200,
            height: i % 2 === 0 ? 300 : 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(0,170,255,${0.04 + i * 0.01}) 0%, transparent 70%)`,
            top: `${10 + i * 15}%`,
            left: `${i * 18}%`,
            pointerEvents: 'none',
            animation: `float${i % 3} ${6 + i}s ease-in-out infinite`,
          }} />
        ))}

        {/* Texto */}
        <div style={{ flex: '1 1 420px', maxWidth: 560, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(0,170,255,0.1)',
            border: '1px solid rgba(0,170,255,0.25)', borderRadius: 20,
            padding: '5px 14px', fontSize: 11, fontWeight: 600,
            color: '#33BBFF', letterSpacing: '.05em', marginBottom: 24
          }}>✦ CONTEÚDO INTELIGENTE PARA O MERCADO IMOBILIÁRIO</div>

          <h1 style={{
            fontSize: 'clamp(30px,4.5vw,58px)', fontWeight: 900,
            lineHeight: 1.1, marginBottom: 16, letterSpacing: '-1.5px'
          }}>
            Seu imóvel no{' '}
            <span style={{
              color: '#00AAFF', transition: 'opacity 0.3s',
              opacity: visivel ? 1 : 0, display: 'inline-block'
            }}>{palavras[palavra]}</span>
            <br />sem precisar de designer.
          </h1>

          <p style={{ fontSize: 17, color: '#8899BB', lineHeight: 1.7, marginBottom: 36 }}>
            Sobe as fotos do imóvel, a IA cria o carrossel com sua logo e publica
            automaticamente no Instagram e Facebook. Você só aprova.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
            {[
              { num: '10s', label: 'pra gerar um carrossel' },
              { num: '100%', label: 'com sua identidade' },
              { num: 'Zero', label: 'custo de designer' },
            ].map(st => (
              <div key={st.label}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#00AAFF' }}>{st.num}</div>
                <div style={{ fontSize: 11, color: '#4A5A7A', marginTop: 2 }}>{st.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#setup" style={{
              background: '#00AAFF', color: '#fff', fontSize: 14, fontWeight: 700,
              textDecoration: 'none', padding: '13px 28px', borderRadius: 9,
              boxShadow: '0 6px 24px rgba(0,170,255,0.4)',
            }}>Quero meu sistema agora →</a>
            <a href="#demo" style={{
              background: 'rgba(255,255,255,0.05)', color: '#F0F4FF', fontSize: 13,
              textDecoration: 'none', padding: '13px 24px', borderRadius: 9,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>Ver na prática ↓</a>
          </div>
        </div>

        {/* Carrossel animado */}
        <div style={{ flex: '0 0 auto', position: 'relative', zIndex: 1 }}>
          {/* Slide principal */}
          <div style={{
            width: 240, height: 300, borderRadius: 18, overflow: 'hidden',
            position: 'relative',
            backgroundImage: `url('${s.img}')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,170,255,0.15)',
            transition: 'background-image 0.5s ease',
          }}>
            {/* Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.15) 55%,transparent 100%)' }} />

            {/* Logo */}
            <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 24, height: 24, background: '#00AAFF', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>P</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>POSTPRO</span>
            </div>
            <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, color: 'rgba(255,255,255,.5)' }}>
              {slideAtivo + 1}/{slides.length}
            </div>

            {/* Conteúdo */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 18px' }}>
              <div style={{ fontSize: 9, color: '#33BBFF', fontWeight: 700, letterSpacing: '.08em', marginBottom: 5 }}>
                {s.tipo}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>
                {s.titulo}
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#00AAFF', marginBottom: 3 }}>
                {s.preco}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>
                {s.detalhe} · {s.local}
              </div>
            </div>
          </div>

          {/* Indicadores */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => setSlideAtivo(i)} style={{
                width: i === slideAtivo ? 20 : 6, height: 6,
                borderRadius: 3, cursor: 'pointer',
                background: i === slideAtivo ? '#00AAFF' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          {/* Botão publicar simulado */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={simularPublicacao} style={{
              background: publicado ? 'rgba(16,185,129,0.15)' : 'rgba(0,170,255,0.12)',
              border: `1px solid ${publicado ? 'rgba(16,185,129,0.3)' : 'rgba(0,170,255,0.25)'}`,
              color: publicado ? '#6EE7B7' : '#33BBFF',
              borderRadius: 8, padding: '8px 20px', fontSize: 12, fontWeight: 600,
              cursor: publicado ? 'default' : 'pointer',
              transition: 'all 0.3s',
            }}>
              {publicando ? '⏳ Publicando...' : publicado ? '✓ Publicado no Instagram!' : '↗ Publicar agora'}
            </button>
          </div>

          {/* Slides de fundo empilhados */}
          <div style={{
            position: 'absolute', top: 16, right: -24, width: 200, height: 250, zIndex: -1,
            borderRadius: 16, opacity: .5,
            backgroundImage: `url('${slides[(slideAtivo + 1) % slides.length].img}')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }} />
          <div style={{
            position: 'absolute', top: 32, right: -44, width: 180, height: 225, zIndex: -2,
            background: '#131C2E', borderRadius: 14, opacity: .3,
          }} />

          {/* Tag flutuante */}
          <div style={{
            position: 'absolute', top: -20, right: -30,
            background: '#131C2E', border: '1px solid rgba(0,170,255,0.2)',
            borderRadius: 10, padding: '8px 14px', fontSize: 11, color: '#33BBFF',
            fontWeight: 600, whiteSpace: 'nowrap',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'floatTag 3s ease-in-out infinite',
          }}>✦ IA gerando legenda...</div>
        </div>
      </section>

      {/* DEMO — imoveis passando */}
      <section id="demo" style={{ padding: '80px 0', background: '#0E1628', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 24px' }}>
          <div style={{ fontSize: 13, color: '#4A5A7A', fontWeight: 600, letterSpacing: '.08em', marginBottom: 12 }}>
            VEJA NA PRÁTICA
          </div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 800 }}>
            É assim que seus imóveis vão aparecer.
          </h2>
          <p style={{ fontSize: 14, color: '#8899BB', marginTop: 12 }}>
            Cada imóvel vira um carrossel profissional com sua logo. Automático.
          </p>
        </div>

        {/* 3 cards lado a lado */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', padding: '0 24px' }}>
          {slides.map((sl, i) => (
            <div key={i} style={{
              width: 220, height: 275, borderRadius: 16, overflow: 'hidden',
              position: 'relative', flexShrink: 0,
              backgroundImage: `url('${sl.img}')`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.1) 55%,transparent 100%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 22, height: 22, background: '#00AAFF', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>P</div>
                <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>POSTPRO</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 16px' }}>
                <div style={{ fontSize: 8, color: '#33BBFF', fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 }}>{sl.tipo}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{sl.titulo}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{sl.local}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOR */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, color: '#4A5A7A', fontWeight: 600, letterSpacing: '.08em', marginBottom: 12 }}>A REALIDADE DO MERCADO</div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2 }}>
            Você sabe que precisa postar.<br />
            <span style={{ color: '#4A5A7A' }}>Mas nunca sobra tempo.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16 }}>
          {[
            { icon: '⏰', titulo: 'Sem tempo', texto: 'Você passa o dia em visitas, negociações e burocracia. Criar post ficou pra depois — e "depois" nunca chega.' },
            { icon: '💸', titulo: 'Designer é caro', texto: 'R$ 800, R$ 1.500 por mês só pra ter carrossel no Instagram. Sem garantia de resultado.' },
            { icon: '📉', titulo: 'Concorrente aparece mais', texto: 'Enquanto você some das redes, o corretor ao lado posta todo dia e fica na cabeça do cliente na hora de comprar.' },
          ].map(d => (
            <div key={d.titulo} style={{ background: '#131C2E', border: '1px solid #1E2D47', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{d.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{d.titulo}</div>
              <div style={{ fontSize: 13, color: '#8899BB', lineHeight: 1.6 }}>{d.texto}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ padding: '80px 24px', background: '#0E1628' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#4A5A7A', fontWeight: 600, letterSpacing: '.08em', marginBottom: 12 }}>3 PASSOS</div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 800, marginBottom: 56 }}>
            Do imóvel ao Instagram em minutos.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
            {[
              { num: '01', titulo: 'Cadastra o imóvel', texto: 'Sobe as fotos, preço e diferenciais. Leva 2 minutos.' },
              { num: '02', titulo: 'IA cria o conteúdo', texto: 'Carrossel com sua logo + legenda gerada automaticamente.' },
              { num: '03', titulo: 'Aprova e publica', texto: 'Um clique. O sistema posta no horário certo pra você.' },
            ].map(p => (
              <div key={p.num} style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 52, fontWeight: 900, color: 'rgba(0,170,255,0.15)', lineHeight: 1, marginBottom: 12, letterSpacing: '-2px' }}>{p.num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.titulo}</div>
                <div style={{ fontSize: 13, color: '#8899BB', lineHeight: 1.6 }}>{p.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>
          Tudo que você precisa. Nada que não precisa.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
          {[
            { emoji: '🖼️', label: 'Carrossel com sua logo' },
            { emoji: '🤖', label: 'Legenda gerada por IA' },
            { emoji: '📅', label: 'Agendamento automático' },
            { emoji: '📷', label: 'Instagram + Facebook' },
            { emoji: '🏠', label: 'Gestão de imóveis' },
            { emoji: '📊', label: 'Relatórios simples' },
          ].map(f => (
            <div key={f.label} style={{
              background: '#131C2E', border: '1px solid #1E2D47', borderRadius: 12,
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
              transition: 'border-color .2s',
            }}>
              <span style={{ fontSize: 22 }}>{f.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="setup" style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg,rgba(0,170,255,0.12),rgba(0,170,255,0.04))',
          border: '1px solid rgba(0,170,255,0.25)', borderRadius: 20, padding: '56px 40px'
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, marginBottom: 14 }}>
            Comece com o setup completo
          </h2>
          <p style={{ fontSize: 14, color: '#8899BB', lineHeight: 1.7, marginBottom: 32 }}>
            Configuramos o sistema com a sua logo, conectamos suas redes sociais
            e entregamos pronto pra usar.
          </p>
          <div style={{
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '20px 24px', marginBottom: 28, textAlign: 'left'
          }}>
            <div style={{ fontSize: 11, color: '#4A5A7A', fontWeight: 600, letterSpacing: '.06em', marginBottom: 12 }}>O QUE VEM NO SETUP</div>
            {[
              'Sistema configurado com sua logo e identidade visual',
              'Instagram e Facebook conectados e prontos',
              'Primeiro carrossel criado pra você ver funcionando',
              'Suporte na primeira semana de uso',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <span style={{ color: '#00AAFF', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: '#8899BB' }}>{item}</span>
              </div>
            ))}
          </div>
          <a href="/cadastro" style={{
            display: 'block', background: '#00AAFF', color: '#fff',
            fontSize: 15, fontWeight: 700, textDecoration: 'none',
            padding: '16px 32px', borderRadius: 10,
            boxShadow: '0 6px 24px rgba(0,170,255,0.4)',
          }}>Quero meu setup →</a>
          <div style={{ fontSize: 11, color: '#4A5A7A', marginTop: 14 }}>
            Entre em contato após o cadastro pra agendar
          </div>
        </div>
      </section>

      {/* WHATSAPP FLOAT */}
      <a
        href="https://wa.me/5547996958399?text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Postpro%20e%20contratar%20o%20setup."
        target="_blank" rel="noreferrer"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 100,
          width: 56, height: 56, borderRadius: '50%',
          background: '#25D366', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
          textDecoration: 'none', fontSize: 26,
          transition: 'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)'
          ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 28px rgba(37,211,102,0.7)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'
          ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.5)'
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #1E2D47', padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <Image src="/logo.png" alt="Postpro" width={100} height={30} style={{ objectFit: 'contain' }} />
        <div style={{ fontSize: 12, color: '#4A5A7A' }}>Conteúdo inteligente para quem vende imóveis</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="/login" style={{ fontSize: 12, color: '#4A5A7A', textDecoration: 'none' }}>Entrar</a>
          <a href="/cadastro" style={{ fontSize: 12, color: '#4A5A7A', textDecoration: 'none' }}>Cadastrar</a>
        </div>
      </footer>

      <style>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
        @keyframes scrollRight {
          from { transform: translateX(-33.33%); }
          to   { transform: translateX(0); }
        }
        @keyframes floatTag {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
      `}</style>
    </div>
  )
}
