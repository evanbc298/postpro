import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { imovel, tipo, foco, tom } = await req.json()

  const prompt = `Você é um especialista em marketing imobiliário brasileiro.
Crie uma legenda para um ${tipo} no Instagram/Facebook para o seguinte imóvel:

Imóvel: ${imovel.titulo}
Tipo: ${imovel.tipo}
Preço: ${imovel.preco ? `R$ ${Number(imovel.preco).toLocaleString('pt-BR')}` : 'A consultar'}
Área: ${imovel.area ? `${imovel.area} m²` : ''}
Localização: ${imovel.localizacao || ''}
Diferenciais: ${imovel.diferenciais || ''}
Foco do conteúdo: ${foco}
Tom: ${tom}

Regras:
- Máximo 150 palavras
- Sem gírias, sem excesso de emojis (máximo 2)
- Direto ao ponto, focado no benefício
- Terminar com chamada pra ação curta
- Não usar "alavancar", "sinergia", "jornada"

Retorne apenas a legenda, sem explicações.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    }),
  })

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Chave OpenAI não configurada no servidor.' }, { status: 500 })
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: `OpenAI erro ${res.status}: ${err?.error?.message || 'falha desconhecida'}` }, { status: 500 })
  }

  const data = await res.json()
  const legenda = data.choices[0].message.content.trim()
  return NextResponse.json({ legenda })
}
