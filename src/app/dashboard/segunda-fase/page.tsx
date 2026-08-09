'use client'

import { useState, useCallback } from 'react'
import { CASOS_POR_AREA, AREAS_SEGUNDA_FASE, CasoPratico } from '@/lib/pecas'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import VadeMecum from '@/components/VadeMecum'

type Fase = 'selecao' | 'escrevendo' | 'gabarito'

const MINIMO_LINHAS = 30

export default function SegundaFasePage() {
  const router = useRouter()
  const supabase = createClient()

  const [fase, setFase] = useState<Fase>('selecao')
  const [areaSelecionada, setAreaSelecionada] = useState('')
  const [casoAtual, setCasoAtual] = useState<CasoPratico | null>(null)
  const [peca, setPeca] = useState('')
  const [mostrarVade, setMostrarVade] = useState(false)
  const [mostrarDica, setMostrarDica] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [iniciadoEm] = useState(new Date())
  const [feedbackGemini, setFeedbackGemini] = useState<string | null>(null)
  const [carregandoGemini, setCarregandoGemini] = useState(false)

  // Conta linhas não vazias
  const linhas = peca === '' ? 0 : peca.split('\n').filter(l => l.trim().length > 0).length
  const progresso = Math.min((linhas / MINIMO_LINHAS) * 100, 100)
  const podeEnviar = linhas >= MINIMO_LINHAS

  const iniciar = (area: string) => {
    const casos = CASOS_POR_AREA[area]
    const caso = casos[Math.floor(Math.random() * casos.length)]
    setCasoAtual(caso)
    setAreaSelecionada(area)
    setPeca('')
    setFeedbackGemini(null)
    setFase('escrevendo')
  }

  const finalizar = async () => {
    if (!casoAtual) return
    setSalvando(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const tempoSeg = Math.floor((new Date().getTime() - iniciadoEm.getTime()) / 1000)
      await supabase.from('pecas_simulados').insert({
        user_id: user.id,
        area: casoAtual.area,
        tipo_peca: casoAtual.peca,
        enunciado: casoAtual.enunciado,
        resposta: peca,
        tempo_segundos: tempoSeg,
      })
    }

    setSalvando(false)
    setFase('gabarito')
  }

  const analisarComGemini = useCallback(async () => {
    if (!casoAtual) return
    setCarregandoGemini(true)
    setFeedbackGemini(null)
    try {
      const res = await fetch('/api/gemini-peca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enunciado: casoAtual.enunciado, tipoPeca: casoAtual.peca, peca }),
      })
      const data = await res.json()
      setFeedbackGemini(data.feedback ?? 'Não foi possível obter feedback.')
    } catch {
      setFeedbackGemini('Erro ao conectar com o Gemini. Verifique a chave de API.')
    }
    setCarregandoGemini(false)
  }, [casoAtual, peca])

  // ─── SELEÇÃO ─────────────────────────────────────────────────────────────────
  if (fase === 'selecao') return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>2ª Fase — Peças Processuais</h1>
        <p className="text-gray-500 text-sm mt-1">Pratique com casos reais baseados no histórico da FGV. Mínimo de {MINIMO_LINHAS} linhas por peça.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AREAS_SEGUNDA_FASE.map(area => {
          const casos = CASOS_POR_AREA[area]
          const top = casos.reduce((a, b) => a.frequencia > b.frequencia ? a : b)
          return (
            <button key={area} onClick={() => iniciar(area)}
              className="bg-white rounded-2xl p-5 text-left shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: '#eff6ff' }}>
                📄
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#333' }}>{area}</p>
              <p className="text-xs text-gray-400 mb-3">{casos.length} caso{casos.length > 1 ? 's' : ''}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#eff6ff', color: '#0070f3' }}>
                  {top.peca}
                </span>
                <span className="text-xs text-gray-400">{top.frequencia}× na FGV</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Ranking de peças */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold mb-4" style={{ color: '#333' }}>📊 Peças mais cobradas historicamente</p>
        <div className="space-y-3">
          {[
            { label: 'Petição Inicial — Civil', freq: 24 },
            { label: 'Recurso Ordinário — Trabalho', freq: 13 },
            { label: 'Contestação — Trabalho', freq: 13 },
            { label: 'Apelação — Penal', freq: 11 },
            { label: 'Mandado de Segurança — Tributário', freq: 8 },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-52 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(item.freq / 24) * 100}%`, background: '#0070f3' }} />
              </div>
              <span className="text-xs font-bold w-6 text-right" style={{ color: '#0070f3' }}>{item.freq}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ─── GABARITO ────────────────────────────────────────────────────────────────
  if (fase === 'gabarito' && casoAtual) return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Gabarito — {casoAtual.peca}</h1>
        <button onClick={() => setFase('selecao')} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#0070f3' }}>
          Nova Peça
        </button>
      </div>

      {/* Botão Gemini */}
      <button onClick={analisarComGemini} disabled={carregandoGemini}
        className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #4285f4, #0070f3)' }}>
        {carregandoGemini
          ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analisando com Gemini...</>
          : <>✨ Analisar minha peça com Gemini</>
        }
      </button>

      {/* Feedback Gemini */}
      {feedbackGemini && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#4285f4' }}>
          <p className="text-sm font-bold mb-3" style={{ color: '#4285f4' }}>✨ Feedback do Gemini</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{feedbackGemini}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resposta do usuário */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold mb-1" style={{ color: '#333' }}>✍ Sua resposta</p>
          <p className="text-xs text-gray-400 mb-3">{linhas} linhas</p>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto p-3 rounded-xl font-mono text-xs"
            style={{ background: '#f8f9fa' }}>
            {peca || <span className="text-gray-400 italic">Nenhum texto digitado.</span>}
          </div>
        </div>

        {/* Estrutura ideal */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <p className="text-sm font-semibold" style={{ color: '#333' }}>✅ Estrutura ideal — {casoAtual.peca}</p>
          {[
            { n: '1. Cabeçalho / Endereçamento', t: casoAtual.estrutura.cabecalho },
            { n: '2. Qualificação das Partes', t: casoAtual.estrutura.qualificacao },
            { n: '3. Dos Fatos', t: casoAtual.estrutura.dos_fatos },
            { n: '4. Do Direito', t: casoAtual.estrutura.do_direito },
            { n: '5. Dos Pedidos', t: casoAtual.estrutura.dos_pedidos },
            { n: '6. Fechamento', t: casoAtual.estrutura.fechamento },
          ].map(item => (
            <div key={item.n} className="p-3 rounded-xl" style={{ background: '#f8f9fa' }}>
              <p className="text-xs font-bold text-blue-600 mb-1">{item.n}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.t}</p>
            </div>
          ))}
          <div className="p-3 rounded-xl" style={{ background: '#f0fdf4' }}>
            <p className="text-xs font-bold text-green-600 mb-2">💡 Pedidos essenciais</p>
            {casoAtual.pedidos_sugeridos.map((p, i) => (
              <p key={i} className="text-xs text-gray-600">• {p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── EDITOR ──────────────────────────────────────────────────────────────────
  if (!casoAtual) return null

  return (
    <>
      {/* Modal Vade Mecum fullscreen */}
      {mostrarVade && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setMostrarVade(false)} />
          <div className="w-full max-w-2xl bg-white flex flex-col shadow-2xl">
            <VadeMecum onFechar={() => setMostrarVade(false)} fullscreen />
          </div>
        </div>
      )}

      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto space-y-3">

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-xs text-gray-400">{casoAtual.area}</p>
            <h1 className="text-lg font-bold" style={{ color: '#333' }}>{casoAtual.peca}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMostrarDica(!mostrarDica)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
              style={{ borderColor: mostrarDica ? '#f59e0b' : '#e5e7eb', color: mostrarDica ? '#f59e0b' : '#555', background: mostrarDica ? '#fffbeb' : 'white' }}>
              💡 Estrutura
            </button>
            <button onClick={() => setMostrarVade(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: '#333' }}>
              📚 Vade Mecum
            </button>
          </div>
        </div>

        {/* Dica de estrutura */}
        {mostrarDica && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex-shrink-0 text-xs text-amber-700">
            <p className="font-bold mb-1">Estrutura obrigatória — {casoAtual.peca}:</p>
            <p>① Endereçamento ao juízo → ② Qualificação das partes → ③ DOS FATOS → ④ DO DIREITO (fundamentos legais) → ⑤ DOS PEDIDOS (em tópicos) → ⑥ Fechamento (local, data, nome do advogado, OAB nº)</p>
          </div>
        )}

        {/* Enunciado */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-shrink-0">
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Caso Prático</p>
          <p className="text-sm text-gray-700 leading-relaxed">{casoAtual.enunciado}</p>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span>🟦 {casoAtual.partes.polo_ativo}</span>
            <span>🟥 {casoAtual.partes.polo_passivo}</span>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-0">
          {/* Barra de progresso de linhas */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-gray-500">
                {linhas < MINIMO_LINHAS
                  ? <>⚠️ Mínimo de <strong>{MINIMO_LINHAS} linhas</strong> — você tem <strong>{linhas}</strong></>
                  : <>✅ <strong>{linhas} linhas</strong> — mínimo atingido!</>
                }
              </p>
              <p className="text-xs text-gray-400">{MINIMO_LINHAS - linhas > 0 ? `Faltam ${MINIMO_LINHAS - linhas} linhas` : 'Pode enviar'}</p>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progresso}%`, background: podeEnviar ? '#28a745' : '#0070f3' }} />
            </div>
          </div>

          <textarea
            value={peca}
            onChange={e => setPeca(e.target.value)}
            placeholder={`EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA ___\n\n[NOME DO CLIENTE], [nacionalidade], [estado civil], [profissão], CPF nº ___, residente em [endereço], por seu advogado infra-assinado, vem propor...\n\nDOS FATOS\n\n[Narrar os fatos cronologicamente...]\n\nDO DIREITO\n\n[Fundamentos legais e jurisprudência...]\n\nDOS PEDIDOS\n\nDiante do exposto, requer:\na) ...\nb) ...\nc) honorários e custas\n\nDá-se à causa o valor de R$ ___.\n[Cidade], [data].\n[Nome do Advogado]\nOAB/__ nº ___`}
            className="flex-1 p-4 text-sm text-gray-700 leading-7 resize-none focus:outline-none font-mono"
            style={{ minHeight: 0 }}
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={() => setFase('selecao')} className="px-5 py-3 rounded-xl text-sm border font-medium" style={{ borderColor: '#e5e7eb', color: '#555' }}>
            ← Voltar
          </button>
          <button onClick={finalizar} disabled={salvando || !podeEnviar}
            className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: podeEnviar ? '#28a745' : '#9ca3af' }}>
            {!podeEnviar
              ? `✍ Escreva mais ${MINIMO_LINHAS - linhas} linha${MINIMO_LINHAS - linhas > 1 ? 's' : ''} para finalizar`
              : salvando ? 'Salvando...' : '✅ Finalizar e Ver Gabarito'
            }
          </button>
        </div>
      </div>
    </>
  )
}
