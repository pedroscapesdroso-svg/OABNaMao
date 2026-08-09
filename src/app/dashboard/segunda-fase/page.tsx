'use client'

import { useState } from 'react'
import { CASOS_POR_AREA, AREAS_SEGUNDA_FASE, CasoPratico } from '@/lib/pecas'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import VadeMecum from '@/components/VadeMecum'

type Fase = 'selecao' | 'escrevendo' | 'gabarito'

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

  const iniciar = (area: string) => {
    const casos = CASOS_POR_AREA[area]
    // Escolhe um caso aleatório da área
    const caso = casos[Math.floor(Math.random() * casos.length)]
    setCasoAtual(caso)
    setAreaSelecionada(area)
    setPeca('')
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
      }).select().single()
    }

    setSalvando(false)
    setFase('gabarito')
  }

  const palavras = peca.trim() === '' ? 0 : peca.trim().split(/\s+/).length

  // ─── SELEÇÃO DE ÁREA ──────────────────────────────────────────────────────────
  if (fase === 'selecao') return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>2ª Fase — Peças Processuais</h1>
        <p className="text-gray-500 text-sm mt-1">Pratique a elaboração de peças com casos reais baseados no histórico da FGV.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AREAS_SEGUNDA_FASE.map(area => {
          const casos = CASOS_POR_AREA[area]
          const pecaMaisFrequente = casos.reduce((a, b) => a.frequencia > b.frequencia ? a : b)
          return (
            <button key={area} onClick={() => iniciar(area)}
              className="bg-white rounded-2xl p-5 text-left shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ background: '#eff6ff' }}>
                📄
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#333' }}>{area}</p>
              <p className="text-xs text-gray-400 mb-3">{casos.length} casos disponíveis</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: '#eff6ff', color: '#0070f3' }}>
                  {pecaMaisFrequente.peca}
                </span>
                <span className="text-xs text-gray-400">{pecaMaisFrequente.frequencia}x na FGV</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold mb-3" style={{ color: '#333' }}>📊 Peças mais cobradas historicamente</p>
        <div className="space-y-2">
          {[
            { area: 'Direito Civil', peca: 'Petição Inicial', freq: 24 },
            { area: 'Direito do Trabalho', peca: 'Recurso Ordinário', freq: 13 },
            { area: 'Direito Penal', peca: 'Apelação', freq: 11 },
            { area: 'Direito Tributário', peca: 'Mandado de Segurança', freq: 8 },
            { area: 'Direito Constitucional', peca: 'Mandado de Segurança', freq: 7 },
          ].map(item => (
            <div key={item.area} className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(item.freq / 24) * 100}%`, background: '#0070f3' }} />
              </div>
              <span className="text-xs text-gray-500 w-28 flex-shrink-0">{item.area.replace('Direito ', '')}</span>
              <span className="text-xs font-bold w-8 text-right" style={{ color: '#0070f3' }}>{item.freq}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ─── GABARITO ─────────────────────────────────────────────────────────────────
  if (fase === 'gabarito' && casoAtual) return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Gabarito — {casoAtual.peca}</h1>
        <button onClick={() => setFase('selecao')}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#0070f3' }}>
          Nova Peça
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sua resposta */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold mb-3" style={{ color: '#333' }}>✍ Sua resposta ({palavras} palavras)</p>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto p-3 rounded-xl"
            style={{ background: '#f8f9fa' }}>
            {peca || <span className="text-gray-400 italic">Nenhum texto digitado.</span>}
          </div>
        </div>

        {/* Estrutura sugerida */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <p className="text-sm font-semibold" style={{ color: '#333' }}>✅ Estrutura ideal — {casoAtual.peca}</p>

          {[
            { titulo: '1. Cabeçalho / Endereçamento', texto: casoAtual.estrutura.cabecalho },
            { titulo: '2. Qualificação das Partes', texto: casoAtual.estrutura.qualificacao },
            { titulo: '3. Dos Fatos', texto: casoAtual.estrutura.dos_fatos },
            { titulo: '4. Do Direito (fundamentos)', texto: casoAtual.estrutura.do_direito },
            { titulo: '5. Dos Pedidos', texto: casoAtual.estrutura.dos_pedidos },
            { titulo: '6. Fechamento', texto: casoAtual.estrutura.fechamento },
          ].map(item => (
            <div key={item.titulo} className="p-3 rounded-xl" style={{ background: '#f8f9fa' }}>
              <p className="text-xs font-bold text-blue-600 mb-1">{item.titulo}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.texto}</p>
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

  // ─── EDITOR DE PEÇA ───────────────────────────────────────────────────────────
  if (!casoAtual) return null

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-xs text-gray-400">{casoAtual.area}</p>
            <h1 className="text-lg font-bold" style={{ color: '#333' }}>{casoAtual.peca}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMostrarDica(!mostrarDica)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
              style={{ borderColor: mostrarDica ? '#f59e0b' : '#e5e7eb', color: mostrarDica ? '#f59e0b' : '#555', background: mostrarDica ? '#fffbeb' : 'white' }}>
              💡 Dica
            </button>
            <button onClick={() => setMostrarVade(!mostrarVade)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
              style={{ background: mostrarVade ? '#1a1a2e' : '#333' }}>
              📚 Vade Mecum
            </button>
          </div>
        </div>

        {/* Dica de estrutura */}
        {mostrarDica && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex-shrink-0">
            <p className="text-xs font-bold text-amber-700 mb-1">Estrutura: {casoAtual.peca}</p>
            <p className="text-xs text-amber-600">
              1. Endereçamento → 2. Qualificação das partes → 3. Dos Fatos → 4. Do Direito → 5. Dos Pedidos → 6. Fechamento (local, data, nome e OAB)
            </p>
          </div>
        )}

        {/* Enunciado */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-shrink-0">
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Caso prático</p>
          <p className="text-sm text-gray-700 leading-relaxed">{casoAtual.enunciado}</p>
          <div className="flex gap-3 mt-3 text-xs text-gray-400">
            <span>👤 {casoAtual.partes.polo_ativo}</span>
            <span>→</span>
            <span>👤 {casoAtual.partes.polo_passivo}</span>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-medium">Redija sua peça aqui</p>
            <p className="text-xs text-gray-400">{palavras} palavras</p>
          </div>
          <textarea
            value={peca}
            onChange={e => setPeca(e.target.value)}
            placeholder={`EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A)...\n\n[Nome do cliente], [qualificação], vem propor...\n\nDOS FATOS\n...\n\nDO DIREITO\n...\n\nDOS PEDIDOS\n...`}
            className="flex-1 p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none font-mono"
            style={{ minHeight: 0 }}
          />
        </div>

        {/* Botão finalizar */}
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={() => setFase('selecao')}
            className="px-4 py-3 rounded-xl text-sm border font-medium"
            style={{ borderColor: '#e5e7eb', color: '#555' }}>
            ← Voltar
          </button>
          <button onClick={finalizar} disabled={salvando || palavras < 10}
            className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40 transition-opacity hover:opacity-90"
            style={{ background: '#28a745' }}>
            {salvando ? 'Salvando...' : '✅ Finalizar e Ver Gabarito'}
          </button>
        </div>
      </div>

      {/* Painel Vade Mecum */}
      {mostrarVade && (
        <div className="w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10" style={{ background: '#1a1a2e' }}>
          <VadeMecum onFechar={() => setMostrarVade(false)} />
        </div>
      )}
    </div>
  )
}
