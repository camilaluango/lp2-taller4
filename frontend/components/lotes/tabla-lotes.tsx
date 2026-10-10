import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatFecha, type Lote } from '@/lib/inventario'
import { UnidadesValue, VencimientoBadge } from './estado-badges'

export function TablaLotes({ lotes }: { lotes: Lote[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <caption className="sr-only">Listado de lotes del inventario</caption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-4">Código</TableHead>
              <TableHead>Perfume</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead className="text-right">Unidades disponibles</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead className="pr-4">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lotes.map((lote) => (
              <TableRow key={lote.id || lote.codigo} className="group relative">
                <TableCell className="pl-4 font-mono text-xs">
                  <Link
                    href={`/lotes/${encodeURIComponent(lote.id)}`}
                    className="outline-none after:absolute after:inset-0 focus-visible:underline"
                  >
                    {lote.codigo}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">{lote.perfume}</TableCell>
                <TableCell className="text-muted-foreground">{lote.marca ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">{lote.tamano ?? '—'}</TableCell>
                <TableCell className="text-right">
                  <UnidadesValue unidades={lote.unidades} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">{formatFecha(lote.fechaVencimiento)}</span>
                    <VencimientoBadge fecha={lote.fechaVencimiento} />
                  </div>
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <ChevronRight
                    className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden" aria-label="Listado de lotes del inventario">
        {lotes.map((lote) => (
          <li key={lote.id || lote.codigo}>
            <Link
              href={`/lotes/${encodeURIComponent(lote.id)}`}
              className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-mono text-xs text-muted-foreground">{lote.codigo}</span>
                  <span className="truncate font-medium">{lote.perfume}</span>
                  <span className="text-sm text-muted-foreground">
                    {[lote.marca, lote.tamano].filter(Boolean).join(' · ') || '—'}
                  </span>
                </div>
                <VencimientoBadge fecha={lote.fechaVencimiento} />
              </div>
              <dl className="grid grid-cols-2 gap-2 border-t pt-3 text-sm">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">Unidades</dt>
                  <dd>
                    <UnidadesValue unidades={lote.unidades} />
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">Vencimiento</dt>
                  <dd className="tabular-nums">{formatFecha(lote.fechaVencimiento)}</dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
