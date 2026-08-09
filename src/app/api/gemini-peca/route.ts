import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { enunciado, tipoPeca, peca } = await req.json()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ feedback: 'Chave GEMINI_API_KEY não configurada.' }, { status: 500 })
  }

  // Prompt fixo de correção de peças OAB
  const prompt = `Você é um professor experiente de Direito que corrige peças processuais da 2ª fase do Exame da OAB (FGV).

ENUNCIADO DO CASO PRÁTICO:
${enunciado}

TIPO DE PEÇA EXIGIDA: ${tipoPeca}

PEÇA REDIGIDA PELO ALUNO:
${peca}

Analise a peça acima e forneça um feedback detalhado e didático, avaliando:

1. **Endereçamento** – O juízo está correto para este tipo de peça?
2. **Qualificação das partes** – As partes foram identificadas corretamente (polo ativo e passivo)?
3. **Dos Fatos** – Os fatos foram narrados de forma clara e cronológica?
4. **Do Direito** – Os fundamentos jurídicos estão corretos? Quais artigos foram usados e quais deveriam ter sido usados?
5. **Dos Pedidos** – Os pedidos são adequados ao caso? Estão em tópicos? Há pedidos faltando?
6. **Fechamento** – Há local, data, nome do advogado e número da OAB?
7. **Nota estimada** – De 0 a 10, qual seria a nota desta peça no exame? Justifique.
8. **Principais pontos a melhorar** – Liste os 3 pontos mais críticos para melhorar.

Seja direto, objetivo e didático. Use linguagem acessível para um estudante de Direito.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
        }),
      }
    )

    const data = await response.json()
    const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Não foi possível gerar feedback.'

    return NextResponse.json({ feedback })
  } catch (error) {
    return NextResponse.json({ feedback: 'Erro ao chamar o Gemini. Tente novamente.' }, { status: 500 })
  }
}
