'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const palavras = ['Instagram', 'Facebook', 'Redes Sociais']

export default function LandingPage() {
  const [palavra, setPalavra] = useState(0)
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisivel(false)
      setTimeout(() => {
        setPalavra(p => (p + 1) % palavras.length)
        setVisivel(true)
      }, 400)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: '#0B1120', color: '#F0F4FF', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px', background: 'rgba(11,17,32,0.85)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <Image src="/logo.png" alt="Postpro" width={120} height={38} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/login" style={{
            color: '#8899BB', fontSize: 13, textDecoration: 'none',
            padding: '7px 16px', borderRadius: 7, transition: 'color .15s'
          }}>Entrar</a>
          <a href="#setup" style={{
            background: '#00AAFF', color: '#fff', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', padding: '8px 20px', borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,170,255,0.35)', transition: 'transform .15s'
          }}>Quero o setup →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow de fundo */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,170,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-block', background: 'rgba(0,170,255,0.1)',
          border: '1px solid rgba(0,170,255,0.25)', borderRadius: 20,
          padding: '5px 14px', fontSize: 11, fontWeight: 600,
          color: '#33BBFF', letterSpacing: '.05em', marginBottom: 24
        }}>
          ✦ CONTEÚDO INTELIGENTE PARA O MERCADO IMOBILIÁRIO
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 62px)', fontWeight: 900,
          lineHeight: 1.1, marginBottom: 12, maxWidth: 800,
          letterSpacing: '-1.5px'
        }}>
          Seu imóvel no{' '}
          <span style={{
            color: '#00AAFF',
            transition: 'opacity 0.3s',
            opacity: visivel ? 1 : 0,
            display: 'inline-block',
          }}>
            {palavras[palavra]}
          </span>
          <br />sem precisar de designer.
        </h1>

        <p style={{
          fontSize: 18, color: '#8899BB', maxWidth: 520,
          lineHeight: 1.7, marginBottom: 40
        }}>
          O Postpro pega as fotos do seu imóvel, gera o carrossel com sua logo,
          escreve a legenda com IA e publica automaticamente. Você só aprova.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#setup" style={{
            background: '#00AAFF', color: '#fff', fontSize: 15, fontWeight: 700,
            textDecoration: 'none', padding: '14px 32px', borderRadius: 10,
            boxShadow: '0 6px 24px rgba(0,170,255,0.4)',
          }}>Quero meu sistema agora →</a>
          <a href="#como-funciona" style={{
            background: 'rgba(255,255,255,0.05)', color: '#F0F4FF', fontSize: 14,
            textDecoration: 'none', padding: '14px 28px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>Ver como funciona</a>
        </div>

        {/* Mock carrossel animado */}
        <div style={{ marginTop: 64, position: 'relative', maxWidth: 340 }}>
          <div style={{
            width: 220, height: 275, borderRadius: 16, overflow: 'hidden',
            background: 'linear-gradient(160deg,#1A3A6C,#0B1120)',
            border: '1px solid rgba(0,170,255,0.2)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            position: 'relative', margin: '0 auto'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.2) 60%, transparent 100%)'
            }} />
            <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 22, height: 22, background: '#00AAFF', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>P</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>POSTPRO</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 16px' }}>
              <div style={{ fontSize: 9, color: '#33BBFF', marginBottom: 5, fontWeight: 700, letterSpacing: '.06em' }}>APARTAMENTO</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Apto 3 quartos — Moema</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#00AAFF' }}>R$ 850.000</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>120 m² · São Paulo</div>
            </div>
          </div>

          {/* Slides empilhados */}
          <div style={{
            position: 'absolute', top: 12, right: -20, width: 180, height: 225,
            background: 'linear-gradient(160deg,#1A4040,#0B1120)',
            borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.4)', zIndex: -1
          }} />
          <div style={{
            position: 'absolute', top: 24, right: -36, width: 160, height: 200,
            background: '#131C2E', borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.04)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)', zIndex: -2
          }} />

          <div style={{
            position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,170,255,0.15)', border: '1px solid rgba(0,170,255,0.3)',
            borderRadius: 8, padding: '5px 14px', fontSize: 11, color: '#33BBFF', fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>✦ Gerado com IA em 10 segundos</div>
        </div>
      </section>

      {/* DOR */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 13, color: '#4A5A7A', fontWeight: 600, letterSpacing: '.08em', marginBottom: 12 }}>A REALIDADE DO MERCADO</div>
          <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, lineHeight: 1.2 }}>
            Você sabe que precisa postar.<br />
            <span style={{ color: '#4A5A7A' }}>Mas nunca sobra tempo.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {[
            { icon: '⏰', titulo: 'Sem tempo', texto: 'Você passa o dia em visitas, negociações e burocracia. Criar post ficou pra depois — e "depois" nunca chega.' },
            { icon: '💸', titulo: 'Designer é caro', texto: 'R$ 800, R$ 1.500 por mês só pra ter carrossel no Instagram. Sem garantia de resultado, sem exclusividade.' },
            { icon: '📉', titulo: 'Concorrente aparece mais', texto: 'Enquanto você some das redes, o corretor da frente posta todo dia e fica na cabeça do cliente na hora de comprar.' },
          ].map(d => (
            <div key={d.titulo} style={{
              background: '#131C2E', border: '1px solid #1E2D47',
              borderRadius: 14, padding: 24,
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{d.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{d.titulo}</div>
              <div style={{ fontSize: 13, color: '#8899BB', lineHeight: 1.6 }}>{d.texto}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '80px 24px', background: '#0E1628' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#4A5A7A', fontWeight: 600, letterSpacing: '.08em', marginBottom: 12 }}>SIMPLES ASSIM</div>
          <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, marginBottom: 56 }}>
            3 passos. Do imóvel ao Instagram.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
            {[
              { num: '01', titulo: 'Cadastra o imóvel', texto: 'Sobe as fotos, o preço e os diferenciais. Leva 2 minutos.' },
              { num: '02', titulo: 'IA cria o conteúdo', texto: 'O Postpro monta o carrossel com sua logo e escreve a legenda automaticamente.' },
              { num: '03', titulo: 'Aprova e publica', texto: 'Você vê, aprova e o sistema publica no horário que você escolher. Sem mais trabalho.' },
            ].map(p => (
              <div key={p.num} style={{ textAlign: 'left', position: 'relative' }}>
                <div style={{
                  fontSize: 48, fontWeight: 900, color: 'rgba(0,170,255,0.15)',
                  lineHeight: 1, marginBottom: 12, letterSpacing: '-2px'
                }}>{p.num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.titulo}</div>
                <div style={{ fontSize: 13, color: '#8899BB', lineHeight: 1.6 }}>{p.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800 }}>
            Tudo que você precisa. Nada que não precisa.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
          {[
            { emoji: '🖼️', label: 'Carrossel com sua logo' },
            { emoji: '🤖', label: 'Legenda gerada por IA' },
            { emoji: '📅', label: 'Agendamento automático' },
            { emoji: '📷', label: 'Instagram + Facebook' },
            { emoji: '🏠', label: 'Gestão de imóveis' },
            { emoji: '📊', label: 'Relatório simples' },
          ].map(f => (
            <div key={f.label} style={{
              background: '#131C2E', border: '1px solid #1E2D47', borderRadius: 12,
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12
            }}>
              <span style={{ fontSize: 22 }}>{f.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / SETUP */}
      <section id="setup" style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg,rgba(0,170,255,0.12),rgba(0,170,255,0.04))',
          border: '1px solid rgba(0,170,255,0.25)', borderRadius: 20, padding: '56px 40px'
        }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, marginBottom: 14 }}>
            Comece hoje com o setup completo
          </h2>
          <p style={{ fontSize: 14, color: '#8899BB', lineHeight: 1.7, marginBottom: 32 }}>
            A gente configura o sistema com a sua logo, conecta suas redes sociais
            e te entrega pronto pra usar. Você só precisa cadastrar os imóveis e aprovar os posts.
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '20px 24px', marginBottom: 28, textAlign: 'left'
          }}>
            <div style={{ fontSize: 11, color: '#4A5A7A', fontWeight: 600, letterSpacing: '.06em', marginBottom: 12 }}>O QUE VEM NO SETUP</div>
            {[
              'Sistema configurado com sua logo e identidade visual',
              'Contas do Instagram e Facebook conectadas',
              'Primeiro carrossel criado pra você ver funcionando',
              'Suporte direto pra dúvidas na primeira semana',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ color: '#00AAFF', flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: '#8899BB' }}>{item}</span>
              </div>
            ))}
          </div>

          <a href="/cadastro" style={{
            display: 'block', background: '#00AAFF', color: '#fff',
            fontSize: 15, fontWeight: 700, textDecoration: 'none',
            padding: '16px 32px', borderRadius: 10,
            boxShadow: '0 6px 24px rgba(0,170,255,0.4)',
          }}>
            Quero meu setup →
          </a>
          <div style={{ fontSize: 11, color: '#4A5A7A', marginTop: 14 }}>
            Entre em contato após o cadastro pra agendar o setup
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #1E2D47', padding: '32px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12
      }}>
        <Image src="/logo.png" alt="Postpro" width={100} height={32} style={{ objectFit: 'contain' }} />
        <div style={{ fontSize: 12, color: '#4A5A7A' }}>
          Conteúdo inteligente para quem vende imóveis
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <a href="/login" style={{ color: '#4A5A7A', textDecoration: 'none' }}>Entrar</a>
          <a href="/cadastro" style={{ color: '#4A5A7A', textDecoration: 'none' }}>Cadastrar</a>
        </div>
      </footer>

    </div>
  )
}
