import type { Metadata } from 'next'
import { DetalleLote } from '@/components/lotes/detalle-lote'

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return { title: `Lote ${id}` }
}

export default async function LotePage({ params }: PageProps) {
  const { id } = await params
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <DetalleLote id={id} />
    </main>
  )
}
