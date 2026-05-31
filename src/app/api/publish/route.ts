import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { apiKey, profile, plataformas, legenda, mediaUrls, agendarPara } = await req.json()

  if (!apiKey) {
    return NextResponse.json({ error: 'API key do Upload-Post não configurada. Acesse Configurações.' }, { status: 400 })
  }

  if (!profile) {
    return NextResponse.json({ error: 'Nome do perfil não configurado. Acesse Configurações.' }, { status: 400 })
  }

  if (!mediaUrls || mediaUrls.length === 0) {
    return NextResponse.json({ error: 'Sem imagens para publicar. Gere o carrossel antes.' }, { status: 400 })
  }

  try {
    const formData = new FormData()
    formData.append('user', profile)
    formData.append('title', legenda || '')
    formData.append('async_upload', 'false')

    // Plataformas
    for (const p of plataformas) {
      formData.append('platform[]', p)
    }

    // Agendamento
    if (agendarPara) {
      formData.append('scheduled_date', new Date(agendarPara).toISOString())
      formData.append('timezone', 'America/Sao_Paulo')
    }

    // Baixa cada imagem e adiciona ao FormData
    for (let i = 0; i < mediaUrls.length; i++) {
      const imgRes = await fetch(mediaUrls[i])
      if (!imgRes.ok) continue
      const blob = await imgRes.blob()
      formData.append('photos[]', blob, `slide_${i + 1}.png`)
    }

    const res = await fetch('https://api.upload-post.com/api/upload_photos', {
      method: 'POST',
      headers: {
        Authorization: `Apikey ${apiKey}`,
      },
      body: formData,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return NextResponse.json({
        error: data.message || data.error || `Erro ${res.status} do Upload-Post.`
      }, { status: res.status })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({
      error: `Erro de conexão: ${err instanceof Error ? err.message : 'falha desconhecida'}`
    }, { status: 500 })
  }
}
