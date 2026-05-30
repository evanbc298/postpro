import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { mensagem, historico = [] } = await req.json()

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI não configurado' }, { status: 500 })
  }

  const sistema = `Você é o assistente de marketing imobiliário da Postpro.
Ajuda corretores e imobiliárias a criar conteúdo, planejar posts, entender métricas e usar melhor a plataforma.
Seja direto, prático e focado no mercado imobiliário brasileiro.
Máximo 3 parágrafos por resposta. Sem rodeios.`

  const messages = [
    { role: 'system', content: sistema },
    ...historico.slice(-6),
    { role: 'user', content: mensagem },
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 400,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Erro ao processar mensagem' }, { status: 500 })
  }

  const data = await res.json()
  const resposta = data.choices[0].message.content.trim()
  return NextResponse.json({ resposta })
}
