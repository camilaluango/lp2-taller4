'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { EstadoError } from '@/components/estado-error'
import { useLotes, usePerfumes } from '@/hooks/use-inventario'
import { estadoVencimiento } from '@/lib/inventario'
import { FiltroPerfume } from './filtro-perfume'
import { LotesSkeleton } from './lotes-skeleton'
import { TablaLotes } from './tabla-lotes'

export function InventarioLotes() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const perfumeId = searchParams.get('perfume_id')

  const perfumesQuery = usePerfumes()
  const lotesQuery = useLotes(perfumeId)
  const { lotes } = lotesQuery

  const setPerfume = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (id) params.set('perfume_id', id)
      else params.delete('perfume_id')
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const resumen = useMemo(
    () => ({
      unidades: lotes.reduce((total, lote) => total + (lote.unidades ?? 0), 0),
      porVencer: lotes.filter((lote) => estadoVencimiento(lote.fechaVencimiento) === 'por-vencer').length,
      vencidos: lotes.filter((lote) => estadoVencimiento(lote.fechaVencimiento) === 'vencido').length,
    }),
    [lotes],
  )

  const perfumeSeleccionado = perfumeId ? perfumesQuery.perfumesById.get(perfumeId) : undefined

  return (
    <section aria-labelledby="titulo-lotes" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 id="titulo-lotes" className="font-serif text-4xl font-semibold tracking-tight text-balance">
            Lotes en inventario
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Consulta las existencias por lote, sus unidades disponibles y fechas de vencimiento.
          </p>
        </div>
        <FiltroPerfume
          perfumes={perfumesQuery.perfumes}
          value={perfumeId}
          onChange={setPerfume}
          isLoading={perfumesQuery.isLoading}
          hasError={Boolean(perfumesQuery.error)}
        />
      </div>

      {perfumesQuery.error ? (
        <EstadoError
          titulo="No se pudo cargar el catálogo de perfumes"
          mensaje={`${perfumesQuery.error.message} El filtro no estará disponible hasta que se recupere.`}
          onReintentar={() => perfumesQuery.mutate()}
        />
      ) : null}

      {lotesQuery.isLoading ? (
        <LotesSkeleton />
      ) : lotesQuery.error ? (
        <EstadoError
          titulo="No se pudieron cargar los lotes"
          mensaje={lotesQuery.error.message}
          onReintentar={() => lotesQuery.mutate()}
          reintentando={lotesQuery.isValidating}
        />
      ) : lotes.length === 0 ? (
        <Empty className="rounded-xl border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageSearch aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{perfumeId ? 'Sin lotes para este perfume' : 'No hay lotes registrados'}</EmptyTitle>
            <EmptyDescription>
              {perfumeId
                ? `No se encontraron lotes${perfumeSeleccionado ? ` de ${perfumeSeleccionado.nombre}` : ''}. Prueba con otro perfume o quita el filtro.`
                : 'Cuando se registren lotes en el inventario aparecerán en este listado.'}
            </EmptyDescription>
          </EmptyHeader>
          {perfumeId ? (
            <EmptyContent>
              <Button variant="outline" onClick={() => setPerfume(null)}>
                Ver todos los lotes
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-medium text-foreground">{lotes.length.toLocaleString('es')}</span>
            {lotes.length === 1 ? ' lote' : ' lotes'}
            {' · '}
            <span className="font-medium text-foreground">{resumen.unidades.toLocaleString('es')}</span>
            {' unidades'}
            {resumen.porVencer > 0 ? ` · ${resumen.porVencer} por vencer` : ''}
            {resumen.vencidos > 0 ? ` · ${resumen.vencidos} ${resumen.vencidos === 1 ? 'vencido' : 'vencidos'}` : ''}
          </p>
          <TablaLotes lotes={lotes} />
        </div>
      )}
    </section>
  )
}
