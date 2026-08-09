'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Simulado } from '@/lib/types'

export default function HistoricoPage() {
  const [simulados, setSimulados] = useState<Simulado[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('simulados')
        .select('*')
        .eq('user_id', user.id)
        .order('finalizado_em', { ascending: false })

      setSimulados(data ?? [])
      setLoading(false)
    }
    carregar()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Histórico</h1>
          <p className="text-gray-500 text-sm mt-1">{simulados.length} simulados realizados</p>
        </div>
        <Link href="/dashboard/simulado"
          className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
          style={{ background: '#0070f3' }}>
          + Novo
        </Link>
      </div>

      {simulados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-gray-500">Nenhum simulado realizado ainda.</p>
          <Link href="/dashboard/simulado" className="inline-block mt-4 px-6 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: '#0070f3' }}>
            Fazer primeiro simulado
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {simulados.map(s => {
            const aprovado = (s.percentual ?? 0) >= 60
            return (
              <Link key={s.id} href={`/dashboard/resultado/${s.id}`}
                className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#333' }}>{s.materia ?? 'Simulado Geral'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(s.finalizado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      {s.tempo_segundos ? ` • ${Math.floor(s.tempo_segundos / 60)} min` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{s.acertos}/{s.total_questoes} questões</p>
                      <p className="text-sm font-bold" style={{ color: aprovado ? '#28a745' : '#dc3545' }}>
                        {(s.percentual ?? 0).toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: aprovado ? '#28a745' : '#dc3545' }}>
                      {aprovado ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
