# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Esteticar PWA

Premium mobile-first car wash booking app for the Mexican market.

### Architecture
- **Frontend**: `artifacts/esteticar` — React + Vite + Tailwind, port 22125
- **Backend**: `artifacts/api-server` — Express 5 + cookie-session auth, port 8080
- **DB schema**: `lib/db/src/schema/index.ts` — users, services, locations, timeslots, bookings
- **API client**: `lib/api-client-react` — Orval-generated hooks from `lib/api-spec/openapi.yaml`

### User Roles & Pages
- **Public**: Home, Services, Locations
- **Customer**: Home, Services, Locations, Book (5-step), Bookings, Profile
- **Provider**: ProviderHome (today's schedule + stats), ProviderSchedule
- **Admin**: AdminDashboard, AdminBookings, AdminLocations, AdminServices, AdminProviders

### Design System
- Colors: Navy #0A1628 (primary), Aqua #00B4D8 (secondary)
- Font: Plus Jakarta Sans
- Border radius: 16px
- Icons: react-icons/bs and react-icons/hi2 (NO Lucide)
- Animations: framer-motion
- Toasts: sonner

### Auth
- Cookie-session based (no JWT)
- Password: SHA-256 + "esteticar_salt"
- Admin: admin@esteticar.mx / admin123
- Provider: juan@esteticar.mx / washer123

### Booking Flow (5 steps)
- Step 0: Service selection
- Step 1: Date — monthly calendar with prev/next nav, past days disabled
- Step 2: Location — UnifiedMap (Google Maps or Leaflet) with GPS geolocation, sorts by Haversine distance, Esteticar custom branded pins
- Step 3: Timeslot
- Step 4: Confirm (auth gate)

### Maps
- `src/lib/esteticarPin.ts` — SVG teardrop pin generator (states: normal/selected/edit/new/deleting)
- `src/components/UnifiedMap.tsx` — auto-switches Google Maps ↔ Leaflet based on `VITE_GOOGLE_MAPS_API_KEY`
- To activate Google Maps: add `VITE_GOOGLE_MAPS_API_KEY=<your_key>` as environment secret

### Admin Mode Creator (AdminLocations)
- Map view with Mapa/Lista toggle
- "Modo creador" FAB: tap on map → places pending pin → form slides up → saves with lat/lng
- Tap existing pin → info panel → confirm delete

### Seed Data
- 9 locations in Cuernavaca/Morelos with lat/lng coordinates
- 3 services: Lavado Básico ($120), Camioneta ($180), Completo con Interiores ($800)
- 14 days of timeslots for all 9 locations
- Auto-seeds on startup if DB is empty (`autoSeed()` in api-server/src/seed.ts)
