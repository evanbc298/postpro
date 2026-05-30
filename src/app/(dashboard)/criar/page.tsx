'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Foto = { url: string; is_capa: boolean }
type Imovel = { id: string; titulo: string; tipo: string; preco: number; area: number; localizacao: string; diferenciais: string; fotos: Foto[] }
type Config = { logo_url: string; tom_legenda: string; instagram_usuario: string }

const tons = [
  { value: 'direto', label: 'Direto' },
  { value: 'aspiracional', label: 'Aspiracional' },
  { value: 'informativo', label: 'Informativo' },
]

const focos = ['Destaque visual', 'Localização', 'Preço e financiamento', 'Diferenciais', 'Estilo de vida']

export default function CriarPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [imovelId, setImovelId] = useState('')
  const [foco, setFoco] = useState('Destaque visual')
  const [tom, setTom] = useState('direto')
  const [plataformas, setPlataformas] = useState(['instagram', 'facebook'])
  const [data, setData] = useState('')
  const [hora, setHora] = useState('18:00')
  const [legenda, setLegenda] = useState('')
  const [gerando, setGerando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [config, setConfig] = useState<Config | null>(null)
  const [slideAtivo, setSlideAtivo] = useState(0)

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      const [{ data: ims }, { data: cfg }] = await Promise.all([
        sb.from('imoveis').select('*').order('created_at', { ascending: false }),
        sb.from('config_cliente').select('*').eq('user_id', user?.id).single(),
      ])
      setImoveis(ims || [])
      if (ims?.[0]) setImovelId(ims[0].id)
      if (cfg) setConfig(cfg)
      if (cfg?.tom_legenda) setTom(cfg.tom_legenda)
    }
    load()
  }, [])

  const imovel = imoveis.find(i => i.id === imovelId)
  const fotos = imovel?.fotos || []
  const capa = fotos.find(f => f.is_capa) || fotos[0]

  // Gera os slides com base nas fotos disponíveis
  const slides = imovel ? [
    { label: 'Capa', foto: capa?.url, texto: imovel.titulo, subtexto: imovel.preco ? `R$ ${Number(imovel.preco).toLocaleString('pt-BR')}` : '', detalhe: imovel.area ? `${imovel.area} m² · ${imovel.localizacao}` : imovel.localizacao },
    { label: 'Detalhe', foto: fotos[1]?.url || fotos[0]?.url, texto: imovel.diferenciais?.split(',')[0]?.trim() || 'Ambientes espaçosos', subtexto: '', detalhe: imovel.tipo },
    { label: 'Diferencial', foto: fotos[2]?.url || fotos[0]?.url, texto: imovel.diferenciais?.split(',')[1]?.trim() || 'Localização privilegiada', subtexto: '', detalhe: '' },
    { label: 'Localização', foto: fotos[3]?.url || fotos[0]?.url, texto: imovel.localizacao || 'Localização', subtexto: '', detalhe: 'Infraestrutura completa ao redor' },
    { label: 'CTA', foto: null, texto: config?.instagram_usuario || '@seu.perfil', subtexto: 'Fale comigo', detalhe: '' },
  ] : []

  async function gerar() {
    if (!imovel) return
    setGerando(true)
    setLegenda('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imovel, tipo: 'Carrossel', foco, tom })
      })
      const json = await res.json()
      setLegenda(json.legenda || 'Erro ao gerar. Verifique a chave OpenAI.')
    } catch {
      setLegenda('Erro ao conectar com a IA.')
    }
    setGerando(false)
  }

  async function salvar(status: 'rascunho' | 'agendado') {
    if (!imovel || !legenda) return
    setSalvando(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    const agendado = status === 'agendado' && data ? new Date(`${data}T${hora}`).toISOString() : null
    await sb.from('posts').insert({
      user_id: user?.id, imovel_id: imovelId,
      titulo: `Carrossel – ${imovel.titulo}`,
      legenda, tipo: 'carrossel', plataformas, status,
      agendado_para: agendado,
    })
    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  function togglePlat(p: string) {
    setPlataformas(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const btn = (active: boolean) => ({
    padding: '5px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer' as const,
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent2)' : 'var(--txt2)', transition: 'all .15s',
  })

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Criar carrossel</div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16 }}>

        {/* Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Imóvel</div>
            {imoveis.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--txt3)' }}>
                Nenhum imóvel. <a href="/imoveis" style={{ color: 'var(--accent2)' }}>Cadastrar →</a>
              </div>
            ) : (
              <select value={imovelId} onChange={e => { setImovelId(e.target.value); setSlideAtivo(0) }} style={{
                width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 7, padding: '8px 11px', color: 'var(--txt)', fontSize: 12, outline: 'none'
              }}>
                {imoveis.map(im => <option key={im.id} value={im.id}>{im.titulo}</option>)}
              </select>
            )}
            {imovel && (
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, color: 'var(--txt3)' }}>
                  📷 {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
                  {fotos.length === 0 && <span style={{ color: 'var(--yellow)', marginLeft: 4 }}>— adicione fotos ao imóvel</span>}
                </span>
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Plataformas</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['instagram','facebook'].map(p => (
                <button key={p} onClick={() => togglePlat(p)} style={btn(plataformas.includes(p))}>
                  {p === 'instagram' ? '📷 Instagram' : '📘 Facebook'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Foco e tom</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--txt2)', marginBottom: 5 }}>Foco</div>
              <select value={foco} onChange={e => setFoco(e.target.value)} style={{
                width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 7, padding: '8px 11px', color: 'var(--txt)', fontSize: 12, outline: 'none'
              }}>
                {focos.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt2)', marginBottom: 5 }}>Tom</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {tons.map(t => <button key={t.value} onClick={() => setTom(t.value)} style={btn(tom === t.value)}>{t.label}</button>)}
            </div>
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Legenda</div>
            <textarea value={gerando ? 'Gerando...' : legenda} onChange={e => setLegenda(e.target.value)}
              disabled={gerando} rows={4} placeholder='Clique em "Gerar com IA" para criar automaticamente...'
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 11px', color: 'var(--txt)', fontSize: 12, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
            <button onClick={gerar} disabled={gerando || !imovelId} style={{
              marginTop: 8, width: '100%', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 7, padding: 9, fontSize: 12, fontWeight: 600,
              cursor: gerando || !imovelId ? 'not-allowed' : 'pointer', opacity: gerando || !imovelId ? 0.7 : 1
            }}>
              {gerando ? '✦ Gerando...' : '✦ Gerar legenda com IA'}
            </button>
          </div>

          {/* Agendar */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Agendar</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--txt2)', marginBottom: 5 }}>Data</div>
                <input type="date" value={data} onChange={e => setData(e.target.value)} style={{
                  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 7, padding: '7px 10px', color: 'var(--txt)', fontSize: 11, outline: 'none'
                }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--txt2)', marginBottom: 5 }}>Horário</div>
                <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{
                  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 7, padding: '7px 10px', color: 'var(--txt)', fontSize: 11, outline: 'none'
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => salvar('rascunho')} disabled={!legenda || salvando} style={{
                flex: 1, background: 'transparent', color: 'var(--txt2)',
                border: '1px solid var(--border)', borderRadius: 7, padding: 8,
                fontSize: 11, cursor: !legenda || salvando ? 'not-allowed' : 'pointer', opacity: !legenda ? 0.5 : 1
              }}>Salvar rascunho</button>
              <button onClick={() => salvar('agendado')} disabled={!legenda || !data || salvando} style={{
                flex: 1, background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: 7, padding: 8, fontSize: 11, fontWeight: 600,
                cursor: !legenda || !data || salvando ? 'not-allowed' : 'pointer',
                opacity: !legenda || !data ? 0.5 : 1
              }}>📅 Agendar</button>
            </div>
            {salvo && <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--green)', marginTop: 8 }}>✓ Salvo com sucesso</div>}
          </div>
        </div>

        {/* Preview carrossel — Template Elegante */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'var(--txt2)' }}>
            Prévia — Modelo Elegante
            <span style={{ fontSize: 10, color: 'var(--txt3)', marginLeft: 8 }}>Clique nos slides para navegar</span>
          </div>

          {/* Slide principal */}
          {imovel && slides.length > 0 ? (
            <>
              <div style={{
                width: '100%', maxWidth: 320, margin: '0 auto',
                aspectRatio: '4/5', borderRadius: 14, overflow: 'hidden',
                position: 'relative', background: '#0B1120',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                {/* Foto de fundo */}
                {slides[slideAtivo].foto ? (
                  <img src={slides[slideAtivo].foto} alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0B1120,#131C2E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Slide CTA */}
                    <div style={{ textAlign: 'center', padding: 30 }}>
                      {config?.logo_url ? (
                        <img src={config.logo_url} alt="Logo" style={{ width: 100, height: 60, objectFit: 'contain', marginBottom: 16 }} />
                      ) : (
                        <div style={{ width: 64, height: 64, background: 'var(--accent)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 auto 16px' }}>P</div>
                      )}
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                        {slides[slideAtivo].subtexto}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--accent2)', marginBottom: 14 }}>
                        {slides[slideAtivo].texto}
                      </div>
                      <div style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 20px', borderRadius: 20 }}>
                        Entre em contato →
                      </div>
                    </div>
                  </div>
                )}

                {/* Gradiente overlay */}
                {slides[slideAtivo].foto && (
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.3) 50%, rgba(0,0,0,.1) 100%)' }} />
                )}

                {/* Logo no topo (slides com foto) */}
                {slides[slideAtivo].foto && (
                  <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {config?.logo_url ? (
                      <img src={config.logo_url} alt="Logo" style={{ height: 28, maxWidth: 90, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                    ) : (
                      <>
                        <div style={{ width: 26, height: 26, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>P</div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>POSTPRO</span>
                      </>
                    )}
                  </div>
                )}

                {/* Número do slide */}
                {slides[slideAtivo].foto && (
                  <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, color: 'rgba(255,255,255,.6)' }}>
                    {slideAtivo + 1}/{slides.length}
                  </div>
                )}

                {/* Conteúdo de texto (slides com foto) */}
                {slides[slideAtivo].foto && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 20px' }}>
                    {slideAtivo === 0 && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent2)', marginBottom: 8, letterSpacing: '.05em' }}>
                        {imovel.tipo?.toUpperCase()}
                      </div>
                    )}
                    {slideAtivo > 0 && slides[slideAtivo].label && (
                      <div style={{
                        display: 'inline-block', background: 'rgba(0,170,255,0.25)',
                        color: '#33BBFF', fontSize: 10, padding: '3px 10px',
                        borderRadius: 4, border: '1px solid rgba(0,170,255,0.4)', marginBottom: 8
                      }}>
                        {slides[slideAtivo].label}
                      </div>
                    )}
                    <div style={{ fontSize: slideAtivo === 0 ? 18 : 15, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: slideAtivo === 0 ? 6 : 4 }}>
                      {slides[slideAtivo].texto}
                    </div>
                    {slideAtivo === 0 && slides[slideAtivo].subtexto && (
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent2)', marginBottom: 4 }}>
                        {slides[slideAtivo].subtexto}
                      </div>
                    )}
                    {slides[slideAtivo].detalhe && (
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)' }}>
                        {slides[slideAtivo].detalhe}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
                {slides.map((s, i) => (
                  <div key={i} onClick={() => setSlideAtivo(i)} style={{
                    width: 48, height: 60, borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                    border: `2px solid ${slideAtivo === i ? 'var(--accent)' : 'var(--border)'}`,
                    background: '#0B1120', position: 'relative', flexShrink: 0,
                    transition: 'border-color .15s',
                  }}>
                    {s.foto
                      ? <img src={s.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                          {config?.logo_url ? <img src={config.logo_url} alt="" style={{ width: '80%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} /> : 'P'}
                        </div>
                    }
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,.6)', fontSize: 7, color: '#fff', textAlign: 'center', padding: '1px 0' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {fotos.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--yellow)' }}>
                  ⚠ Adicione fotos ao imóvel para ver o carrossel com as imagens reais
                </div>
              )}
            </>
          ) : (
            <div style={{
              width: '100%', maxWidth: 320, margin: '0 auto', aspectRatio: '4/5',
              borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              gap: 8, color: 'var(--txt3)', fontSize: 12
            }}>
              <span style={{ fontSize: 28 }}>🏠</span>
              Selecione um imóvel para ver a prévia
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
