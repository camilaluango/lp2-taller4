'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Perfume } from '@/lib/inventario'

type FiltroPerfumeProps = {
  perfumes: Perfume[]
  value: string | null
  onChange: (perfumeId: string | null) => void
  isLoading: boolean
  hasError: boolean
}

const TODOS = '__todos__'

export function FiltroPerfume({ perfumes, value, onChange, isLoading, hasError }: FiltroPerfumeProps) {
  const items = [
    { value: TODOS, label: 'Todos los perfumes' },
    ...perfumes.map((p) => ({
      value: p.id,
      label: p.marca ? `${p.nombre} · ${p.marca}` : p.nombre,
    })),
  ]

  if (value && !items.some((item) => item.value === value)) {
    items.push({ value, label: `Perfume #${value}` })
  }

  const placeholder = isLoading
    ? 'Cargando perfumes…'
    : hasError
      ? 'Perfumes no disponibles'
      : 'Todos los perfumes'

  return (
    <div className="flex flex-col gap-1.5">
      <label id="filtro-perfume-label" className="text-sm font-medium">
        Filtrar por perfume
      </label>
      <div className="flex items-center gap-2">
        <Select
          items={items}
          value={value ?? TODOS}
          onValueChange={(next) => onChange(!next || next === TODOS ? null : String(next))}
          disabled={isLoading || hasError}
        >
          <SelectTrigger aria-labelledby="filtro-perfume-label" className="h-9 w-full bg-card sm:w-72">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {value ? (
          <Button variant="ghost" size="icon" onClick={() => onChange(null)} aria-label="Quitar filtro">
            <X aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
