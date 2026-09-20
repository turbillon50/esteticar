# Esteticar

Demo navegable de autolavado a domicilio en Morelos para Sergio Zapata (Cuernavaca).

- Next.js 16 + TypeScript + Tailwind v4 + Zustand + Leaflet/OSM
- Sin auth, sin DB, sin cobros reales
- Flujo: Servicio → Fecha → Sucursal → Horario → Pago → folio
- Sucursales ordenadas por **tiempo de traslado**, no por km
- Fuera de Morelos se ancla a Cuernavaca centro (`src/lib/geo.ts`)

Precios con IVA: básico $120 · camioneta $180 · completo $800.

Rama de despliegue: `rearme-sep-2026`. No tocar `main`.
