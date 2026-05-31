'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ConfigPage() {
  const [uploadPostKey, setUploadPostKey] = useState('')
  const [uploadPostProfile, setUploadPostProfile] = useState('')
  const [instagramUsuario, setInstagramUsuario] = useState('')
  const [facebookPagina, setFacebookPagina] = useState('')
  const [tom, setTom] = useState('direto')
  const [hashtags, setHashtags] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      const { data } = await sb.from('config_cliente').select('*').eq('user_id', user.id).single()
      if (data) {
        setUploadPostKey(data.upload_post_key || '')
        setUploadPostProfile(data.upload_post_profile || '')
        setInstagramUsuario(data.instagram_usuario || '')
        setFacebookPagina(data.facebook_pagina || '')
        setTom(data.tom_legenda || 'direto')
        setHashtags(data.hashtags || '')
        setLogoUrl(data.logo_url || '')
      }
    }
    load()
  }, [])

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    await sb.from('config_cliente').upsert({
      user_id: user?.id,
      upload_post_key: uploadPostKey,
      upload_post_profile: uploadPostProfile,
      instagram_usuario: instagramUsuario,
      facebook_pagina: facebookPagina,
      tom_legenda: tom,
      hashtags,
      logo_url: logoUrl,
    }, { onConflict: 'user_id' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function uploadLogo(file: File) {
    setUploadingLogo(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    const ext = file.name.split('.').pop()
    const path = `${user?.id}/logo.${ext}`
    await sb.storage.from('logos').upload(path, file, { upsert: true })
    const { data: { publicUrl } } = sb.storage.from('logos').getPublicUrl(path)
    setLogoUrl(publicUrl)
    setUploadingLogo(false)
  }

  const card = (children: React.ReactNode) => (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 12, padding: 20, marginBottom: 14
    }}>{children}</div>
  )

  const label = (text: string, sub?: string) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{text}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )

  const input = (value: string, setter: (v: string) => void, placeholder: string, type = 'text') => (
    <input
      type={type}
      value={value}
      onChange={e => setter(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 7, padding: '9px 12px', color: 'var(--txt)', fontSize: 13,
        outline: 'none', fontFamily: 'inherit'
      }}
    />
  )

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Configurações</div>

      <form onSubmit={salvar}>
        {card(<>
          {label('Sua logo', 'Aparece em todos os slides do carrossel. Use PNG com fundo transparente.')}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div onClick={() => logoRef.current?.click()} style={{
              width: 80, height: 80, borderRadius: 10, border: '2px dashed var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', overflow: 'hidden', flexShrink: 0, background: 'var(--bg)',
            }}>
              {logoUrl
                ? <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                : <span style={{ fontSize: 11, color: 'var(--txt3)', textAlign: 'center', lineHeight: 1.4 }}>
                    {uploadingLogo ? '⏳' : '+ Logo'}
                  </span>
              }
            </div>
            <div>
              <button onClick={() => logoRef.current?.click()} style={{
                background: 'var(--accent-dim)', color: 'var(--accent2)',
                border: '1px solid rgba(0,170,255,0.2)', borderRadius: 7,
                padding: '7px 14px', fontSize: 12, cursor: 'pointer', display: 'block', marginBottom: 6
              }}>
                {logoUrl ? 'Trocar logo' : 'Enviar logo'}
              </button>
              <div style={{ fontSize: 10, color: 'var(--txt3)' }}>PNG ou SVG · fundo transparente · recomendado</div>
            </div>
          </div>
          <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
        </>)}

        {card(<>
          {label('Upload-Post — publicação automática',
            'Cole aqui a API key da sua conta no upload-post.com. Sem ela os posts não serão publicados automaticamente.')}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>API Key</div>
            {input(uploadPostKey, setUploadPostKey, 'Cole sua API key aqui...')}
          </div>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>Nome do perfil (Profile)</div>
            {input(uploadPostProfile, setUploadPostProfile, 'ex: app')}
            <div style={{ fontSize: 10, color: 'var(--txt3)', marginTop: 4 }}>
              O nome do perfil que aparece no painel do Upload-Post.
            </div>
          </div>
          <div style={{
            marginTop: 10, padding: '8px 12px', background: 'var(--accent-dim)',
            borderRadius: 7, fontSize: 11, color: 'var(--txt2)'
          }}>
            Não tem conta ainda?{' '}
            <a href="https://www.upload-post.com" target="_blank" rel="noreferrer"
              style={{ color: 'var(--accent2)' }}>
              Crie em upload-post.com
            </a>
            {' '}e conecte seu Instagram lá.
          </div>
        </>)}

        {card(<>
          {label('Contas conectadas', 'Confirme os nomes das suas contas nas redes sociais.')}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>Instagram (@usuario)</div>
            {input(instagramUsuario, setInstagramUsuario, '@seu.perfil')}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>Facebook (nome da página)</div>
            {input(facebookPagina, setFacebookPagina, 'Nome da sua página')}
          </div>
        </>)}

        {card(<>
          {label('Conteúdo gerado pela IA', 'Como a IA vai escrever as legendas por padrão.')}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>Tom das legendas</div>
            <select value={tom} onChange={e => setTom(e.target.value)} style={{
              width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 7, padding: '9px 12px', color: 'var(--txt)', fontSize: 13, outline: 'none'
            }}>
              <option value="direto">Direto e objetivo</option>
              <option value="aspiracional">Aspiracional</option>
              <option value="informativo">Informativo</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--txt2)', marginBottom: 5 }}>Hashtags padrão</div>
            {input(hashtags, setHashtags, '#imóveis #corretor #mercadoimobiliário')}
          </div>
        </>)}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="submit" disabled={saving} style={{
            background: 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Salvando...' : 'Salvar configurações'}
          </button>
          {saved && <span style={{ fontSize: 12, color: 'var(--green)' }}>✓ Salvo com sucesso</span>}
        </div>
      </form>
    </div>
  )
}
