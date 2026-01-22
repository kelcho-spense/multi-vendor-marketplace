# Online Shops Management System

A comprehensive multi-vendor marketplace platform (similar to Alibaba) where **shops sell items to consumers**, **suppliers provide inventory to shops**, and **users shop from multiple online stores** — all within a unified ecosystem.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Git Branching Strategy](#git-branching-strategy)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Modules (Backend)](#api-modules-backend)
- [Frontend Routes & Features](#frontend-routes--features)
- [Authentication & Authorization](#authentication--authorization)
- [Implementation Roadmap](#implementation-roadmap)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)

---

## Git Branching Strategy

This project follows a **Git Flow**-inspired branching model with two main branches and feature branches.

### Branch Structure

```
main (production)
 │
 └── develop (integration)
      │
      ├── feature/user-auth
      ├── feature/product-catalog
      ├── feature/shopping-cart
      └── feature/order-management
```

### Branches


| Branch      | Purpose                                                   | Base Branch |
| ------------- | ----------------------------------------------------------- | ------------- |
| `main`      | **Production-ready code** — Always stable and deployable | -           |
| `develop`   | **Integration branch** — All feature branches merge here | `main`      |
| `feature/*` | **Feature development** — Individual features/modules    | `develop`   |

### Workflow

#### 1. Starting a New Feature

```bash
# Make sure you're on develop and it's up to date
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/your-feature-name
```

#### 2. Working on a Feature

```bash
# Make commits as you work
git add .
git commit -m "feat: add user authentication"

# Push your feature branch
git push origin feature/your-feature-name
```

#### 3. Completing a Feature

When your feature is complete:

```bash
# Update your branch with latest develop changes
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop

# Resolve any conflicts, then push
git push origin feature/your-feature-name
```

Then create a **Pull Request** from `feature/your-feature-name` → `develop`.

#### 4. Releasing to Production

When a module/milestone is complete and tested in `develop`:

1. Ensure `develop` is stable and all tests pass
2. Create a **Pull Request** from `develop` → `main`
3. Review and approve the PR
4. Merge to `main` — this triggers production deployment

### Commit Message Convention

Use conventional commits for clear history:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, no code change
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

### Branch Naming Convention

- `feature/short-description` — New features
- `bugfix/short-description` — Bug fixes
- `hotfix/short-description` — Urgent production fixes (branch from `main`)

---

## Overview

### What is this project?

This is an **Alibaba-like multi-vendor e-commerce platform** that connects three key stakeholders:

1. **Shoppers (Consumers)** — Browse products across multiple shops, add to cart, and place orders
2. **Shop Owners (Merchants)** — Manage their online stores, list products, and fulfill orders
3. **Suppliers (Wholesalers)** — Provide inventory to shops at wholesale prices

### Key Features


| Feature                      | Description                                       |
| ------------------------------ | --------------------------------------------------- |
| **Multi-Vendor Marketplace** | Multiple shops operating under one platform       |
| **Supplier Network**         | Shops can source products from verified suppliers |
| **User Shopping**            | Consumers browse, compare, and buy from any shop  |
| **Inventory Management**     | Real-time stock tracking across supply chain      |
| **Order Management**         | Full order lifecycle from cart to delivery        |
| **Role-Based Access**        | Different dashboards for each user type           |
| **Analytics & Reports**      | Sales, inventory, and performance insights        |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (TanStack Start)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Shopper    │  │ Shop Owner  │  │  Supplier   │  │    Admin    │         │
│  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY (NestJS)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   Auth   │ │   User   │ │   Shop   │ │ Product  │ │  Order   │           │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │ │  Module  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Supplier │ │   Cart   │ │ Inventory│ │  Review  │ │ Analytics│           │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │ │  Module  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE (PostgreSQL)                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  Users   │ │  Shops   │ │ Products │ │  Orders  │ │ Suppliers│           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## User Roles

### 1. 🛒 Shopper (Consumer)


| Capability      | Description                                  |
| ----------------- | ---------------------------------------------- |
| Browse Products | Search and filter products across all shops  |
| View Shops      | Explore different stores and their offerings |
| Manage Cart     | Add/remove items, adjust quantities          |
| Place Orders    | Checkout with shipping and payment           |
| Track Orders    | View order status and history                |
| Write Reviews   | Rate products and shops                      |
| Manage Profile  | Update personal info and addresses           |

### 2. 🏪 Shop Owner (Merchant)


| Capability         | Description                                    |
| -------------------- | ------------------------------------------------ |
| Manage Shop        | Create and configure store settings            |
| Product Catalog    | Add, edit, delete products                     |
| Inventory          | Track stock levels and set alerts              |
| Order Fulfillment  | Process and ship customer orders               |
| Supplier Relations | Connect with suppliers, place wholesale orders |
| Analytics          | View sales reports and insights                |
| Staff Management   | Add employees with role-based access           |

### 3. 📦 Supplier (Wholesaler)


| Capability       | Description                         |
| ------------------ | ------------------------------------- |
| Product Catalog  | List wholesale products and pricing |
| Shop Connections | Manage relationships with shops     |
| Order Management | Process bulk orders from shops      |
| Inventory        | Track warehouse stock levels        |
| Pricing Tiers    | Set volume-based pricing            |
| Analytics        | View supplier performance metrics   |

### 4. 👑 Admin (Platform)


| Capability            | Description                  |
| ----------------------- | ------------------------------ |
| User Management       | Manage all platform users    |
| Shop Approval         | Review and approve new shops |
| Supplier Verification | Verify and approve suppliers |
| Platform Settings     | Configure global settings    |
| Dispute Resolution    | Handle complaints and issues |
| Financial Reports     | Platform-wide analytics      |

---

## Tech Stack

### Frontend (`onlineshop-ui/`)


| Technology          | Version | Purpose                                  |
| --------------------- | --------- | ------------------------------------------ |
| **TanStack Start**  | 1.132.0 | Full-stack React meta-framework with SSR |
| **TanStack Router** | 1.132.0 | Type-safe file-based routing             |
| **React**           | 19.x    | UI library with React Compiler           |
| **Vite**            | 7.x     | Build tool and dev server                |
| **Tailwind CSS**    | 4.x     | Utility-first styling                    |
| **Shadcn/UI**       | Latest  | Accessible component library             |
| **Better Auth**     | 1.4.x   | Authentication (frontend)                |
| **TanStack Query**  | 5.x     | Server state management                  |
| **TanStack Form**   | Latest  | Form handling with validation            |
| **Zod**             | 4.x     | Schema validation                        |

### Backend (`onlineshops-api/`)


| Technology            | Version | Purpose                   |
| ----------------------- | --------- | --------------------------- |
| **NestJS**            | 11.x    | Backend framework         |
| **TypeORM**           | 0.3.x   | Database ORM              |
| **PostgreSQL**        | 16.x    | Primary database          |
| **Passport.js**       | Latest  | Authentication strategies |
| **JWT**               | Latest  | Token-based auth          |
| **class-validator**   | Latest  | DTO validation            |
| **class-transformer** | Latest  | Object transformation     |
| **Swagger**           | Latest  | API documentation         |
| **Bull**              | Latest  | Job queue (emails, etc.)  |

### DevOps & Tools


| Technology            | Purpose           |
| ----------------------- | ------------------- |
| **Docker**            | Containerization  |
| **Docker Compose**    | Local development |
| **GitHub Actions**    | CI/CD pipeline    |
| **ESLint + Prettier** | Code quality      |
| **Vitest / Jest**     | Testing           |

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      USER       │       │      SHOP       │       │    SUPPLIER     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ email           │       │ owner_id (FK)   │─────> │  user_id (FK)   │
│ password_hash   │       │ name            │       │ company_name    │
│ first_name      │       │ slug            │       │ description     │
│ last_name       │       │ description     │       │ contact_email   │
│ phone           │       │ logo_url        │       │ phone           │
│ avatar_url      │       │ banner_url      │       │ address         │
│ role            │       │ status          │       │ verified        │
│ email_verified  │       │ settings (JSON) │       │ rating          │
│ created_at      │       │ created_at      │       │ created_at      │
│ updated_at      │       │ updated_at      │       │ updated_at      │
└─────────────────┘       └─────────────────┘       └─────────────────┘
        │                         │                         │
        │                         │                         │
        ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  USER_ADDRESS   │       │    PRODUCT      │       │ SUPPLIER_PRODUCT│
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ shop_id (FK)    │       │ supplier_id(FK) │
│ label           │       │ name            │       │ name            │
│ address_line_1  │       │ slug            │       │ sku             │
│ address_line_2  │       │ description     │       │ description     │
│ city            │       │ price           │       │ wholesale_price │
│ state           │       │ compare_price   │       │ min_order_qty   │
│ postal_code     │       │ sku             │       │ stock_qty       │
│ country         │       │ stock_qty       │       │ category_id(FK) │
│ is_default      │       │ category_id(FK) │       │ images (JSON)   │
│ created_at      │       │ images (JSON)   │       │ created_at      │
└─────────────────┘       │ status          │       │ updated_at      │
                          │ created_at      │       └─────────────────┘
                          │ updated_at      │
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    CATEGORY     │       │     ORDER       │       │   ORDER_ITEM    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ name            │       │ user_id (FK)    │       │ order_id (FK)   │
│ slug            │       │ shop_id (FK)    │       │ product_id (FK) │
│ parent_id (FK)  │       │ order_number    │       │ quantity        │
│ description     │       │ status          │       │ unit_price      │
│ image_url       │       │ subtotal        │       │ total_price     │
│ created_at      │       │ tax             │       │ created_at      │
└─────────────────┘       │ shipping_cost   │       └─────────────────┘
                          │ total           │
                          │ shipping_addr   │
                          │ billing_addr    │
                          │ payment_method  │
                          │ payment_status  │
                          │ notes           │
                          │ created_at      │
                          │ updated_at      │
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      CART       │       │   CART_ITEM     │       │     REVIEW      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ cart_id (FK)    │       │ user_id (FK)    │
│ shop_id (FK)    │       │ product_id (FK) │       │ product_id (FK) │
│ created_at      │       │ quantity        │       │ shop_id (FK)    │
│ updated_at      │       │ created_at      │       │ rating          │
└─────────────────┘       │ updated_at      │       │ title           │
                          └─────────────────┘       │ comment         │
                                                    │ created_at      │
                                                    │ updated_at      │
                                                    └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  SHOP_SUPPLIER  │       │ SUPPLIER_ORDER  │       │SUPPLIER_ORD_ITEM│
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ shop_id (FK)    │       │ shop_id (FK)    │       │ order_id (FK)   │
│ supplier_id(FK) │       │ supplier_id(FK) │       │ product_id (FK) │
│ status          │       │ order_number    │       │ quantity        │
│ created_at      │       │ status          │       │ unit_price      │
│ updated_at      │       │ total           │       │ total_price     │
└─────────────────┘       │ notes           │       │ created_at      │
                          │ created_at      │       └─────────────────┘
                          │ updated_at      │
                          └─────────────────┘
```

### Database Tables Summary


| Table                  | Description                                                   |
| ------------------------ | --------------------------------------------------------------- |
| `users`                | All platform users (shoppers, shop owners, suppliers, admins) |
| `user_addresses`       | Shipping/billing addresses for users                          |
| `shops`                | Online stores on the platform                                 |
| `products`             | Products listed by shops                                      |
| `categories`           | Hierarchical product categories                               |
| `orders`               | Customer orders from shops                                    |
| `order_items`          | Individual items within an order                              |
| `carts`                | Shopping carts (per user per shop)                            |
| `cart_items`           | Items in shopping carts                                       |
| `reviews`              | Product and shop reviews                                      |
| `suppliers`            | Supplier profiles                                             |
| `supplier_products`    | Products offered by suppliers                                 |
| `shop_suppliers`       | Shop-Supplier relationships                                   |
| `supplier_orders`      | Wholesale orders from shops to suppliers                      |
| `supplier_order_items` | Items in supplier orders                                      |

---

## API Modules (Backend)

### Module Structure

```
onlineshops-api/src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── utils/
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
├── modules/
│   ├── auth/
│   ├── users/
│   ├── shops/
│   ├── products/
│   ├── categories/
│   ├── orders/
│   ├── cart/
│   ├── reviews/
│   ├── suppliers/
│   ├── inventory/
│   └── analytics/
└── database/
    ├── entities/
    ├── migrations/
    └── seeds/
```

### API Endpoints

#### 🔐 Auth Module (`/api/auth`)


| Method | Endpoint           | Description               | Access        |
| -------- | -------------------- | --------------------------- | --------------- |
| POST   | `/register`        | Register new user         | Public        |
| POST   | `/login`           | User login                | Public        |
| POST   | `/logout`          | User logout               | Authenticated |
| POST   | `/refresh`         | Refresh access token      | Authenticated |
| POST   | `/forgot-password` | Request password reset    | Public        |
| POST   | `/reset-password`  | Reset password with token | Public        |
| GET    | `/me`              | Get current user          | Authenticated |
| PATCH  | `/me`              | Update current user       | Authenticated |

#### 👤 Users Module (`/api/users`)


| Method | Endpoint                    | Description        | Access      |
| -------- | ----------------------------- | -------------------- | ------------- |
| GET    | `/`                         | List all users     | Admin       |
| GET    | `/:id`                      | Get user by ID     | Admin       |
| PATCH  | `/:id`                      | Update user        | Admin       |
| DELETE | `/:id`                      | Delete user        | Admin       |
| GET    | `/:id/addresses`            | Get user addresses | Owner/Admin |
| POST   | `/:id/addresses`            | Add address        | Owner/Admin |
| PATCH  | `/:id/addresses/:addressId` | Update address     | Owner/Admin |
| DELETE | `/:id/addresses/:addressId` | Delete address     | Owner/Admin |

#### 🏪 Shops Module (`/api/shops`)


| Method | Endpoint             | Description        | Access           |
| -------- | ---------------------- | -------------------- | ------------------ |
| GET    | `/`                  | List all shops     | Public           |
| GET    | `/:id`               | Get shop details   | Public           |
| GET    | `/slug/:slug`        | Get shop by slug   | Public           |
| POST   | `/`                  | Create new shop    | Authenticated    |
| PATCH  | `/:id`               | Update shop        | Shop Owner       |
| DELETE | `/:id`               | Delete shop        | Shop Owner/Admin |
| GET    | `/:id/products`      | Get shop products  | Public           |
| GET    | `/:id/orders`        | Get shop orders    | Shop Owner       |
| GET    | `/:id/analytics`     | Get shop analytics | Shop Owner       |
| POST   | `/:id/staff`         | Add staff member   | Shop Owner       |
| DELETE | `/:id/staff/:userId` | Remove staff       | Shop Owner       |

#### 📦 Products Module (`/api/products`)


| Method | Endpoint               | Description                  | Access     |
| -------- | ------------------------ | ------------------------------ | ------------ |
| GET    | `/`                    | List products (with filters) | Public     |
| GET    | `/:id`                 | Get product details          | Public     |
| GET    | `/slug/:slug`          | Get product by slug          | Public     |
| POST   | `/`                    | Create product               | Shop Owner |
| PATCH  | `/:id`                 | Update product               | Shop Owner |
| DELETE | `/:id`                 | Delete product               | Shop Owner |
| POST   | `/:id/images`          | Upload product images        | Shop Owner |
| DELETE | `/:id/images/:imageId` | Delete product image         | Shop Owner |
| GET    | `/:id/reviews`         | Get product reviews          | Public     |

#### 📂 Categories Module (`/api/categories`)


| Method | Endpoint | Description          | Access |
| -------- | ---------- | ---------------------- | -------- |
| GET    | `/`      | List all categories  | Public |
| GET    | `/tree`  | Get category tree    | Public |
| GET    | `/:id`   | Get category details | Public |
| POST   | `/`      | Create category      | Admin  |
| PATCH  | `/:id`   | Update category      | Admin  |
| DELETE | `/:id`   | Delete category      | Admin  |

#### 🛒 Cart Module (`/api/cart`)


| Method | Endpoint         | Description                  | Access        |
| -------- | ------------------ | ------------------------------ | --------------- |
| GET    | `/`              | Get user's carts (all shops) | Authenticated |
| GET    | `/shop/:shopId`  | Get cart for specific shop   | Authenticated |
| POST   | `/items`         | Add item to cart             | Authenticated |
| PATCH  | `/items/:itemId` | Update cart item quantity    | Authenticated |
| DELETE | `/items/:itemId` | Remove item from cart        | Authenticated |
| DELETE | `/shop/:shopId`  | Clear cart for shop          | Authenticated |
| POST   | `/checkout`      | Checkout cart                | Authenticated |

#### 📋 Orders Module (`/api/orders`)


| Method | Endpoint        | Description              | Access                 |
| -------- | ----------------- | -------------------------- | ------------------------ |
| GET    | `/`             | List user's orders       | Authenticated          |
| GET    | `/:id`          | Get order details        | Order Owner/Shop Owner |
| POST   | `/`             | Create order (from cart) | Authenticated          |
| PATCH  | `/:id/status`   | Update order status      | Shop Owner             |
| POST   | `/:id/cancel`   | Cancel order             | Order Owner            |
| GET    | `/:id/tracking` | Get tracking info        | Order Owner            |

#### ⭐ Reviews Module (`/api/reviews`)


| Method | Endpoint              | Description         | Access                    |
| -------- | ----------------------- | --------------------- | --------------------------- |
| GET    | `/product/:productId` | Get product reviews | Public                    |
| GET    | `/shop/:shopId`       | Get shop reviews    | Public                    |
| POST   | `/`                   | Create review       | Authenticated (Purchased) |
| PATCH  | `/:id`                | Update review       | Review Owner              |
| DELETE | `/:id`                | Delete review       | Review Owner/Admin        |

#### 🚚 Suppliers Module (`/api/suppliers`)


| Method | Endpoint                   | Description             | Access              |
| -------- | ---------------------------- | ------------------------- | --------------------- |
| GET    | `/`                        | List all suppliers      | Shop Owner          |
| GET    | `/:id`                     | Get supplier details    | Shop Owner/Supplier |
| POST   | `/`                        | Register as supplier    | Authenticated       |
| PATCH  | `/:id`                     | Update supplier profile | Supplier Owner      |
| GET    | `/:id/products`            | Get supplier products   | Shop Owner          |
| POST   | `/:id/products`            | Add supplier product    | Supplier Owner      |
| PATCH  | `/:id/products/:productId` | Update product          | Supplier Owner      |
| DELETE | `/:id/products/:productId` | Delete product          | Supplier Owner      |
| GET    | `/:id/orders`              | Get supplier orders     | Supplier Owner      |
| PATCH  | `/:id/orders/:orderId`     | Update order status     | Supplier Owner      |

#### 🔗 Shop-Supplier Relations (`/api/shop-suppliers`)


| Method | Endpoint                | Description                 | Access         |
| -------- | ------------------------- | ----------------------------- | ---------------- |
| GET    | `/shop/:shopId`         | Get shop's suppliers        | Shop Owner     |
| GET    | `/supplier/:supplierId` | Get supplier's shops        | Supplier Owner |
| POST   | `/request`              | Request supplier connection | Shop Owner     |
| PATCH  | `/:id/approve`          | Approve connection          | Supplier Owner |
| PATCH  | `/:id/reject`           | Reject connection           | Supplier Owner |
| DELETE | `/:id`                  | Remove connection           | Either Party   |
| POST   | `/orders`               | Create supplier order       | Shop Owner     |
| GET    | `/orders/:id`           | Get supplier order details  | Either Party   |

#### 📊 Analytics Module (`/api/analytics`)


| Method | Endpoint                      | Description          | Access         |
| -------- | ------------------------------- | ---------------------- | ---------------- |
| GET    | `/shop/:shopId/sales`         | Shop sales analytics | Shop Owner     |
| GET    | `/shop/:shopId/products`      | Product performance  | Shop Owner     |
| GET    | `/shop/:shopId/customers`     | Customer analytics   | Shop Owner     |
| GET    | `/supplier/:supplierId/sales` | Supplier sales       | Supplier Owner |
| GET    | `/platform/overview`          | Platform overview    | Admin          |
| GET    | `/platform/shops`             | All shops analytics  | Admin          |

---

## Frontend Routes & Features

### Route Structure

```
onlineshop-ui/src/routes/
├── __root.tsx
├── index.tsx                          # Landing page
├── api/
│   └── auth/
│       └── $.ts                       # Auth API catch-all
├── auth/
│   ├── login.tsx                      # Login page
│   ├── register.tsx                   # Registration page
│   ├── forgot-password.tsx            # Forgot password
│   └── reset-password.tsx             # Reset password
├── shops/
│   ├── index.tsx                      # Browse all shops
│   ├── $shopSlug/
│   │   ├── index.tsx                  # Shop storefront
│   │   └── products/
│   │       └── $productSlug.tsx       # Product details
├── categories/
│   ├── index.tsx                      # All categories
│   └── $categorySlug.tsx              # Category products
├── cart/
│   └── index.tsx                      # Shopping cart
├── checkout/
│   └── index.tsx                      # Checkout flow
├── orders/
│   ├── index.tsx                      # Order history
│   └── $orderId.tsx                   # Order details
├── account/
│   ├── index.tsx                      # Account overview
│   ├── profile.tsx                    # Edit profile
│   ├── addresses.tsx                  # Manage addresses
│   └── settings.tsx                   # Account settings
├── dashboard/
│   └── shop/
│       ├── index.tsx                  # Shop dashboard home
│       ├── products/
│       │   ├── index.tsx              # Product list
│       │   ├── new.tsx                # Add product
│       │   └── $productId.tsx         # Edit product
│       ├── orders/
│       │   ├── index.tsx              # Order management
│       │   └── $orderId.tsx           # Order details
│       ├── inventory.tsx              # Inventory management
│       ├── suppliers/
│       │   ├── index.tsx              # Supplier connections
│       │   └── orders.tsx             # Supplier orders
│       ├── analytics.tsx              # Shop analytics
│       └── settings.tsx               # Shop settings
├── supplier/
│   ├── index.tsx                      # Supplier dashboard
│   ├── products/
│   │   ├── index.tsx                  # Supplier products
│   │   ├── new.tsx                    # Add product
│   │   └── $productId.tsx             # Edit product
│   ├── orders.tsx                     # Incoming orders
│   ├── shops.tsx                      # Connected shops
│   └── settings.tsx                   # Supplier settings
└── admin/
    ├── index.tsx                      # Admin dashboard
    ├── users.tsx                      # User management
    ├── shops.tsx                      # Shop management
    ├── suppliers.tsx                  # Supplier verification
    ├── categories.tsx                 # Category management
    └── settings.tsx                   # Platform settings
```

### Pages & Features by Role

#### 🌐 Public Pages


| Page                | Features                                           |
| --------------------- | ---------------------------------------------------- |
| **Home**            | Featured shops, trending products, categories      |
| **Shop Listing**    | Browse shops with search & filters                 |
| **Shop Storefront** | Shop profile, products, reviews                    |
| **Product Details** | Images, description, pricing, reviews, add to cart |
| **Categories**      | Hierarchical category browsing                     |
| **Search Results**  | Global search across products and shops            |

#### 🛒 Shopper Dashboard


| Page         | Features                                        |
| -------------- | ------------------------------------------------- |
| **Cart**     | View items by shop, update quantities, checkout |
| **Checkout** | Address selection, payment, order confirmation  |
| **Orders**   | Order history, status tracking, reorder         |
| **Account**  | Profile management, addresses, preferences      |

#### 🏪 Shop Owner Dashboard


| Page          | Features                                            |
| --------------- | ----------------------------------------------------- |
| **Overview**  | Sales summary, recent orders, low stock alerts      |
| **Products**  | CRUD products, bulk import/export, variants         |
| **Orders**    | Order queue, fulfillment, status updates            |
| **Inventory** | Stock levels, reorder points, supplier orders       |
| **Suppliers** | Find suppliers, manage connections, order inventory |
| **Analytics** | Sales charts, top products, customer insights       |
| **Settings**  | Shop profile, payment settings, shipping zones      |

#### 📦 Supplier Dashboard


| Page          | Features                                |
| --------------- | ----------------------------------------- |
| **Overview**  | Order summary, connected shops, revenue |
| **Products**  | Wholesale catalog, pricing tiers, stock |
| **Orders**    | Incoming orders, fulfillment, tracking  |
| **Shops**     | Connected shops, pending requests       |
| **Analytics** | Sales performance, top products         |
| **Settings**  | Company profile, minimum orders, terms  |

#### 👑 Admin Dashboard


| Page           | Features                                   |
| ---------------- | -------------------------------------------- |
| **Overview**   | Platform stats, pending approvals, alerts  |
| **Users**      | User list, roles, ban/unban                |
| **Shops**      | Shop approvals, featured shops, violations |
| **Suppliers**  | Verification queue, ratings                |
| **Categories** | Category tree management                   |
| **Reports**    | Financial reports, platform analytics      |
| **Settings**   | Commission rates, policies, configurations |

---

## Authentication & Authorization

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │   Backend   │     │  Database   │
│ (Better Auth)│    │ (Passport)  │     │ (PostgreSQL)│
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │  1. Register/Login│                   │
       │──────────────────▶│                   │
       │                   │  2. Validate/Create│
       │                   │──────────────────▶│
       │                   │                   │
       │                   │  3. User Data     │
       │                   │◀──────────────────│
       │  4. Access + Refresh Tokens           │
       │◀──────────────────│                   │
       │                   │                   │
       │  5. API Request + Access Token        │
       │──────────────────▶│                   │
       │                   │  6. Verify Token   │
       │                   │                   │
       │                   │  7. Query Data    │
       │                   │──────────────────▶│
       │  8. Response      │                   │
       │◀──────────────────│◀──────────────────│
```

### Token-Based Authentication

The API uses a **dual-token system** for secure authentication:

| Token Type | Lifetime | Purpose | Storage |
|------------|----------|---------|---------|
| **Access Token** | 15 minutes | API authentication | Memory/LocalStorage |
| **Refresh Token** | 7 days | Obtain new access tokens | HttpOnly Cookie/Secure Storage |

#### Token Payloads

**Access Token (JWT)**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "shopper",
  "type": "access",
  "iat": 1737561600,
  "exp": 1737562500
}
```

**Refresh Token (JWT)**
```json
{
  "sub": "user-uuid",
  "tokenId": "refresh-token-uuid",
  "type": "refresh",
  "iat": 1737561600,
  "exp": 1738166400
}
```

### Auth API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Create new user account | ❌ |
| POST | `/auth/login` | Login with email/password | ❌ |
| POST | `/auth/refresh` | Get new tokens using refresh token | ❌ (Refresh Token) |
| GET | `/auth/me` | Get current user profile | ✅ Access Token |
| POST | `/auth/logout` | Revoke current session | ✅ Access Token |
| POST | `/auth/logout-all` | Revoke all sessions | ✅ Access Token |
| GET | `/auth/sessions` | List active sessions | ✅ Access Token |
| DELETE | `/auth/sessions/:id` | Revoke specific session | ✅ Access Token |

### Auth Request/Response Examples

#### Register

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "shopper"  // Optional, defaults to "shopper"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "shopper"
  }
}
```

#### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as register

#### Refresh Tokens

```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

#### Using Access Token

```bash
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Session Management

Refresh tokens are stored in the database, enabling:

- **Token Revocation**: Logout invalidates the refresh token
- **Session Tracking**: View all active sessions with device info
- **Token Rotation**: Each refresh generates a new refresh token (old one is revoked)
- **Security Detection**: Reusing a revoked token invalidates ALL user sessions

#### Sessions Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique session identifier |
| `userId` | UUID | Reference to user |
| `token` | VARCHAR | Hashed refresh token |
| `expiresAt` | TIMESTAMP | Token expiration time |
| `isRevoked` | BOOLEAN | Whether token is revoked |
| `deviceInfo` | VARCHAR | User-Agent string |
| `ipAddress` | VARCHAR | Client IP address |
| `createdAt` | TIMESTAMP | Session creation time |

### Environment Variables

```env
# Access token secret (used for signing access tokens)
JWT_SECRET=your-secure-access-token-secret-key

# Refresh token secret (separate secret for refresh tokens)
JWT_REFRESH_SECRET=your-secure-refresh-token-secret-key
```

> ⚠️ **Security Note**: Use strong, unique secrets in production. Generate with:
> ```bash
> openssl rand -base64 64
> ```

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  SHOPPER = 'shopper',     // Default role for new users
  SHOP_OWNER = 'shop_owner',
  SUPPLIER = 'supplier',
  ADMIN = 'admin'
}
```

### Permission Matrix


| Resource            | Shopper | Shop Owner | Supplier | Admin |
| --------------------- | --------- | ------------ | ---------- | ------- |
| Browse Products     | ✅      | ✅         | ✅       | ✅    |
| Add to Cart         | ✅      | ✅         | ❌       | ✅    |
| Place Orders        | ✅      | ✅         | ❌       | ✅    |
| Manage Own Shop     | ❌      | ✅         | ❌       | ✅    |
| Manage Own Products | ❌      | ✅         | ✅       | ✅    |
| View Shop Orders    | ❌      | ✅ (own)   | ❌       | ✅    |
| Manage Suppliers    | ❌      | ✅         | ❌       | ✅    |
| Supplier Dashboard  | ❌      | ❌         | ✅       | ✅    |
| Admin Dashboard     | ❌      | ❌         | ❌       | ✅    |

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] **Database Setup**

  - [ ] Configure PostgreSQL connection
  - [ ] Set up TypeORM with NestJS
  - [ ] Create base entities (User, Shop, Product)
  - [ ] Implement migrations
- [ ] **Authentication**

  - [ ] Integrate Passport.js with JWT
  - [ ] Implement registration/login endpoints
  - [ ] Set up role-based guards
  - [ ] Connect Better Auth frontend with API
- [ ] **Core User Features**

  - [ ] User profile management
  - [ ] Address management
  - [ ] Role assignment

### Phase 2: Shop & Products (Weeks 3-4)

- [ ] **Shop Module**

  - [ ] Shop CRUD operations
  - [ ] Shop settings & customization
  - [ ] Staff management
- [ ] **Product Module**

  - [ ] Product CRUD with images
  - [ ] Category management
  - [ ] Product variants (size, color)
  - [ ] Search & filtering
- [ ] **Frontend Shop Pages**

  - [ ] Shop listing page
  - [ ] Shop storefront
  - [ ] Product details page
  - [ ] Category navigation

### Phase 3: Shopping Experience (Weeks 5-6)

- [ ] **Cart Module**

  - [ ] Add/remove items
  - [ ] Cart persistence
  - [ ] Cart per shop
- [ ] **Order Module**

  - [ ] Checkout flow
  - [ ] Order creation
  - [ ] Order status management
  - [ ] Order history
- [ ] **Frontend Shopping**

  - [ ] Cart page
  - [ ] Checkout page
  - [ ] Order tracking
  - [ ] Order history

### Phase 4: Supplier Network (Weeks 7-8)

- [ ] **Supplier Module**

  - [ ] Supplier registration
  - [ ] Wholesale product catalog
  - [ ] Pricing tiers
- [ ] **Shop-Supplier Relations**

  - [ ] Connection requests
  - [ ] Supplier orders
  - [ ] Inventory sync
- [ ] **Frontend Supplier**

  - [ ] Supplier dashboard
  - [ ] Product management
  - [ ] Order fulfillment

### Phase 5: Reviews & Analytics (Weeks 9-10)

- [ ] **Review Module**

  - [ ] Product reviews
  - [ ] Shop reviews
  - [ ] Rating system
- [ ] **Analytics Module**

  - [ ] Sales analytics
  - [ ] Product performance
  - [ ] Customer insights
- [ ] **Admin Dashboard**

  - [ ] User management
  - [ ] Shop/Supplier approval
  - [ ] Platform analytics

### Phase 6: Polish & Launch (Weeks 11-12)

- [ ] **Performance**

  - [ ] Query optimization
  - [ ] Caching (Redis)
  - [ ] Image optimization
- [ ] **Security**

  - [ ] Rate limiting
  - [ ] Input sanitization
  - [ ] CORS configuration
- [ ] **Deployment**

  - [ ] Docker setup
  - [ ] CI/CD pipeline
  - [ ] Production configuration

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm 9.x
- PostgreSQL 16.x
- Docker (optional)

### Environment Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd OnlineShopsManagementSystems
```

2. **Set up the database**

```bash
# Using Docker
docker run --name postgres-shops -e POSTGRES_PASSWORD=password -e POSTGRES_DB=onlineshops -p 5432:5432 -d postgres:16

# Or use existing PostgreSQL installation
```

3. **Configure environment variables**

**Backend (`onlineshops-api/.env`):**

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=onlineshops

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# App
PORT=3001
NODE_ENV=development
```

**Frontend (`onlineshop-ui/.env`):**

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_URL=http://localhost:3000
```

4. **Install dependencies**

```bash
# Backend
cd onlineshops-api
pnpm install

# Frontend
cd ../onlineshop-ui
pnpm install
```

5. **Run migrations**

```bash
cd onlineshops-api
pnpm migration:run
```

6. **Start development servers**

```bash
# Backend (Terminal 1)
cd onlineshops-api
pnpm start:dev

# Frontend (Terminal 2)
cd onlineshop-ui
pnpm dev
```

7. **Access the application**

- Frontend: http://localhost:3000
- API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

---

## Docker Deployment

The project includes Docker configuration for containerized deployment of all services.

### Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| `postgres` | onlineshops-postgres | 5432 | PostgreSQL 16 database |
| `api` | onlineshops-api | 3001 | NestJS backend API |
| `ui` | onlineshops-ui | 3000 | TanStack Start frontend |
| `pgadmin` | onlineshops-pgadmin | 5050 | Database admin UI (dev only) |

### Docker Files

| File | Purpose |
|------|--------|
| `docker-compose.yml` | Orchestrates all services |
| `onlineshops-api/Dockerfile` | Multi-stage build for NestJS API |
| `onlineshop-ui/Dockerfile` | Multi-stage build for TanStack Start UI |
| `onlineshops-api/.dockerignore` | Excludes files from API build |
| `onlineshop-ui/.dockerignore` | Excludes files from UI build |

### Docker Commands

#### Build and Start All Services

```bash
# Build and start (without pgAdmin)
docker compose up -d --build

# Build and start with pgAdmin (development)
docker compose --profile dev up -d --build
```

#### Development Workflow

```bash
# Start only PostgreSQL for local development
docker compose up -d postgres

# Start PostgreSQL + pgAdmin
docker compose --profile dev up -d postgres pgadmin
```

#### Other Commands

```bash
# Build images without starting
docker compose build

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f api

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# Restart a specific service
docker compose restart api
```

### Access Points (Docker)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001/api |
| pgAdmin | http://localhost:5050 (admin@example.com / admin) |

### Production Deployment Notes

1. **Environment Variables**: Update the following in `docker-compose.yml` for production:
   - `POSTGRES_PASSWORD` - Use a strong password
   - `JWT_SECRET` - Use a secure random string
   - `CORS_ORIGIN` - Set to your production frontend URL

2. **SSL/TLS**: Configure a reverse proxy (nginx, Traefik) for HTTPS

3. **Database**: Consider using a managed PostgreSQL service (Azure Database, AWS RDS)

4. **Secrets**: Use Docker secrets or environment variable injection instead of hardcoded values

---

## Project Structure

```
OnlineShopsManagementSystems/
├── README.md                          # This file
├── docker-compose.yml                 # Docker configuration
├── .github/
│   └── workflows/
│       └── ci.yml                     # CI/CD pipeline
│
├── onlineshop-ui/                     # Frontend (TanStack Start)
│   ├── public/
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── ui/                    # Shadcn components
│   │   │   ├── layout/                # Layout components
│   │   │   ├── shop/                  # Shop-related components
│   │   │   ├── product/               # Product components
│   │   │   ├── cart/                  # Cart components
│   │   │   └── dashboard/             # Dashboard components
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── lib/                       # Utilities & configurations
│   │   ├── routes/                    # File-based routes
│   │   ├── services/                  # API service layer
│   │   ├── stores/                    # State management
│   │   └── types/                     # TypeScript types
│   ├── package.json
│   └── vite.config.ts
│
└── onlineshops-api/                   # Backend (NestJS)
    ├── src/
    │   ├── common/                    # Shared utilities
    │   ├── config/                    # Configuration
    │   ├── database/                  # Database setup
    │   │   ├── entities/              # TypeORM entities
    │   │   ├── migrations/            # Database migrations
    │   │   └── seeds/                 # Seed data
    │   └── modules/                   # Feature modules
    │       ├── auth/
    │       ├── users/
    │       ├── shops/
    │       ├── products/
    │       ├── categories/
    │       ├── cart/
    │       ├── orders/
    │       ├── reviews/
    │       ├── suppliers/
    │       └── analytics/
    ├── test/                          # E2E tests
    ├── package.json
    └── nest-cli.json
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## Support

For support, please open an issue in the GitHub repository or contact the development team.
