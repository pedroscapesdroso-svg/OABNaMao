'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MATERIAS } from '@/lib/data'

interface DesempenhoMateria {
  materia: string
  total: number
  acertos: number
  erros: number
  percentual: number
  simulados: number
}

export default function DesempenhoPage() {
  const [dados, setDados] = useState<DesempenhoMateria[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: simulados } = await supabase
        .from('simulados')
        .select('*')
        .eq('user_id', user.id)
        .not('materia', 'is', null)  // Só simulados com matéria definida

      if (!simulados) { setLoading(false); return }

      // Agrupa por matéria
      const porMateria: Record<string, DesempenhoMateria> = {}
      simulados.forEach(s => {
        if (!porMateria[s.materia]) {
          porMateria[s.materia] = { materia: s.materia, total: 0, acertos: 0, erros: 0, percentual: 0, simulados: 0 }
        }
        porMateria[s.materia].total += s.total_questoes
        porMateria[s.materia].acertos += s.acertos
        porMateria[s.materia].erros += s.erros
        porMateria[s.materia].simulados += 1
      })

      // Calcula percentual e ordena do melhor para o pior
      const lista = Object.values(porMateria).map(m => ({
        ...m,
        percentual: m.total > 0 ? (m.acertos / m.total) * 100 : 0,
      })).sort((a, b) => b.percentual - a.percentual)

      setDados(lista)
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
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Desempenho por Matéria</h1>
        <p className="text-gray-500 text-sm mt-1">Veja onde você é forte e onde precisa melhorar.</p>
      </div>

      {dados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-4">📈</p>
          <p className="text-gray-500">Faça simulados por matéria para ver seu desempenho aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dados.map(d => {
            const cor = d.percentual >= 70 ? '#28a745' : d.percentual >= 50 ? '#f59e0b' : '#dc3545'
            return (
              <div key={d.materia} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#333' }}>{d.materia}</p>
                    <p className="text-xs text-gray-400">{d.simulados} simulado{d.simulados !== 1 ? 's' : ''} • {d.total} questões</p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: cor }}>{d.percentual.toFixed(1)}%</p>
                </div>

                {/* Barra de progresso */}
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.percentual}%`, background: cor }} />
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span style={{ color: '#28a745' }}>✓ {d.acertos} acertos</span>
                  <span style={{ color: '#dc3545' }}>✗ {d.erros} erros</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Matérias sem dados ainda */}
      {dados.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-3">Matérias que você ainda não praticou</p>
          <div className="flex flex-wrap gap-2">
            {MATERIAS.slice(1)
              .filter(m => !dados.find(d => d.materia === m))
              .map(m => (
                <span key={m} className="px-3 py-1.5 rounded-full text-xs text-gray-400 border border-dashed" style={{ borderColor: '#d1d5db' }}>
                  {m}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
