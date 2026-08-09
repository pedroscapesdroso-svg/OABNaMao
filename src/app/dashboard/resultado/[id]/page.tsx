'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Simulado, Resposta } from '@/lib/types'
import { useParams } from 'next/navigation'

export default function ResultadoDetalhadoPage() {
  const params = useParams()
  const simuladoId = params.id as string
  const supabase = createClient()

  const [simulado, setSimulado] = useState<Simulado | null>(null)
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data: sim } = await supabase
        .from('simulados')
        .select('*')
        .eq('id', simuladoId)
        .single()

      const { data: resps } = await supabase
        .from('respostas')
        .select('*, questao:questoes(*)')
        .eq('simulado_id', simuladoId)

      setSimulado(sim)
      setRespostas(resps ?? [])
      setLoading(false)
    }
    carregar()
  }, [simuladoId])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </div>
  )

  if (!simulado) return <div className="text-center text-gray-500 mt-20">Simulado não encontrado.</div>

  const percentual = simulado.percentual ?? 0
  const aprovado = percentual >= 60

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Resultado Detalhado</h1>
        <p className="text-gray-500 text-sm mt-1">{simulado.materia ?? 'Simulado Geral'}</p>
      </div>

      {/* Resumo */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: aprovado ? '#28a745' : '#dc3545' }}>
          {percentual.toFixed(0)}%
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold" style={{ color: '#28a745' }}>{simulado.acertos}</p>
            <p className="text-xs text-gray-500">Acertos</p>
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: '#dc3545' }}>{simulado.erros}</p>
            <p className="text-xs text-gray-500">Erros</p>
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: '#333' }}>{simulado.total_questoes}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Questões detalhadas */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: '#333' }}>Gabarito comentado</h2>
        {respostas.map((r, i) => {
          const q = r.questao
          if (!q) return null
          return (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border-l-4"
              style={{ borderLeftColor: r.acertou ? '#28a745' : '#dc3545' }}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">{i + 1}. {q.materia} • {q.ano}</p>
                <span className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: r.acertou ? '#f0fdf4' : '#fff1f2', color: r.acertou ? '#16a34a' : '#dc2626' }}>
                  {r.acertou ? '✓ Acertou' : '✗ Errou'}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{q.enunciado}</p>
              <div className="flex gap-2 text-xs">
                {!r.acertou && (
                  <span className="px-2 py-1 rounded-lg" style={{ background: '#fff1f2', color: '#dc2626' }}>
                    Você marcou: {r.resposta_marcada ?? 'Não respondeu'}
                  </span>
                )}
                <span className="px-2 py-1 rounded-lg" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  Correta: {q.resposta_correta}
                </span>
              </div>
              {q.explicacao && (
                <p className="text-xs text-gray-500 mt-3 p-3 rounded-lg" style={{ background: '#f8f9fa' }}>
                  💡 {q.explicacao}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Ações */}
      <div className="flex gap-3 pb-6">
        <Link href="/dashboard/simulado"
          className="flex-1 py-3 text-center rounded-xl text-white font-semibold text-sm"
          style={{ background: '#0070f3' }}>
          🔄 Novo Simulado
        </Link>
        <Link href="/dashboard"
          className="flex-1 py-3 text-center rounded-xl font-semibold text-sm border"
          style={{ borderColor: '#e5e7eb', color: '#333' }}>
          📊 Dashboard
        </Link>
      </div>
    </div>
  )
}
