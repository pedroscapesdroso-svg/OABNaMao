'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/simulado', label: '1ª Fase — Questões', icon: '📝' },
  { href: '/dashboard/segunda-fase', label: '2ª Fase — Peças', icon: '⚖️' },
  { href: '/dashboard/historico', label: 'Histórico', icon: '📋' },
  { href: '/dashboard/desempenho', label: 'Desempenho', icon: '📈' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-full shadow-lg"
      style={{ background: '#333333' }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#0070f3' }}>
            ⚖
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">OAB Na Mão</p>
            <p className="text-white/50 text-xs">Plataforma de Estudos</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const ativo = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: ativo ? '#0070f3' : 'transparent',
                color: ativo ? 'white' : 'rgba(255,255,255,0.7)',
              }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Botão sair */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 transition-all"
        >
          <span>🚪</span>
          Sair
        </button>
      </div>
    </aside>
  )
}
