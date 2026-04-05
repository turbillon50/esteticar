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

### Seed Data
- 3 services: Lavado Básico ($120), Camioneta ($180), Detailing ($350)
- 3 locations: Polanco, Santa Fe, Monterrey
- Timeslots seeded for location 1 and 2 only (3 days)
