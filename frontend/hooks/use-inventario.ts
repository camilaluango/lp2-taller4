'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import { apiFetcher, type ApiError } from '@/lib/api'
import { normalizeLote, normalizePerfume, toList, type Perfume } from '@/lib/inventario'

const swrOptions = { revalidateOnFocus: false, shouldRetryOnError: false }

export function usePerfumes() {
  const { data, error, isLoading, mutate } = useSWR<unknown, ApiError>(
    '/perfumes/',
    apiFetcher,
    swrOptions,
  )

  const perfumes = useMemo(
    () =>
      toList(data)
        .map(normalizePerfume)
        .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
    [data],
  )
  const perfumesById = useMemo(() => new Map<string, Perfume>(perfumes.map((p) => [p.id, p])), [perfumes])

  return { perfumes, perfumesById, error, isLoading, mutate }
}

export function useLotes(perfumeId: string | null) {
  const key = perfumeId ? `/lotes/?perfume_id=${encodeURIComponent(perfumeId)}` : '/lotes/'
  const { perfumesById } = usePerfumes()
  const { data, error, isLoading, isValidating, mutate } = useSWR<unknown, ApiError>(
    key,
    apiFetcher,
    swrOptions,
  )

  const lotes = useMemo(
    () => toList(data).map((raw) => normalizeLote(raw, perfumesById)),
    [data, perfumesById],
  )

  return { lotes, error, isLoading, isValidating, mutate }
}

export function useLote(id: string) {
  const { perfumesById, error: perfumesError, mutate: mutatePerfumes } = usePerfumes()
  const { data, error, isLoading, isValidating, mutate: mutateLote } = useSWR<unknown, ApiError>(
    `/lotes/${encodeURIComponent(id)}`,
    apiFetcher,
    swrOptions,
  )

  const lote = useMemo(() => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null
    return normalizeLote(data as Record<string, unknown>, perfumesById)
  }, [data, perfumesById])

  const mutate = () => Promise.all([mutateLote(), perfumesError ? mutatePerfumes() : undefined])

  return { lote, error, isLoading, isValidating, mutate }
}
