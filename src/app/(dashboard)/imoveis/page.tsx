'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'

type Foto = { url: string; is_capa: boolean }
type Imovel = {
  id: string; titulo: string; tipo: string; status: string
  preco: number; area: number; localizacao: string; diferenciais: string
  fotos: Foto[]; created_at: string
}

const statusColor: Record<string, string> = {
  ativo: '#6EE7B7', lancamento: '#FCD34D', locacao: '#93C5FD', vendido: '#94A3B8'
}

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [erroForm, setErroForm] = useState('')
  const [uploading, setUploading] = useState(false)
  const [fotos, setFotos] = useState<Foto[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    titulo: '', tipo: 'Apartamento', status: 'ativo',
    preco: '', area: '', localizacao: '', diferenciais: ''
  })

  async function load() {
    const sb = createClient()
    const { data } = await sb.from('imoveis').select('*').order('created_at', { ascending: false })
    setImoveis(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function uploadFotos(files: FileList) {
    if (fotos.length + files.length > 5) {
      alert('Máximo de 5 fotos por imóvel.')
      return
    }
    setUploading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    const novas: Foto[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${user?.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await sb.storage.from('imoveis').upload(path, file)
      if (!error) {
        const { data: { publicUrl } } = sb.storage.from('imoveis').getPublicUrl(path)
        novas.push({ url: publicUrl, is_capa: fotos.length === 0 && novas.length === 0 })
      }
    }
    setFotos(prev => [...prev, ...novas])
    setUploading(false)
  }

  function definirCapa(idx: number) {
    setFotos(prev => prev.map((f, i) => ({ ...f, is_capa: i === idx })))
  }

  function removerFoto(idx: number) {
    setFotos(prev => {
      const novo = prev.filter((_, i) => i !== idx)
      if (novo.length > 0 && !novo.some(f => f.is_capa)) novo[0].is_capa = true
      return novo
    })
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setErroForm('')
    if (!form.titulo.trim()) { setErroForm('O título do imóvel é obrigatório.'); return }
    if (form.preco && isNaN(Number(form.preco))) { setErroForm('Preço deve ser um número válido.'); return }
    if (form.area && isNaN(Number(form.area))) { setErroForm('Área deve ser um número válido.'); return }
    if (fotos.length === 0) { setErroForm('Adicione pelo menos 1 foto para o carrossel.'); return }

    setSaving(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    await sb.from('imoveis').insert({
      ...form, preco: form.preco ? Number(form.preco) : null,
      area: form.area ? Number(form.area) : null,
      user_id: user?.id, fotos,
    })
    setSaving(false)
    setModal(false)
    setFotos([])
    setErroForm('')
    setForm({ titulo: '', tipo: 'Apartamento', status: 'ativo', preco: '', area: '', localizacao: '', diferenciais: '' })
    load()
  }

  async function excluir(id: string) {
    await createClient().from('imoveis').delete().eq('id', id)
    load()
  }

  const capa = (im: Imovel) => im.fotos?.find(f => f.is_capa)?.url || im.fotos?.[0]?.url

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Imóveis</div>
          <div style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 2 }}>{imoveis.length} cadastrados</div>
        </div>
        <button onClick={() => setModal(true)} style={{
          background: 'var(--accent)', color: '#fff', border: 'none',
          borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>+ Novo imóvel</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--txt3)', fontSize: 13 }}>Carregando...</div>
      ) : imoveis.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--txt3)', border: '2px dashed var(--border)', borderRadius: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏠</div>
          <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--txt2)' }}>Nenhum imóvel ainda</div>
          <button onClick={() => setModal(true)} style={{
            marginTop: 12, background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, cursor: 'pointer'
          }}>Cadastrar agora</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
          {imoveis.map(im => (
            <div key={im.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Foto capa */}
              <div style={{ height: 130, background: 'linear-gradient(135deg,#1A3A6C,#0F2040)', position: 'relative', overflow: 'hidden' }}>
                {capa(im) ? (
                  <img src={capa(im)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 36, opacity: .4 }}>🏠</div>
                )}
                <span style={{
                  position: 'absolute', top: 8, right: 8, fontSize: 9,
                  padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                  background: 'rgba(0,0,0,0.5)', color: statusColor[im.status] || '#fff'
                }}>{im.status}</span>
                {im.fotos?.length > 0 && (
                  <span style={{
                    position: 'absolute', bottom: 8, left: 8, fontSize: 9,
                    padding: '2px 7px', borderRadius: 5,
                    background: 'rgba(0,0,0,0.5)', color: '#fff'
                  }}>📷 {im.fotos.length} foto{im.fotos.length > 1 ? 's' : ''}</span>
                )}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent2)' }}>
                  {im.preco ? `R$ ${Number(im.preco).toLocaleString('pt-BR')}` : '—'}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, marginTop: 3 }}>{im.titulo}</div>
                <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 2 }}>
                  {im.area ? `${im.area} m²` : ''}{im.area && im.localizacao ? ' · ' : ''}{im.localizacao}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <a href="/criar" style={{
                    flex: 1, textAlign: 'center', background: 'var(--accent-dim)',
                    color: 'var(--accent2)', border: '1px solid rgba(0,170,255,0.2)',
                    borderRadius: 6, padding: '5px 0', fontSize: 11, textDecoration: 'none'
                  }}>✦ Criar carrossel</a>
                  <button onClick={() => excluir(im.id)} style={{
                    background: 'rgba(239,68,68,0.1)', color: '#FCA5A5',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6,
                    padding: '5px 8px', fontSize: 11, cursor: 'pointer'
                  }}>✕</button>
                </div>
              </div>
            </div>
          ))}

          <div onClick={() => setModal(true)} style={{
            background: 'var(--bg2)', border: '2px dashed var(--border)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8, color: 'var(--txt3)', fontSize: 12,
            cursor: 'pointer', minHeight: 200,
          }}>
            <span style={{ fontSize: 24 }}>+</span>Cadastrar imóvel
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
          overflowY: 'auto', padding: '20px 0'
        }} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 24, width: 500, maxWidth: '94vw'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Cadastrar imóvel</div>
              <button onClick={() => { setModal(false); setFotos([]) }} style={{
                background: 'var(--hover)', border: 'none', color: 'var(--txt2)',
                borderRadius: 6, width: 26, height: 26, cursor: 'pointer'
              }}>✕</button>
            </div>

            <form onSubmit={salvar}>
              {/* Upload de fotos */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt2)', marginBottom: 8 }}>
                  Fotos do imóvel <span style={{ color: 'var(--txt3)', fontWeight: 400 }}>(máx. 5 · clique em uma para definir como capa)</span>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {fotos.map((f, i) => (
                    <div key={i} style={{
                      width: 72, height: 72, borderRadius: 8, overflow: 'hidden', position: 'relative',
                      border: f.is_capa ? '2px solid var(--accent)' : '2px solid var(--border)', cursor: 'pointer',
                      flexShrink: 0,
                    }} onClick={() => definirCapa(i)}>
                      <img src={f.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {f.is_capa && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'rgba(0,170,255,0.85)', fontSize: 8,
                          fontWeight: 700, color: '#fff', textAlign: 'center', padding: '2px 0'
                        }}>CAPA</div>
                      )}
                      <button onClick={e => { e.stopPropagation(); removerFoto(i) }} style={{
                        position: 'absolute', top: 2, right: 2, width: 16, height: 16,
                        background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                        color: '#fff', fontSize: 9, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>✕</button>
                    </div>
                  ))}

                  {fotos.length < 5 && (
                    <div onClick={() => fileRef.current?.click()} style={{
                      width: 72, height: 72, borderRadius: 8, border: '2px dashed var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexDirection: 'column', gap: 2,
                      color: 'var(--txt3)', fontSize: 10,
                    }}>
                      {uploading ? '⏳' : <><span style={{ fontSize: 20 }}>+</span><span>Foto</span></>}
                    </div>
                  )}
                </div>

                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => e.target.files && uploadFotos(e.target.files)} />
              </div>

              {[
                { label: 'Título', key: 'titulo', placeholder: 'Ex: Apartamento 2 quartos – Pinheiros', type: 'text' },
                { label: 'Preço (R$)', key: 'preco', placeholder: '850000', type: 'number' },
                { label: 'Área (m²)', key: 'area', placeholder: '120', type: 'number' },
                { label: 'Localização', key: 'localizacao', placeholder: 'Bairro, Cidade', type: 'text' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    required={f.key === 'titulo'}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 11px', color: 'var(--txt)', fontSize: 12, outline: 'none' }} />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                {[
                  { label: 'Tipo', key: 'tipo', options: ['Apartamento','Casa','Cobertura','Terreno','Comercial'] },
                  { label: 'Status', key: 'status', options: ['ativo','lancamento','locacao','vendido'] },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>{f.label}</label>
                    <select value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 11px', color: 'var(--txt)', fontSize: 12, outline: 'none' }}>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>
                  Diferenciais <span style={{ color: 'var(--txt3)', fontWeight: 400 }}>(a IA usa pra gerar o conteúdo)</span>
                </label>
                <textarea placeholder="Ex: varanda gourmet, vista panorâmica, próximo ao metrô..."
                  value={form.diferenciais}
                  onChange={e => setForm(p => ({ ...p, diferenciais: e.target.value }))}
                  rows={2}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 11px', color: 'var(--txt)', fontSize: 12, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              {erroForm && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#FCA5A5', marginBottom: 12
                }}>{erroForm}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => { setModal(false); setFotos([]); setErroForm('') }} style={{
                  background: 'transparent', color: 'var(--txt2)', border: '1px solid var(--border)',
                  borderRadius: 7, padding: '7px 14px', fontSize: 12, cursor: 'pointer'
                }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{
                  background: 'var(--accent)', color: '#fff', border: 'none',
                  borderRadius: 7, padding: '7px 16px', fontSize: 12, fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
                }}>{saving ? 'Salvando...' : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
