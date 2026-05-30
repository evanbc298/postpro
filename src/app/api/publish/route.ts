import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { apiKey, plataformas, legenda, mediaUrls, agendarPara } = await req.json()

  if (!apiKey) {
    return NextResponse.json({ error: 'API key do Upload-Post não configurada. Acesse Configurações.' }, { status: 400 })
  }

  if (!mediaUrls || mediaUrls.length === 0) {
    return NextResponse.json({ error: 'Nenhuma imagem para publicar.' }, { status: 400 })
  }

  const body: Record<string, unknown> = {
    platforms: plataformas,
    caption: legenda,
    media: mediaUrls.map((url: string) => ({ url })),
  }

  if (agendarPara) body.schedule_at = agendarPara

  try {
    const res = await fetch('https://api.upload-post.com/v1/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Erro ao publicar.' }, { status: res.status })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Erro de conexão com o Upload-Post.' }, { status: 500 })
  }
}
