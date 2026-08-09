'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RedefinirSenhaPage() {
  const [novaSenha, setNovaSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'erro' | 'ok'; texto: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password: novaSenha })

    if (error) {
      setMsg({ tipo: 'erro', texto: error.message })
    } else {
      setMsg({ tipo: 'ok', texto: 'Senha atualizada com sucesso!' })
      setTimeout(() => router.push('/dashboard'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#f8f9fa' }}>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: '#0070f3' }}>
          🔒
        </div>
        <h1 className="text-xl font-bold mb-1" style={{ color: '#333' }}>Nova senha</h1>
        <p className="text-sm text-gray-500 mb-6">Escolha uma nova senha para sua conta.</p>

        {msg && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${msg.tipo === 'erro' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {msg.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50"
            style={{ background: '#0070f3' }}>
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
