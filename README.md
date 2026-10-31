# MiniPOS

Sistema de punto de venta para supermercados y negocios de barrio. El frontend habla directo con Supabase (Postgres, Auth y Storage); la seguridad se aplica con RLS y la logica de ventas vive en funciones de Postgres.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, framer-motion
- Supabase (`@supabase/supabase-js` y `@supabase/ssr`), jsPDF (tickets e informes en PDF)

## Funcionalidades

- Punto de venta con carrito, control de stock y ticket PDF
- Inventario de productos y proveedores
- Historial de ventas con detalle y edicion
- Dashboard, balance mensual y control de gastos
- Notificaciones de stock bajo y tema claro/oscuro

## Puesta en marcha

1. Instalar dependencias:

```bash
npm install
```

2. Crear el archivo `.env.local` a partir de la plantilla:

```bash
cp .env.example .env.local
```

3. Completar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` con los datos del proyecto en Supabase (Project Settings, API Keys).

4. Levantar el servidor de desarrollo:

```bash
npm run dev
```

La aplicacion queda disponible en http://localhost:3000.

## Variables de entorno

| Variable | Descripcion |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave publica (publishable). Es segura en el navegador porque los datos los protege RLS. |

## Scripts

| Comando | Accion |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Servidor de produccion |
| `npm run lint` | Linter |

## Base de datos

- Esquema y relaciones: [docs/esquema-bd.md](docs/esquema-bd.md)
- Migraciones SQL: `supabase/migrations/`
- Tipos generados: `types/database.types.ts` (regenerar cuando cambie el esquema)
