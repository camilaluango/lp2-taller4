import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { diasParaVencer, estadoVencimiento, formatUnidades } from '@/lib/inventario'

const vencimientoStyles = {
  vencido: 'bg-destructive/10 text-destructive',
  'por-vencer': 'bg-warning text-warning-foreground',
  vigente: 'bg-success text-success-foreground',
  'sin-fecha': 'bg-muted text-muted-foreground',
} as const

const vencimientoLabels = {
  vencido: 'Vencido',
  'por-vencer': 'Por vencer',
  vigente: 'Vigente',
  'sin-fecha': 'Sin fecha',
} as const

export function VencimientoBadge({ fecha, className }: { fecha: string | null; className?: string }) {
  const estado = estadoVencimiento(fecha)
  return (
    <Badge variant="secondary" className={cn('font-medium', vencimientoStyles[estado], className)}>
      {vencimientoLabels[estado]}
    </Badge>
  )
}

export function describirVencimiento(fecha: string | null): string | null {
  const dias = diasParaVencer(fecha)
  if (dias === null) return null
  if (dias < 0) return `Venció hace ${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'día' : 'días'}`
  if (dias === 0) return 'Vence hoy'
  return `Vence en ${dias} ${dias === 1 ? 'día' : 'días'}`
}

export function UnidadesValue({ unidades }: { unidades: number | null }) {
  if (unidades === 0) {
    return (
      <span className="inline-flex items-center gap-2 tabular-nums">
        0
        <Badge variant="outline" className="text-muted-foreground">
          Agotado
        </Badge>
      </span>
    )
  }
  return <span className="tabular-nums">{formatUnidades(unidades)}</span>
}
