'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface PecaFeita {
  id: string
  area: string
  tipo_peca: string
  enunciado: string
  resposta: string
  tempo_segundos: number
  created_at: string
}

export default function HistoricoPecasPage() {
  const [pecas, setPecas] = useState<PecaFeita[]>([])
  const [loading, setLoading] = useState(true)
  const [aberta, setAberta] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('pecas_simulados')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setPecas(data ?? [])
      setLoading(false)
    }
    carregar()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </div>
  )

  const linhas = (texto: string) => texto?.split('\n').filter(l => l.trim()).length ?? 0
  const tempo = (seg: number) => `${Math.floor(seg / 60)}min ${seg % 60}s`

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Histórico de Peças</h1>
          <p className="text-gray-500 text-sm mt-1">{pecas.length} peça{pecas.length !== 1 ? 's' : ''} elaborada{pecas.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/segunda-fase"
          className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
          style={{ background: '#0070f3' }}>
          + Nova Peça
        </Link>
      </div>

      {pecas.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-4">📄</p>
          <p className="text-gray-500 mb-4">Nenhuma peça elaborada ainda.</p>
          <Link href="/dashboard/segunda-fase"
            className="inline-block px-6 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ background: '#0070f3' }}>
            Fazer primeira peça
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pecas.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header da peça */}
              <button onClick={() => setAberta(aberta === p.id ? null : p.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#333' }}>{p.tipo_peca}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.area}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {linhas(p.resposta)} linhas · {p.tempo_segundos ? tempo(p.tempo_segundos) : '-'}
                    </p>
                  </div>
                  <span className="text-gray-400 text-sm">{aberta === p.id ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Conteúdo expandido */}
              {aberta === p.id && (
                <div className="border-t border-gray-100 p-5 space-y-4">
                  {/* Enunciado */}
                  <div className="p-3 rounded-xl" style={{ background: '#f8f9fa' }}>
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Caso Prático</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{p.enunciado}</p>
                  </div>

                  {/* Peça escrita */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Sua Peça</p>
                    <pre className="text-sm text-gray-700 leading-7 whitespace-pre-wrap font-mono p-4 rounded-xl overflow-x-auto"
                      style={{ background: '#f8f9fa' }}>
                      {p.resposta || <span className="text-gray-400 italic">Sem conteúdo salvo.</span>}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
