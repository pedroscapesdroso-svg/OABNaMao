'use client'

import { useState } from 'react'
import { VADE_MECUM_COMPLETO } from '@/lib/vade'

interface Props {
  onFechar: () => void
  fullscreen?: boolean
}

export default function VadeMecum({ onFechar, fullscreen }: Props) {
  const [leiAtiva, setLeiAtiva] = useState(0)
  const [busca, setBusca] = useState('')
  const [secaoAberta, setSecaoAberta] = useState<string | null>(null)

  const lei = VADE_MECUM_COMPLETO[leiAtiva]

  const secoesFiltradas = lei.secoes.map(s => ({
    ...s,
    artigos: s.artigos.filter(a =>
      busca === '' ||
      a.numero.toLowerCase().includes(busca.toLowerCase()) ||
      a.texto.toLowerCase().includes(busca.toLowerCase())
    ),
  })).filter(s => s.artigos.length > 0)

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200" style={{ background: '#333' }}>
        <div>
          <p className="text-white font-bold">📚 Vade Mecum</p>
          <p className="text-white/60 text-xs">{lei.nome}</p>
        </div>
        <button onClick={onFechar} className="text-white/70 hover:text-white text-xl font-light transition-colors">✕</button>
      </div>

      {/* Abas das leis */}
      <div className="flex gap-1 px-3 py-2 border-b border-gray-200 overflow-x-auto bg-gray-50 flex-shrink-0">
        {VADE_MECUM_COMPLETO.map((l, i) => (
          <button key={l.sigla} onClick={() => { setLeiAtiva(i); setBusca(''); setSecaoAberta(null) }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 border"
            style={{
              background: leiAtiva === i ? '#333' : 'white',
              color: leiAtiva === i ? 'white' : '#555',
              borderColor: leiAtiva === i ? '#333' : '#e5e7eb',
            }}>
            {l.sigla}
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <input
          type="text"
          value={busca}
          onChange={e => { setBusca(e.target.value); setSecaoAberta(null) }}
          placeholder={`Buscar em ${lei.sigla}...`}
          className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto">
        {secoesFiltradas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">Nenhum resultado para &ldquo;{busca}&rdquo;</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {secoesFiltradas.map(secao => {
              const aberta = busca !== '' || secaoAberta === secao.titulo
              return (
                <div key={secao.titulo}>
                  {/* Header da seção */}
                  <button
                    onClick={() => setSecaoAberta(aberta && busca === '' ? null : secao.titulo)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#0070f3' }}>
                      {secao.titulo}
                    </span>
                    <span className="text-gray-400 text-xs">{aberta ? '▲' : '▼'} {secao.artigos.length} art.</span>
                  </button>

                  {/* Artigos */}
                  {aberta && (
                    <div className="px-4 pb-3 space-y-2">
                      {secao.artigos.map(artigo => (
                        <div key={artigo.numero} className="rounded-xl p-3 border border-gray-100 hover:border-blue-200 transition-colors"
                          style={{ background: '#f8f9fa' }}>
                          <p className="text-xs font-bold mb-1" style={{ color: '#333' }}>{artigo.numero}</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{artigo.texto}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
