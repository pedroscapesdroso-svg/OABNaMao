'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResultadoConteudo() {
  const params = useSearchParams()
  const acertos = Number(params.get('acertos') ?? 0)
  const total = Number(params.get('total') ?? 0)
  const materia = params.get('materia') ?? 'Geral'
  const tempo = Number(params.get('tempo') ?? 0)

  const percentual = total > 0 ? (acertos / total) * 100 : 0
  const erros = total - acertos
  const aprovado = percentual >= 60

  const minutos = Math.floor(tempo / 60)
  const segundos = tempo % 60

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Resultado do Simulado</h1>
        <p className="text-gray-500 text-sm mt-1">{materia}</p>
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white"
          style={{ background: aprovado ? '#28a745' : '#dc3545' }}>
          {percentual.toFixed(0)}%
        </div>
        <p className="text-lg font-semibold mb-1" style={{ color: '#333' }}>
          {aprovado ? '🎉 Aprovado! Excelente!' : '📚 Continue estudando!'}
        </p>
        <p className="text-sm text-gray-500">
          {aprovado ? 'Você atingiu a meta de 60% da OAB!' : 'A meta é 60%. Você está perto, não desista!'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold" style={{ color: '#28a745' }}>{acertos}</p>
          <p className="text-xs text-gray-500 mt-1">Acertos</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold" style={{ color: '#dc3545' }}>{erros}</p>
          <p className="text-xs text-gray-500 mt-1">Erros</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold" style={{ color: '#333' }}>{minutos}:{String(segundos).padStart(2, '0')}</p>
          <p className="text-xs text-gray-500 mt-1">Tempo</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3">
        <Link href="/dashboard/simulado"
          className="flex-1 py-3 text-center rounded-xl text-white font-semibold text-sm hover:opacity-90"
          style={{ background: '#0070f3' }}>
          🔄 Novo Simulado
        </Link>
        <Link href="/dashboard"
          className="flex-1 py-3 text-center rounded-xl font-semibold text-sm border hover:bg-gray-50"
          style={{ borderColor: '#e5e7eb', color: '#333' }}>
          📊 Ver Dashboard
        </Link>
      </div>
    </div>
  )
}
