'use client'

import Link from 'next/link'
import { ArrowLeft, SearchX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { EstadoError } from '@/components/estado-error'
import { useLote } from '@/hooks/use-inventario'
import { formatFecha, type Lote } from '@/lib/inventario'
import { describirVencimiento, UnidadesValue, VencimientoBadge } from './estado-badges'

export function DetalleLote({ id }: { id: string }) {
  const { lote, error, isLoading, isValidating, mutate } = useLote(id)

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className={buttonVariants({ variant: 'ghost', size: 'sm', className: '-ml-2 self-start' })}
      >
        <ArrowLeft aria-hidden="true" />
        Volver al listado
      </Link>

      {isLoading ? (
        <DetalleSkeleton />
      ) : error?.status === 404 ? (
        <Empty className="rounded-xl border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Lote no encontrado</EmptyTitle>
            <EmptyDescription>
              No existe un lote con el identificador <code className="font-mono">{id}</code>.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/" className={buttonVariants({ variant: 'outline' })}>
              Ver todos los lotes
            </Link>
          </EmptyContent>
        </Empty>
      ) : error ? (
        <EstadoError
          titulo="No se pudo cargar el lote"
          mensaje={error.message}
          onReintentar={() => mutate()}
          reintentando={isValidating}
        />
      ) : lote ? (
        <FichaLote lote={lote} />
      ) : (
        <EstadoError titulo="Respuesta inesperada" mensaje="La API no devolvió los datos del lote." />
      )}
    </div>
  )
}

function FichaLote({ lote }: { lote: Lote }) {
  const extras = Object.entries(lote.extra)
  const detalleVencimiento = describirVencimiento(lote.fechaVencimiento)

  const datos: { label: string; value: React.ReactNode }[] = [
    { label: 'Código', value: <span className="font-mono">{lote.codigo}</span> },
    { label: 'Perfume', value: lote.perfume },
    { label: 'Marca', value: lote.marca ?? '—' },
    { label: 'Tamaño', value: lote.tamano ?? '—' },
    { label: 'Unidades disponibles', value: <UnidadesValue unidades={lote.unidades} /> },
    {
      label: 'Fecha de vencimiento',
      value: (
        <span className="flex flex-col gap-0.5">
          <span>{formatFecha(lote.fechaVencimiento, true)}</span>
          {detalleVencimiento ? (
            <span className="text-xs text-muted-foreground">{detalleVencimiento}</span>
          ) : null}
        </span>
      ),
    },
  ]

  return (
    <article aria-labelledby="titulo-lote" className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Lote {lote.codigo}
          </p>
          <h1 id="titulo-lote" className="font-serif text-4xl font-semibold tracking-tight text-balance">
            {lote.perfume}
          </h1>
          {lote.marca || lote.tamano ? (
            <p className="text-muted-foreground">{[lote.marca, lote.tamano].filter(Boolean).join(' · ')}</p>
          ) : null}
        </div>
        <VencimientoBadge fecha={lote.fechaVencimiento} className="h-6 self-start px-2.5 sm:self-end" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Unidades disponibles</p>
            <p className="font-serif text-4xl font-semibold">
              <UnidadesValue unidades={lote.unidades} />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Vencimiento</p>
            <p className="font-serif text-4xl font-semibold tabular-nums">{formatFecha(lote.fechaVencimiento)}</p>
            {detalleVencimiento ? <p className="text-xs text-muted-foreground">{detalleVencimiento}</p> : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del lote</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            {datos.map((dato) => (
              <div key={dato.label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm text-muted-foreground">{dato.label}</dt>
                <dd className="text-sm font-medium sm:col-span-2">{dato.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {extras.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Otros datos</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              {extras.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm break-words sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ) : null}
    </article>
  )
}

function DetalleSkeleton() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-6">
      <span className="sr-only">Cargando detalle del lote…</span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  )
}
