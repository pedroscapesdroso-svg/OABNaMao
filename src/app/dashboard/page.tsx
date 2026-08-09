'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Simulado } from '@/lib/types'
import { MATERIAS } from '@/lib/data'

interface Stats {
  totalSimulados: number
  totalQuestoes: number
  totalAcertos: number
  totalErros: number
  percentualGeral: number
  melhorMateria: string
  piorMateria: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [ultimosSimulados, setUltimosSimulados] = useState<Simulado[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Busca todos os simulados do usuário
      const { data: simulados } = await supabase
        .from('simulados')
        .select('*')
        .eq('user_id', user.id)
        .order('finalizado_em', { ascending: false })

      if (simulados && simulados.length > 0) {
        const total = simulados.reduce((acc, s) => ({
          questoes: acc.questoes + s.total_questoes,
          acertos: acc.acertos + s.acertos,
          erros: acc.erros + s.erros,
        }), { questoes: 0, acertos: 0, erros: 0 })

        // Calcula desempenho por matéria
        const porMateria: Record<string, { acertos: number; total: number }> = {}
        simulados.filter(s => s.materia).forEach(s => {
          if (!porMateria[s.materia]) porMateria[s.materia] = { acertos: 0, total: 0 }
          porMateria[s.materia].acertos += s.acertos
          porMateria[s.materia].total += s.total_questoes
        })

        let melhor = '-', pior = '-', maxPct = 0, minPct = 101
        Object.entries(porMateria).forEach(([mat, v]) => {
          const pct = (v.acertos / v.total) * 100
          if (pct > maxPct) { maxPct = pct; melhor = mat }
          if (pct < minPct) { minPct = pct; pior = mat }
        })

        setStats({
          totalSimulados: simulados.length,
          totalQuestoes: total.questoes,
          totalAcertos: total.acertos,
          totalErros: total.erros,
          percentualGeral: total.questoes > 0 ? (total.acertos / total.questoes) * 100 : 0,
          melhorMateria: melhor,
          piorMateria: pior,
        })
        setUltimosSimulados(simulados.slice(0, 5))
      } else {
        setStats({ totalSimulados: 0, totalQuestoes: 0, totalAcertos: 0, totalErros: 0, percentualGeral: 0, melhorMateria: '-', piorMateria: '-' })
      }
      setLoading(false)
    }
    carregarDados()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Acompanhe seu progresso nos estudos</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Simulados feitos" value={String(stats?.totalSimulados ?? 0)} icon="📝" color="#0070f3" />
        <StatCard label="Questões respondidas" value={String(stats?.totalQuestoes ?? 0)} icon="📚" color="#333" />
        <StatCard label="Total de acertos" value={String(stats?.totalAcertos ?? 0)} icon="✅" color="#28a745" />
        <StatCard
          label="Aproveitamento geral"
          value={`${(stats?.percentualGeral ?? 0).toFixed(1)}%`}
          icon="🎯"
          color={(stats?.percentualGeral ?? 0) >= 60 ? '#28a745' : '#dc3545'}
        />
      </div>

      {/* CTA + últimos simulados */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Iniciar simulado */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#333' }}>Iniciar novo simulado</h2>
          <p className="text-sm text-gray-500 mb-5">Escolha uma matéria ou faça uma prova geral com questões aleatórias.</p>
          
          <div className="flex flex-wrap gap-2 mb-5">
            {MATERIAS.slice(1, 6).map(m => (
              <Link key={m} href={`/dashboard/simulado?materia=${encodeURIComponent(m)}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium border hover:border-blue-400 hover:text-blue-600 transition-colors"
                style={{ borderColor: '#e5e7eb', color: '#555' }}>
                {m}
              </Link>
            ))}
          </div>

          <Link href="/dashboard/simulado"
            className="block w-full text-center py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ background: '#0070f3' }}>
            🚀 Simulado Geral
          </Link>
        </div>

        {/* Últimos simulados */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#333' }}>Últimos simulados</h2>
          
          {ultimosSimulados.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm">Nenhum simulado feito ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ultimosSimulados.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#f8f9fa' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#333' }}>{s.materia ?? 'Geral'}</p>
                    <p className="text-xs text-gray-400">{new Date(s.finalizado_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: s.percentual >= 60 ? '#28a745' : '#dc3545' }}>
                      {s.percentual?.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-400">{s.acertos}/{s.total_questoes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desempenho por matéria */}
      {stats && stats.melhorMateria !== '-' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#333' }}>Destaques por matéria</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ background: '#f0fdf4' }}>
              <p className="text-xs text-green-600 font-medium mb-1">💪 Sua melhor matéria</p>
              <p className="font-semibold" style={{ color: '#333' }}>{stats.melhorMateria}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: '#fff1f2' }}>
              <p className="text-xs text-red-500 font-medium mb-1">🎯 Precisa de atenção</p>
              <p className="font-semibold" style={{ color: '#333' }}>{stats.piorMateria}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Card de estatística reutilizável
function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: `${color}15` }}>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
