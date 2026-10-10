# Lenguaje de Programación 2 - Taller 4

![commits](https://badgen.net/github/commits/clubdecomputacion/lp2-taller4?icon=github) 
![last_commit](https://img.shields.io/github/last-commit/clubdecomputacion/lp2-taller4)

- ver [badgen](https://badgen.net/) o [shields](https://shields.io/) para otros tipos de _badges_

## Descripción del Proyecto

Sistema para consultar el inventario de una perfumería y controlar las existencias y fechas de vencimiento de sus lotes. El proyecto se enfoca en el inventario, no en las ventas.

El modelo tendrá dos entidades relacionadas:

- **Perfume:** identificador, nombre, marca y tamaño en mililitros.
- **Lote:** identificador, código, unidades disponibles y fecha de vencimiento. Cada lote pertenece a un perfume; un perfume puede tener varios lotes.

La API empezará con estos endpoints:

- `GET /lotes/?perfume_id=<id>`: listar lotes y, opcionalmente, filtrarlos por perfume.
- `GET /lotes/{id}`: consultar el detalle de un lote.
- `GET /perfumes/`: listar los perfumes.

La interfaz tiene una vista para listar y filtrar lotes y otra para ver el detalle de un lote. El sistema se construyó de forma incremental con PostgreSQL, FastAPI, un frontend diseñado en v0.app y Nginx como reverse proxy.

La API puede cargar algunos perfumes y lotes de ejemplo para facilitar las primeras pruebas. Dentro de Docker Compose se conecta a PostgreSQL usando el nombre del servicio `database`; desde el equipo local, PostgreSQL se publica temporalmente en el puerto `5433` porque el `5432` ya lo ocupa el Taller 3.

Para las pruebas previas al proxy, el frontend puede consultar la API en `http://localhost:8000`; la API permite solicitudes de lectura desde ese origen local. En la configuración final, Nginx publica el único puerto del sistema en `http://localhost:8080`: envía `/api/...` a la API y las demás rutas al frontend. PostgreSQL, la API y el frontend no publican puertos directamente al equipo anfitrión.

Los datos de ejemplo se cargan con `docker compose exec api python -m app.seed`. Para iniciar el sistema completo, ejecuta `docker compose up -d --build` desde la raíz del proyecto y abre `http://localhost:8080`.

## Proceso

Seguir las fases y verificaciones descritas en la [guía del taller](docs/GUIA.md).
