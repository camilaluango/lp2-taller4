// `??` (not `||`) so an explicitly empty value yields same-origin relative URLs behind a proxy.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '/api').replace(/\/+$/, '')

export class ApiError extends Error {
  status: number | null

  constructor(message: string, status: number | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetcher<T = unknown>(path: string): Promise<T> {
  const url = `${API_URL}${path}`
  let response: Response

  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch {
    throw new ApiError(
      `No se pudo conectar con la API (${API_URL || 'mismo origen'}). Verifica que el servicio esté en ejecución y permita solicitudes desde este sitio (CORS).`,
      null,
    )
  }

  if (!response.ok) {
    const message =
      response.status === 404
        ? 'El recurso solicitado no existe.'
        : `La API respondió con un error (${response.status}).`
    throw new ApiError(message, response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('La API devolvió una respuesta que no es JSON válido.', response.status)
  }
}
