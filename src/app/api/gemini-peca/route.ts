import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { enunciado, tipoPeca, peca } = await req.json()

  // Busca a chave do Gemini do usuário logado
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ feedback: 'Usuário não autenticado.' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('gemini_api_key')
    .eq('id', user.id)
    .single()

  const apiKey = profile?.gemini_api_key
  if (!apiKey) {
    return NextResponse.json({
      feedback: '⚙️ Você ainda não configurou sua chave do Gemini. Vá em Configurações para adicionar sua chave gratuita do Google AI Studio.',
    })
  }

  // Prompt de correção de peças OAB
  const prompt = `Você é um professor experiente de Direito que corrige peças processuais da 2ª fase do Exame da OAB (FGV).

ENUNCIADO DO CASO PRÁTICO:
${enunciado}

TIPO DE PEÇA EXIGIDA: ${tipoPeca}

PEÇA REDIGIDA PELO ALUNO:
${peca}

Analise a peça e forneça feedback detalhado e didático avaliando:

1. **Endereçamento** – O juízo está correto para este tipo de peça?
2. **Qualificação das partes** – As partes foram identificadas corretamente?
3. **Dos Fatos** – Os fatos foram narrados de forma clara e cronológica?
4. **Do Direito** – Os fundamentos jurídicos estão corretos? Quais artigos foram usados e quais deveriam ter sido usados?
5. **Dos Pedidos** – Os pedidos são adequados ao caso? Há pedidos faltando?
6. **Fechamento** – Há local, data, nome do advogado e número da OAB?
7. **Nota estimada** – De 0 a 10, qual seria a nota desta peça no exame? Justifique brevemente.
8. **Top 3 pontos a melhorar** – Os pontos mais críticos para melhorar.

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

    if (!response.ok) {
      const err = await response.json()
      if (err?.error?.status === 'INVALID_ARGUMENT') {
        return NextResponse.json({ feedback: '❌ Chave do Gemini inválida. Verifique em Configurações.' })
      }
      return NextResponse.json({ feedback: '❌ Erro na API do Gemini. Tente novamente.' })
    }

    const data = await response.json()
    const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Não foi possível gerar feedback.'

    return NextResponse.json({ feedback })
  } catch {
    return NextResponse.json({ feedback: '❌ Erro ao conectar com o Gemini. Tente novamente.' }, { status: 500 })
  }
}
