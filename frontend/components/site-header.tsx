import Link from 'next/link'
import { API_URL } from '@/lib/api'

export function SiteHeader() {
  return (
    <header className="border-b bg-card/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-serif text-2xl font-semibold tracking-tight">Perfumería</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inventario</span>
        </Link>
        <p className="hidden truncate text-xs text-muted-foreground sm:block" title={API_URL || 'Mismo origen'}>
          {'API: '}
          <code className="font-mono">{API_URL || 'mismo origen'}</code>
        </p>
      </div>
    </header>
  )
}
