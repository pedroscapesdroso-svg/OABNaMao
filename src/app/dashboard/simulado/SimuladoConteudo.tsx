'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Questao } from '@/lib/types'
import { questoesExemplo, MATERIAS } from '@/lib/data'

export default function SimuladoConteudo() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [fase, setFase] = useState<'selecao' | 'prova' | 'finalizando'>('selecao')
  const [materiaEscolhida, setMateriaEscolhida] = useState(searchParams.get('materia') ?? '')
  const [qtdQuestoes, setQtdQuestoes] = useState(10)

  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({})
  const [iniciadoEm, setIniciadoEm] = useState<Date>(new Date())

  useEffect(() => {
    const m = searchParams.get('materia')
    if (m) setMateriaEscolhida(m)
  }, [searchParams])

  const iniciarSimulado = async () => {
    let qs: Questao[] = []

    const query = supabase.from('questoes').select('*').limit(qtdQuestoes)
    if (materiaEscolhida) query.eq('materia', materiaEscolhida)

    const { data } = await query
    if (data && data.length > 0) {
      qs = data as Questao[]
    } else {
      // Questões de demonstração enquanto o banco está vazio
      qs = materiaEscolhida
        ? questoesExemplo.filter(q => q.materia === materiaEscolhida)
        : questoesExemplo
      qs = qs.slice(0, qtdQuestoes)
    }

    if (qs.length === 0) {
      alert('Nenhuma questão encontrada para essa matéria.')
      return
    }

    setQuestoes(qs)
    setQuestaoAtual(0)
    setRespostas({})
    setIniciadoEm(new Date())
    setFase('prova')
  }

  const responder = (alt: 'A' | 'B' | 'C' | 'D') => {
    setRespostas(prev => ({ ...prev, [questoes[questaoAtual].id]: alt }))
  }

  const finalizar = useCallback(async () => {
    setFase('finalizando')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let acertos = 0
    questoes.forEach(q => {
      if (respostas[q.id] === q.resposta_correta) acertos++
    })

    const tempoSeg = Math.floor((new Date().getTime() - iniciadoEm.getTime()) / 1000)
    const percentual = (acertos / questoes.length) * 100

    const { data: simulado } = await supabase.from('simulados').insert({
      user_id: user.id,
      materia: materiaEscolhida || null,
      total_questoes: questoes.length,
      acertos,
      erros: questoes.length - acertos,
      percentual,
      tempo_segundos: tempoSeg,
    }).select().single()

    if (simulado) {
      const respostasArr = questoes.map(q => ({
        simulado_id: simulado.id,
        user_id: user.id,
        questao_id: q.id,
        resposta_marcada: respostas[q.id] ?? null,
        acertou: respostas[q.id] === q.resposta_correta,
      }))
      await supabase.from('respostas').insert(respostasArr)
      router.push(`/dashboard/resultado/${simulado.id}`)
    } else {
      // Fallback para questões demo (sem ID real no banco)
      const p = new URLSearchParams({
        acertos: String(acertos),
        total: String(questoes.length),
        materia: materiaEscolhida,
        tempo: String(tempoSeg),
      })
      router.push(`/dashboard/resultado?${p}`)
    }
  }, [questoes, respostas, materiaEscolhida, iniciadoEm, supabase, router])

  // ─── TELA DE SELEÇÃO ──────────────────────────────────────────────────────────
  if (fase === 'selecao') return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#333' }}>Novo Simulado</h1>
      <p className="text-gray-500 text-sm mb-8">Configure e comece a praticar.</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">Matéria</label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setMateriaEscolhida('')}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={{ background: !materiaEscolhida ? '#0070f3' : 'white', color: !materiaEscolhida ? 'white' : '#555', borderColor: !materiaEscolhida ? '#0070f3' : '#e5e7eb' }}>
              Todas
            </button>
            {MATERIAS.slice(1).map(m => (
              <button key={m} onClick={() => setMateriaEscolhida(m)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                style={{ background: materiaEscolhida === m ? '#0070f3' : 'white', color: materiaEscolhida === m ? 'white' : '#555', borderColor: materiaEscolhida === m ? '#0070f3' : '#e5e7eb' }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">
            Quantidade: <span style={{ color: '#0070f3' }}>{qtdQuestoes}</span>
          </label>
          <div className="flex gap-3">
            {[5, 10, 20, 30, 40].map(n => (
              <button key={n} onClick={() => setQtdQuestoes(n)}
                className="w-14 h-10 rounded-xl text-sm font-medium border transition-all"
                style={{ background: qtdQuestoes === n ? '#333' : 'white', color: qtdQuestoes === n ? 'white' : '#555', borderColor: qtdQuestoes === n ? '#333' : '#e5e7eb' }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <button onClick={iniciarSimulado}
          className="w-full py-4 rounded-xl text-white font-bold text-base hover:opacity-90 transition-opacity"
          style={{ background: '#0070f3' }}>
          🚀 Começar Simulado {materiaEscolhida ? `— ${materiaEscolhida}` : 'Geral'}
        </button>
      </div>
    </div>
  )

  // ─── FINALIZANDO ──────────────────────────────────────────────────────────────
  if (fase === 'finalizando') return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Salvando resultado...</p>
      </div>
    </div>
  )

  // ─── PROVA ────────────────────────────────────────────────────────────────────
  const questao = questoes[questaoAtual]
  const respostaAtual = respostas[questao.id]
  const progresso = ((questaoAtual + 1) / questoes.length) * 100
  const respondidas = Object.keys(respostas).length
  const alternativas: ['A', 'B', 'C', 'D'] = ['A', 'B', 'C', 'D']
  const textoAlts: Record<'A' | 'B' | 'C' | 'D', string> = {
    A: questao.alternativa_a,
    B: questao.alternativa_b,
    C: questao.alternativa_c,
    D: questao.alternativa_d,
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{questao.materia} • {questao.ano}</p>
          <p className="font-semibold" style={{ color: '#333' }}>Questão {questaoAtual + 1} de {questoes.length}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{respondidas} respondidas</p>
          <p className="text-xs" style={{ color: '#28a745' }}>{questoes.length - respondidas} faltando</p>
        </div>
      </div>

      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progresso}%`, background: '#0070f3' }} />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-700 leading-relaxed mb-6">{questao.enunciado}</p>
        <div className="space-y-3">
          {alternativas.map(alt => {
            const sel = respostaAtual === alt
            return (
              <button key={alt} onClick={() => responder(alt)}
                className="w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:border-blue-300"
                style={{ borderColor: sel ? '#0070f3' : '#e5e7eb', background: sel ? '#eff6ff' : 'white' }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: sel ? '#0070f3' : '#f3f4f6', color: sel ? 'white' : '#555' }}>
                  {alt}
                </span>
                <span className="text-sm text-gray-700 pt-1">{textoAlts[alt]}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setQuestaoAtual(q => q - 1)} disabled={questaoAtual === 0}
          className="flex-1 py-3 rounded-xl border text-sm font-medium disabled:opacity-30"
          style={{ borderColor: '#e5e7eb', color: '#555' }}>
          ← Anterior
        </button>
        {questaoAtual < questoes.length - 1 ? (
          <button onClick={() => setQuestaoAtual(q => q + 1)}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: '#333' }}>
            Próxima →
          </button>
        ) : (
          <button onClick={finalizar}
            className="flex-1 py-3 rounded-xl text-white font-bold text-sm"
            style={{ background: '#28a745' }}>
            ✅ Finalizar Simulado
          </button>
        )}
      </div>

      {/* Mapa de questões */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-3 font-medium">Navegação rápida</p>
        <div className="flex flex-wrap gap-2">
          {questoes.map((q, i) => {
            const resp = respostas[q.id]
            const atual = i === questaoAtual
            return (
              <button key={q.id} onClick={() => setQuestaoAtual(i)}
                className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                style={{ background: atual ? '#0070f3' : resp ? '#28a745' : '#f3f4f6', color: atual || resp ? 'white' : '#555' }}>
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
