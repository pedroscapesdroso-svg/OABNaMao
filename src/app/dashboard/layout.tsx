import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8f9fa' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header visível só no desktop */}
        <div className="hidden md:block">
          <Header />
        </div>
        {/* Espaço da barra mobile */}
        <div className="md:hidden h-14 flex-shrink-0" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
