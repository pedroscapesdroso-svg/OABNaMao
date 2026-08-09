'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/simulado', label: '1ª Fase — Questões', icon: '📝' },
  { href: '/dashboard/segunda-fase', label: '2ª Fase — Peças', icon: '⚖️' },
  { href: '/dashboard/historico', label: 'Histórico', icon: '📋' },
  { href: '/dashboard/desempenho', label: 'Desempenho', icon: '📈' },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileAberta, setMobileAberta] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const NavConteudo = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#0070f3' }}>
            ⚖
          </div>
          <div>
            <p className="text-white font-bold leading-tight">OAB Na Mão</p>
            <p className="text-white/40 text-xs">Plataforma de Estudos</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(item => {
          const ativo = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileAberta(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: ativo ? '#0070f3' : 'transparent',
                color: ativo ? 'white' : 'rgba(255,255,255,0.65)',
              }}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sair */}
      <div className="p-3 border-t border-white/10">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 transition-all">
          <span className="text-base w-5 text-center">🚪</span>
          Sair
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── DESKTOP ── */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col h-full shadow-xl" style={{ background: '#333333' }}>
        <NavConteudo />
      </aside>

      {/* ── MOBILE: barra superior ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 shadow-md" style={{ background: '#333333' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: '#0070f3' }}>⚖</div>
          <span className="text-white font-bold text-sm">OAB Na Mão</span>
        </div>
        <button onClick={() => setMobileAberta(!mobileAberta)} className="text-white p-1">
          {mobileAberta ? '✕' : '☰'}
        </button>
      </div>

      {/* ── MOBILE: drawer ── */}
      {mobileAberta && (
        <>
          <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileAberta(false)} />
          <aside className="md:hidden fixed top-14 left-0 bottom-0 z-40 w-64 flex flex-col shadow-2xl" style={{ background: '#333333' }}>
            <NavConteudo />
          </aside>
        </>
      )}
    </>
  )
}
