# Online Shops Management System - AI Coding Instructions

## Architecture Overview

This is a **multi-vendor e-commerce platform** (Alibaba-like) with two main projects:

| Project | Stack | Port | Purpose |
|---------|-------|------|---------|
| `onlineshop-ui/` | TanStack Start + React 19 + Vite 7 | 3000 | Frontend with SSR |
| `onlineshops-api/` | NestJS 11 | 3001 | REST API backend |

**Key stakeholders**: Shoppers, Shop Owners, Suppliers, Admins — each with role-based dashboards.

## Developer Workflow

### Running the Project
```bash
# Frontend (Terminal 1)
cd onlineshop-ui && pnpm dev      # Runs on :3000

# Backend (Terminal 2)  
cd onlineshops-api && pnpm start:dev   # Runs on :3001 (watch mode)
```

### Testing
```bash
# Frontend (Vitest)
cd onlineshop-ui && pnpm test

# Backend (Jest)
cd onlineshops-api && pnpm test           # Unit tests
cd onlineshops-api && pnpm test:e2e       # E2E tests
```

### Code Quality
```bash
pnpm check   # Runs prettier + eslint fix (both projects)
```

## Frontend Conventions (`onlineshop-ui/`)

### File-Based Routing (TanStack Router)
- Routes live in `src/routes/` — file structure = URL structure
- Root layout: [__root.tsx](onlineshop-ui/src/routes/__root.tsx) wraps all pages
- Create new routes by adding `.tsx` files (auto-generated route types)

### Component Patterns
- **UI primitives**: Use Shadcn components in `src/components/ui/`
- **Install new Shadcn components**: `pnpm dlx shadcn@latest add <component>`
- **Path alias**: Use `@/` for imports from `src/` (configured in vite.config.ts)

### State Management
- **TanStack Store** for global state (see `src/lib/demo-store.ts`)
- **TanStack Form** for form handling with Zod validation

### Authentication
- **Better Auth** handles auth on frontend (`src/lib/auth-client.ts`)
- Auth API routes: `src/routes/api/auth/$.ts`
- User header component: `src/integrations/better-auth/header-user.tsx`

## Backend Conventions (`onlineshops-api/`)

### NestJS Module Pattern
The planned structure follows NestJS modules per feature:
```
src/modules/
├── auth/       # JWT + Passport.js
├── users/      # User management
├── shops/      # Shop CRUD
├── products/   # Product catalog
├── orders/     # Order lifecycle
├── cart/       # Shopping cart
├── suppliers/  # B2B supplier network
└── analytics/  # Reporting
```

### Database
- **TypeORM** with PostgreSQL (connection via `DATABASE_URL`)
- Entities in `src/database/entities/`
- Migrations in `src/database/migrations/`

### API Response Pattern
All endpoints should follow REST conventions under `/api/` prefix.

## Key Integration Points

1. **Frontend ↔ Backend**: Frontend calls `VITE_API_URL` (default: `http://localhost:3001/api`)
2. **Auth flow**: Better Auth (frontend) ↔ Passport.js + JWT (backend)
3. **Role-based access**: `UserRole` enum: `shopper`, `shop_owner`, `supplier`, `admin`

## Important Files to Know

| File | Purpose |
|------|---------|
| `onlineshop-ui/src/routes/__root.tsx` | App shell, devtools, global layout |
| `onlineshop-ui/src/lib/auth.ts` | Better Auth server config |
| `onlineshop-ui/vite.config.ts` | Vite + TanStack Start + React Compiler |
| `onlineshops-api/src/app.module.ts` | NestJS root module |
| `README.md` (root) | Full system design, DB schema, API specs |

## React Best Practices (`onlineshop-ui/`)

- **Functional components only** — no class components
- **Use React 19 features**: `use()` hook for promises, Actions, `useOptimistic`, `useFormStatus`
- **Prefer server functions** where possible (TanStack Start SSR)
- **Colocation**: Keep components, hooks, and utilities close to where they're used
- **Custom hooks**: Extract reusable logic into `src/hooks/` with `use` prefix
- **Memoization**: Let React Compiler handle it — avoid manual `useMemo`/`useCallback`
- **Forms**: Use TanStack Form + Zod for validation (see `src/hooks/demo.form.ts`)
- **Data fetching**: Use TanStack Router loaders for route data, TanStack Query for mutations
- **Error boundaries**: Wrap route components to catch rendering errors
- **Accessibility**: Use Shadcn components (built on Radix UI) for a11y compliance

## API Best Practices (`onlineshops-api/`)

- **DTOs for all endpoints**: Use `class-validator` decorators for request validation
- **Consistent response format**: `{ data, message, statusCode }` or `{ error, message, statusCode }`
- **HTTP status codes**: Use appropriate codes (201 for create, 204 for delete, 400/422 for validation)
- **Guards for auth**: Use `@UseGuards(JwtAuthGuard)` and role-based guards
- **Exception filters**: Throw `HttpException` or use built-in exceptions (`NotFoundException`, etc.)
- **Swagger documentation**: Decorate controllers with `@ApiTags`, `@ApiOperation`, `@ApiResponse`
- **Pagination**: Return `{ items, total, page, limit }` for list endpoints
- **Naming**: Use plural nouns for resources (`/api/products`, not `/api/product`)
- **Versioning**: Prefix with `/api/v1/` when breaking changes are needed

## Code Style Notes

- **Package manager**: pnpm (not npm/yarn)
- **TypeScript**: Strict mode in both projects
- **React**: Using React 19 with React Compiler (babel plugin)
- **CSS**: Tailwind CSS 4.x (utility-first, no CSS modules)
- **Unused imports**: Always remove unused imports from files — never leave dead imports
- Files prefixed with `demo` are examples and can be deleted

## What's Implemented vs Planned

Currently implemented:
- Basic TanStack Start scaffold with routing
- Shadcn UI components setup
- Better Auth integration (email/password)
- NestJS base structure

See the root [README.md](README.md) "Implementation Roadmap" for planned features.
