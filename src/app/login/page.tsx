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

          {/* Divider */}
          {modo !== 'recuperar' && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Botão Google */}
              <button
                onClick={async () => {
                  setLoading(true)
                  await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: `${window.location.origin}/dashboard` },
                  })
                }}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border hover:bg-gray-50 transition-colors disabled:opacity-50"
                style={{ borderColor: '#e5e7eb', color: '#333' }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continuar com Google
              </button>
            </>
          )}

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
