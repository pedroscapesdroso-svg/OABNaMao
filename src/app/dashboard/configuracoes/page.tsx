'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const [geminiKey, setGeminiKey] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)
  const [temChave, setTemChave] = useState(false)
  const [mostrarChave, setMostrarChave] = useState(false)

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('gemini_api_key').eq('id', user.id).single()
      if (data?.gemini_api_key) setTemChave(true)
    }
    carregar()
  }, [])

  const salvar = async () => {
    setSalvando(true)
    setMsg(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      gemini_api_key: geminiKey,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      setMsg({ tipo: 'erro', texto: 'Erro ao salvar. Tente novamente.' })
    } else {
      setMsg({ tipo: 'ok', texto: 'Chave salva com sucesso! Agora você pode usar o Gemini na 2ª Fase.' })
      setTemChave(true)
      setGeminiKey('')
    }
    setSalvando(false)
  }

  const remover = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, gemini_api_key: null })
    setTemChave(false)
    setMsg({ tipo: 'ok', texto: 'Chave removida.' })
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#333' }}>Configurações</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie sua conta e integrações.</p>
      </div>

      {/* Card Gemini */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #4285f4, #34a853)' }}>
            ✨
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#333' }}>Google Gemini</p>
            <p className="text-xs text-gray-400">Usado para corrigir suas peças da 2ª fase</p>
          </div>
          {temChave && (
            <span className="ml-auto text-xs px-2 py-1 rounded-full font-semibold" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              ✓ Configurado
            </span>
          )}
        </div>

        {msg && (
          <div className={`p-3 rounded-xl text-sm mb-4 ${msg.tipo === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg.texto}
          </div>
        )}

        {/* Como obter a chave */}
        <div className="p-3 rounded-xl mb-4 text-xs text-blue-700" style={{ background: '#eff6ff' }}>
          <p className="font-semibold mb-1">Como obter sua chave gratuita:</p>
          <ol className="space-y-0.5 list-decimal list-inside">
            <li>Acesse <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">aistudio.google.com</a></li>
            <li>Clique em <strong>Get API Key</strong> → <strong>Create API Key</strong></li>
            <li>Copie a chave e cole abaixo</li>
          </ol>
          <p className="mt-1 text-blue-500">A chave é gratuita e inclui cota generosa para uso pessoal.</p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={mostrarChave ? 'text' : 'password'}
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              placeholder={temChave ? '••••••••••••••••••••• (chave já salva)' : 'AIza...'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm pr-20"
            />
            <button onClick={() => setMostrarChave(!mostrarChave)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
              {mostrarChave ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <div className="flex gap-3">
            <button onClick={salvar} disabled={salvando || geminiKey.trim() === ''}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
              style={{ background: '#0070f3' }}>
              {salvando ? 'Salvando...' : 'Salvar chave'}
            </button>
            {temChave && (
              <button onClick={remover}
                className="px-4 py-3 rounded-xl text-sm font-medium border border-red-200 text-red-500 hover:bg-red-50">
                Remover
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          🔒 Sua chave é armazenada na sua conta e nunca é compartilhada com outros usuários.
        </p>
      </div>
    </div>
  )
}
