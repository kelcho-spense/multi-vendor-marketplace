# Online Shops API

Backend REST API for the Online Shops Management System — a multi-vendor e-commerce platform built with NestJS.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 11.x | Backend framework |
| **TypeORM** | 0.3.x | Database ORM |
| **PostgreSQL** | 16.x | Primary database |
| **class-validator** | 0.14.x | DTO validation |
| **class-transformer** | 0.5.x | Object transformation |

## Prerequisites

- Node.js 20.x or higher
- pnpm 9.x
- PostgreSQL 16.x (or Docker)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Configure your `.env` file:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=onlineshops
DATABASE_LOGGING=true
DATABASE_SSL=false

# App
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Start PostgreSQL

**Option A: Using Docker (Recommended)**

From the project root directory:

```bash
docker compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- pgAdmin on `localhost:5050` (admin@example.com / admin)

**Option B: Local PostgreSQL**

Create the database manually:

```sql
CREATE DATABASE onlineshops;
```

### 4. Run Migrations

```bash
pnpm migration:run
```

### 5. Start the Server

```bash
# Development (watch mode)
pnpm start:dev

# Production
pnpm start:prod
```

The API will be available at: `http://localhost:3001/api`

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── app.controller.ts          # Health check controller
├── app.service.ts             # App service
├── config/
│   └── database.config.ts     # Database configuration
├── database/
│   ├── data-source.ts         # TypeORM CLI DataSource
│   ├── entities/              # Entity definitions
│   │   ├── base.entity.ts     # Base entity (id, timestamps)
│   │   └── index.ts           # Entity exports
│   ├── migrations/            # Database migrations
│   └── seeds/                 # Seed data (development)
├── common/                    # Shared utilities (planned)
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── modules/                   # Feature modules (planned)
    ├── auth/
    ├── users/
    ├── shops/
    ├── products/
    └── ...
```

## Database Migrations

TypeORM migrations are used to manage database schema changes in a version-controlled way.

### Migration Commands

| Command | Description |
|---------|-------------|
| `pnpm migration:generate <path>` | Generate migration from entity changes |
| `pnpm migration:create <path>` | Create empty migration file |
| `pnpm migration:run` | Run all pending migrations |
| `pnpm migration:revert` | Revert the last migration |
| `pnpm migration:show` | Show migration status |
| `pnpm schema:sync` | Sync schema directly (dev only) |
| `pnpm schema:drop` | Drop all tables (dangerous!) |

### Migration Workflow

#### 1. Create/Modify an Entity

```typescript
// src/database/entities/user.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

#### 2. Generate a Migration

```bash
pnpm migration:generate src/database/migrations/CreateUserTable
```

This compares your entities with the current database schema and generates the SQL needed to sync them.

#### 3. Review the Migration

Check the generated file in `src/database/migrations/`:

```typescript
// Example: 1737550000000-CreateUserTable.ts
export class CreateUserTable1737550000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL UNIQUE,
        "first_name" varchar NOT NULL,
        "last_name" varchar NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

#### 4. Run the Migration

```bash
pnpm migration:run
```

#### 5. Verify Migration Status

```bash
pnpm migration:show
```

### Understanding data-source.ts

The `src/database/data-source.ts` file is the **TypeORM CLI configuration** for running migrations outside of NestJS:

| Aspect | `app.module.ts` | `data-source.ts` |
|--------|-----------------|------------------|
| Used by | NestJS runtime | TypeORM CLI |
| Entities | `autoLoadEntities: true` | Glob patterns |
| Synchronize | Can be `true` in dev | Always `false` |

Both files read from the same `.env` to stay in sync.

### Migration Best Practices

1. **Never use `synchronize: true` in production** — Always use migrations
2. **Test migrations locally** before pushing to shared environments
3. **Name migrations descriptively** — `CreateUserTable`, `AddEmailToOrders`
4. **Review generated SQL** — Auto-generated migrations may need tweaking
5. **Commit migrations** — They're part of your codebase
6. **Don't modify executed migrations** — Create new ones instead

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm start` | Start the application |
| `pnpm start:dev` | Start in watch mode (development) |
| `pnpm start:debug` | Start with debugger attached |
| `pnpm start:prod` | Start in production mode |
| `pnpm build` | Build the application |
| `pnpm format` | Format code with Prettier |
| `pnpm lint` | Lint and fix with ESLint |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:cov` | Run tests with coverage |
| `pnpm test:e2e` | Run end-to-end tests |

## API Conventions

### Base URL

All endpoints are prefixed with `/api`:

```
http://localhost:3001/api/...
```

### Response Format

**Success:**
```json
{
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Validation

All DTOs are validated using `class-validator`. Invalid requests return `400 Bad Request` with details:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password is too short"],
  "error": "Bad Request"
}
```

## CORS Configuration

CORS is enabled for the frontend origin specified in `CORS_ORIGIN` environment variable (default: `http://localhost:3000`).

Allowed methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running:
   ```bash
   docker compose ps
   ```

2. Check your `.env` configuration matches your database setup

3. Verify the database exists:
   ```bash
   docker compose exec postgres psql -U postgres -c "\l"
   ```

### Migration Errors

1. **"No changes detected"** — Your entities match the database schema
2. **"Migration already applied"** — Check with `pnpm migration:show`
3. **"Cannot find entity"** — Ensure entity is exported in `src/database/entities/index.ts`

### Port Already in Use

```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (Windows)
taskkill /PID <PID> /F
```

## Related Documentation

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [class-validator](https://github.com/typestack/class-validator)
- [Main Project README](../README.md)

## License

This project is part of the Online Shops Management System.
