import { Suspense } from 'react'
import SimuladoConteudo from './SimuladoConteudo'

export default function SimuladoPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    }>
      <SimuladoConteudo />
    </Suspense>
  )
}
