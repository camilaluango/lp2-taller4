'use client'

import { AlertCircle, RotateCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type EstadoErrorProps = {
  titulo: string
  mensaje?: string
  onReintentar?: () => void
  reintentando?: boolean
}

export function EstadoError({ titulo, mensaje, onReintentar, reintentando }: EstadoErrorProps) {
  return (
    <Alert variant="destructive" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <AlertTitle>{titulo}</AlertTitle>
          {mensaje ? <AlertDescription>{mensaje}</AlertDescription> : null}
        </div>
      </div>
      {onReintentar ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onReintentar}
          disabled={reintentando}
          className="shrink-0 self-start sm:self-center"
        >
          <RotateCw className={reintentando ? 'animate-spin' : undefined} aria-hidden="true" />
          {reintentando ? 'Reintentando…' : 'Reintentar'}
        </Button>
      ) : null}
    </Alert>
  )
}
