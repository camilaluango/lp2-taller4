# Inventario de Perfumería

Aplicación web (Next.js 16) **de solo consulta** para revisar el inventario de una perfumería. No incluye carrito, compras ni ventas.

## Funcionalidades

- Listado de lotes con **código, perfume, marca, tamaño, unidades disponibles y fecha de vencimiento**.
- Filtro por perfume (se refleja en la URL: `/?perfume_id=3`, así que se puede compartir).
- Página de detalle de cada lote (`/lotes/{id}`).
- Estados de carga (skeletons), errores con botón **Reintentar**, resultados vacíos y lote no encontrado (404).
- Indicador de vencimiento: *Vigente*, *Por vencer* (≤ 30 días), *Vencido* o *Sin fecha*.

## API esperada

| Endpoint | Uso |
| --- | --- |
| `GET /lotes/` | Listado de lotes. Acepta `?perfume_id=<id>` |
| `GET /lotes/{id}` | Detalle de un lote |
| `GET /perfumes/` | Catálogo de perfumes para el filtro |

Las respuestas pueden ser un arreglo o un objeto paginado (`results`, `items` o `data`). Los campos se normalizan de forma tolerante, por ejemplo:

- Código: `codigo`, `codigo_lote`, `code`
- Perfume: objeto anidado `perfume { nombre, marca, tamano }`, `perfume_nombre`, o `perfume_id` (se resuelve con `/perfumes/`)
- Tamaño: `tamano`, `tamaño`, `tamano_ml`, `volumen_ml`, `ml` (los números se muestran como `100 ml`)
- Unidades: `unidades_disponibles`, `unidades`, `cantidad`, `stock`
- Vencimiento: `fecha_vencimiento`, `vencimiento`, `fecha_caducidad`

La lógica de normalización está en `lib/inventario.ts` por si necesitas ajustarla a tu API.

## Configuración de la API

La URL base se toma de `NEXT_PUBLIC_API_URL`; si no está definida se usa `http://localhost:8000`.

```bash
cp .env.example .env.local
# edita NEXT_PUBLIC_API_URL si tu API está en otra dirección
```

- **Antes del proxy:** la API debe permitir CORS desde el origen de la app (p. ej. `http://localhost:3000`).
- **Con proxy en el mismo origen:** define `NEXT_PUBLIC_API_URL=` (vacía) y las peticiones irán a `/lotes/`, `/perfumes/`, etc. del mismo dominio.

> `NEXT_PUBLIC_API_URL` se incrusta en el JavaScript del navegador **al construir**. Si la cambias, vuelve a construir la app (o la imagen Docker).

## Ejecutar en local

Requisitos: Node.js 20.9+ y pnpm (`corepack enable`).

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Producción local:

```bash
pnpm build
pnpm start
```

## Docker

La imagen usa la salida `standalone` de Next.js en una construcción multietapa y se ejecuta con un usuario sin privilegios.

### Con Docker

```bash
# Construir (URL por defecto: http://localhost:8000)
docker build -t perfumeria-inventario .

# Construir apuntando a otra API
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.mi-perfumeria.com -t perfumeria-inventario .

# Construir para usar detrás de un proxy en el mismo origen
docker build --build-arg NEXT_PUBLIC_API_URL= -t perfumeria-inventario .

# Ejecutar
docker run --rm -p 3000:3000 perfumeria-inventario
```

Abre http://localhost:3000.

> La API se llama desde el **navegador**, no desde el contenedor. Por eso `http://localhost:8000` funciona si la API corre en tu máquina con el puerto 8000 publicado.

### Con Docker Compose

```bash
docker compose up --build
# o con otra API:
NEXT_PUBLIC_API_URL=https://api.mi-perfumeria.com docker compose up --build
```

## Estructura

```
app/
  page.tsx               # Listado de lotes
  lotes/[id]/page.tsx    # Detalle de lote
components/
  lotes/                 # Tabla, filtro, detalle, badges y skeletons
  estado-error.tsx       # Mensaje de error con reintento
hooks/use-inventario.ts  # Hooks SWR (lotes, lote, perfumes)
lib/api.ts               # Cliente HTTP y URL base
lib/inventario.ts        # Tipos y normalización de datos
```
