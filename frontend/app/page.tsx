import { Suspense } from 'react'
import { InventarioLotes } from '@/components/lotes/inventario-lotes'
import { LotesSkeleton } from '@/components/lotes/lotes-skeleton'

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <Suspense fallback={<LotesSkeleton />}>
        <InventarioLotes />
      </Suspense>
    </main>
  )
}
