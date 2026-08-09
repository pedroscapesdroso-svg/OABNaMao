'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [modo, setModo] = useState<'login' | 'cadastro' | 'recuperar'>('login')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'erro' | 'ok'; texto: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setMsg({ tipo: 'erro', texto: 'Email ou senha incorretos.' })
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signUp({ email, password: senha })

    if (error) {
      setMsg({ tipo: 'erro', texto: error.message })
    } else {
      setMsg({ tipo: 'ok', texto: 'Conta criada! Verifique seu email para confirmar.' })
    }
    setLoading(false)
  }

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    if (error) {
      setMsg({ tipo: 'erro', texto: error.message })
    } else {
      setMsg({ tipo: 'ok', texto: 'Email de recuperação enviado! Verifique sua caixa de entrada.' })
    }
    setLoading(false)
  }

  const submit = modo === 'login' ? handleLogin : modo === 'cadastro' ? handleCadastro : handleRecuperar

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)' }}>
      
      {/* Lado esquerdo - branding */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: '#0070f3' }}>
            <span className="text-4xl font-bold">⚖</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">OAB Na Mão</h1>
          <p className="text-xl opacity-80 mb-8">Plataforma de estudos para o Exame da OAB</p>
          
          <div className="space-y-4 text-left">
            {['Questões dos últimos 4 anos de prova', 'Filtre por matéria: Civil, Penal, Tributário...', 'Acompanhe seus acertos e erros', 'Dashboard com seu progresso'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#28a745' }}>
                  <span className="text-xs">✓</span>
                </div>
                <span className="opacity-90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado direito - formulário */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white lg:max-w-md lg:rounded-l-3xl">
        <div className="w-full max-w-sm">
          
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#0070f3' }}>
              <span className="text-3xl">⚖</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#333' }}>OAB Na Mão</h1>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: '#333' }}>
            {modo === 'login' ? 'Bem-vindo de volta!' : modo === 'cadastro' ? 'Criar conta' : 'Recuperar senha'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {modo === 'login' ? 'Entre na sua conta para continuar.' : modo === 'cadastro' ? 'Comece a estudar de graça.' : 'Enviaremos um link por email.'}
          </p>

          {/* Alerta de feedback */}
          {msg && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${msg.tipo === 'erro' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {msg.texto}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {modo !== 'recuperar' && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-sm"
                />
              </div>
            )}

            {modo === 'login' && (
              <div className="text-right">
                <button type="button" onClick={() => { setModo('recuperar'); setMsg(null) }} className="text-sm hover:underline" style={{ color: '#0070f3' }}>
                  Esqueci minha senha
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: '#0070f3' }}
            >
              {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar' : modo === 'cadastro' ? 'Criar conta' : 'Enviar email'}
            </button>
          </form>

          {/* Alternar entre login e cadastro */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {modo === 'login' ? (
              <>Não tem conta?{' '}
                <button onClick={() => { setModo('cadastro'); setMsg(null) }} className="font-semibold hover:underline" style={{ color: '#0070f3' }}>
                  Cadastre-se grátis
                </button>
              </>
            ) : (
              <>Já tem conta?{' '}
                <button onClick={() => { setModo('login'); setMsg(null) }} className="font-semibold hover:underline" style={{ color: '#0070f3' }}>
                  Entrar
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
