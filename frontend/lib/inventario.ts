type RawRecord = Record<string, unknown>

export type Perfume = {
  id: string
  nombre: string
  marca: string | null
  tamano: string | null
}

export type Lote = {
  id: string
  codigo: string
  perfumeId: string | null
  perfume: string
  marca: string | null
  tamano: string | null
  unidades: number | null
  fechaVencimiento: string | null
  extra: Record<string, string>
}

export type EstadoVencimiento = 'vencido' | 'por-vencer' | 'vigente' | 'sin-fecha'

export const DIAS_AVISO_VENCIMIENTO = 90

const CODIGO_KEYS = ['codigo', 'código', 'codigo_lote', 'numero_lote', 'num_lote', 'code', 'lote']
const NOMBRE_KEYS = ['nombre', 'name', 'perfume_nombre', 'nombre_perfume', 'titulo']
const PERFUME_NOMBRE_KEYS = ['perfume_nombre', 'nombre_perfume', 'perfume_name']
const PERFUME_ID_KEYS = ['perfume_id', 'perfumeId', 'id_perfume']
const MARCA_KEYS = ['marca', 'marca_nombre', 'nombre_marca', 'brand']
const TAMANO_KEYS = [
  'tamano',
  'tamaño',
  'tamano_ml',
  'tamaño_ml',
  'volumen',
  'volumen_ml',
  'contenido_ml',
  'ml',
  'size',
  'presentacion',
]
const UNIDADES_KEYS = [
  'unidades_disponibles',
  'unidades',
  'cantidad_disponible',
  'cantidad',
  'stock',
  'existencias',
]
const FECHA_KEYS = [
  'fecha_vencimiento',
  'vencimiento',
  'fecha_caducidad',
  'caducidad',
  'fecha_expiracion',
  'expiracion',
]

const LOTE_KNOWN_KEYS = new Set([
  'id',
  'pk',
  'perfume',
  ...CODIGO_KEYS,
  ...PERFUME_NOMBRE_KEYS,
  ...PERFUME_ID_KEYS,
  ...MARCA_KEYS,
  ...TAMANO_KEYS,
  ...UNIDADES_KEYS,
  ...FECHA_KEYS,
])

function isRecord(value: unknown): value is RawRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function pick(obj: RawRecord, keys: string[]): { key: string; value: unknown } | null {
  for (const key of keys) {
    const value = obj[key]
    if (value !== undefined && value !== null && value !== '') return { key, value }
  }
  return null
}

function asText(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (isRecord(value)) {
    const nested = pick(value, ['nombre', 'name', 'descripcion'])
    return nested ? asText(nested.value) : null
  }
  return null
}

function asId(value: unknown): string | null {
  if (typeof value === 'number' || typeof value === 'string') return String(value)
  return null
}

function formatTamano(found: { key: string; value: unknown } | null): string | null {
  if (!found) return null
  const { value } = found
  const numeric = typeof value === 'number' ? value : Number(value)
  if (typeof value !== 'boolean' && value !== '' && Number.isFinite(numeric)) {
    return `${numeric.toLocaleString('es')} ml`
  }
  return asText(value)
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value)
  }
  return null
}

export function toList(data: unknown): RawRecord[] {
  if (Array.isArray(data)) return data.filter(isRecord)
  if (isRecord(data)) {
    const nested = pick(data, ['results', 'items', 'data', 'lotes', 'perfumes'])
    if (nested && Array.isArray(nested.value)) return nested.value.filter(isRecord)
  }
  return []
}

export function normalizePerfume(raw: RawRecord): Perfume {
  const id = asId(raw.id ?? raw.pk) ?? ''
  return {
    id,
    nombre: asText(pick(raw, NOMBRE_KEYS)?.value) ?? `Perfume ${id}`,
    marca: asText(pick(raw, MARCA_KEYS)?.value),
    tamano: formatTamano(pick(raw, TAMANO_KEYS)),
  }
}

function humanizeKey(key: string): string {
  const text = key.replace(/[_-]+/g, ' ').trim()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function normalizeLote(raw: RawRecord, perfumes?: Map<string, Perfume>): Lote {
  const id = asId(raw.id ?? raw.pk) ?? ''
  const perfumeField = raw.perfume
  const perfumeRecord = isRecord(perfumeField) ? normalizePerfume(perfumeField) : null

  const perfumeId =
    perfumeRecord?.id ||
    asId(pick(raw, PERFUME_ID_KEYS)?.value) ||
    (typeof perfumeField === 'number' ||
    (typeof perfumeField === 'string' && perfumes?.has(perfumeField))
      ? String(perfumeField)
      : null)

  const fromCatalog = perfumeId ? perfumes?.get(perfumeId) : undefined
  const perfumeName =
    perfumeRecord?.nombre ??
    asText(pick(raw, PERFUME_NOMBRE_KEYS)?.value) ??
    (typeof perfumeField === 'string' && !fromCatalog ? perfumeField : null) ??
    fromCatalog?.nombre ??
    'Perfume sin nombre'

  const extra: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (LOTE_KNOWN_KEYS.has(key)) continue
    const text = typeof value === 'object' && value !== null ? null : asText(value)
    if (text !== null) extra[humanizeKey(key)] = text
  }

  return {
    id,
    codigo: asText(pick(raw, CODIGO_KEYS)?.value) ?? `#${id}`,
    perfumeId,
    perfume: perfumeName,
    marca:
      asText(pick(raw, MARCA_KEYS)?.value) ?? perfumeRecord?.marca ?? fromCatalog?.marca ?? null,
    tamano:
      formatTamano(pick(raw, TAMANO_KEYS)) ?? perfumeRecord?.tamano ?? fromCatalog?.tamano ?? null,
    unidades: asNumber(pick(raw, UNIDADES_KEYS)?.value),
    fechaVencimiento: asText(pick(raw, FECHA_KEYS)?.value),
    extra,
  }
}

function parseFecha(value: string): Date | null {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const fechaFormatter = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const fechaLargaFormatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatFecha(value: string | null, larga = false): string {
  if (!value) return 'Sin fecha'
  const date = parseFecha(value)
  if (!date) return value
  return (larga ? fechaLargaFormatter : fechaFormatter).format(date)
}

export function diasParaVencer(value: string | null): number | null {
  if (!value) return null
  const date = parseFecha(value)
  if (!date) return null
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const objetivo = new Date(date)
  objetivo.setHours(0, 0, 0, 0)
  return Math.round((objetivo.getTime() - hoy.getTime()) / 86_400_000)
}

export function estadoVencimiento(value: string | null): EstadoVencimiento {
  const dias = diasParaVencer(value)
  if (dias === null) return 'sin-fecha'
  if (dias < 0) return 'vencido'
  if (dias <= DIAS_AVISO_VENCIMIENTO) return 'por-vencer'
  return 'vigente'
}

export function formatUnidades(value: number | null): string {
  return value === null ? '—' : value.toLocaleString('es')
}
