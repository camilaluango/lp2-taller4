import { Skeleton } from '@/components/ui/skeleton'

export function LotesSkeleton() {
  return (
    <div role="status" aria-live="polite" className="overflow-hidden rounded-xl border bg-card">
      <span className="sr-only">Cargando lotes…</span>
      <div className="hidden border-b bg-muted/50 px-4 py-3 md:block">
        <Skeleton className="h-4 w-1/2" />
      </div>
      <ul className="divide-y">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="flex items-center gap-4 px-4 py-4">
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-3 w-24 md:hidden" />
            </div>
            <Skeleton className="hidden h-4 w-24 md:block" />
            <Skeleton className="hidden h-4 w-16 md:block" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
