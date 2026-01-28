# Multi-Tenant Marketing Dashboard

## Overview
Full-stack demo showing CSV ingestion, multi-tenant data isolation, and reporting.

## Tech Stack

### Frontend
- **Next.js 16** with App Router — React framework. Used primarily as a client-side SPA since all components are client components (`'use client'`). The App Router handles page routing (`/` and `/dashboard`).
- **React 19** — UI rendering. Uses Context API for user state, `useState`/`useEffect` for data fetching and tab management.
- **TypeScript** — Type safety across components and interfaces (e.g., `AppUser`, `Tab` type).
- **Inline styles** — All component styling uses inline `style` props.

### Backend
- **Express.js** — HTTP server handling REST endpoints. Routes are organized by resource (`/dashboard/campaigns`, `/upload/leads`, etc.).
- **TypeScript** — Same language across the full stack.
- **pg (node-postgres)** — PostgreSQL client using a connection pool (`Pool`). All queries are raw parameterized SQL, no ORM.
- **Multer** — Middleware for handling multipart file uploads. Saves CSVs to a temp `uploads/` directory, which are cleaned up after processing.
- **ts-node-dev** — Development server with hot reload on file changes.

### Database
- **PostgreSQL 18** — Relational database with 7 tables (`brands`, `companies`, `locations`, `campaigns`, `leads`, `sales`, `users`). Uses foreign keys to enforce the Brand → Company → Location hierarchy, and unique constraints for UPSERT deduplication.
- **pgAdmin** — Used for database administration and schema management.

## Users / Access
| Username | Role | Scope |
|----------|------|-------|
| User1 | Brand User | Acme (all companies under Acme) |
| User2 | Company User | Acme Downtown LLC |
| User3 | Company User | Competitor Wellness Inc |

- Users are selected via the **User Switcher** in the frontend.
- Tenant scoping is handled via `brandId` / `companyId` query parameters.

## Multi-Tenancy
- Multi-tenancy is **enforced at the database query layer**.  
- Backend endpoints accept `brandId` and `companyId` as query parameters.  
- Each SQL query filters data according to the user’s brand/company scope.

## Features
- **User Switcher:** Select a brand or company user to view scoped data  
- **Tables:** Campaigns, Leads, Sales, ROI  
- **CSV Upload:** Upload CSV files for campaigns, leads, or sales to update the database  
- **Multi-Tenant Scoping:** Data is filtered based on brand/company  

## Database Schema
The full PostgreSQL schema is available in `schema.sql` at the project root. This can be used to recreate the database from scratch.

## Running Locally
To run the full-stack dashboard locally, follow these steps:

### 1. Set Up the Database
- Create a PostgreSQL database called `marketing_dashboard`
- Run `schema.sql` to create all tables

### 2. Start the Backend
- Open a terminal and navigate to the backend folder:
- cd backend
- npm install
- npm run dev
- The backend API will be running on: http://localhost:5000

### 3. Start the Frontend
- Open a terminal and navigate to the frontend folder:
- cd frontend
- npm install
- npm run dev
- The frontend will be available at: http://localhost:3000

## API Endpoints
- GET /api/users
- GET /dashboard/campaigns?brandId=&lt;id&gt;&companyId=&lt;id&gt;
- GET /dashboard/leads?brandId=&lt;id&gt;&companyId=&lt;id&gt;
- GET /dashboard/sales?brandId=&lt;id&gt;&companyId=&lt;id&gt;
- GET /dashboard/roi?brandId=&lt;id&gt;&companyId=&lt;id&gt;
- POST /upload/campaigns
- POST /upload/leads
- POST /upload/sales

### Example curl Commands (Windows Command Prompt)
```cmd
:: List users
curl http://localhost:5000/api/users

:: Health check
curl http://localhost:5000/health

:: Dashboard data (all, by brand, by company)
curl http://localhost:5000/dashboard/campaigns
curl "http://localhost:5000/dashboard/campaigns?brandId=1"
curl "http://localhost:5000/dashboard/campaigns?brandId=1&companyId=1"

curl "http://localhost:5000/dashboard/leads?brandId=1"
curl "http://localhost:5000/dashboard/sales?brandId=1"
curl "http://localhost:5000/dashboard/roi?brandId=1"

:: CSV uploads
curl -X POST -F "file=@campaigns.csv" http://localhost:5000/upload/campaigns
curl -X POST -F "file=@leads.csv" http://localhost:5000/upload/leads
curl -X POST -F "file=@sales.csv" http://localhost:5000/upload/sales
```

Adjust brandId and companyId values to match your database. For uploads, run from the directory containing your CSV files.

## Key Decisions and Trade-offs

- **Removed Authentication for Simplicity**
  JWT-based token login was not used in order to simplify the flow. This allows direct access to endpoints without tokens.

- **Multi-Tenant Scoping at Query Layer**  
  Multi-tenancy is enforced via SQL query filters (`brandId` and `companyId`) instead of middleware or per-user database roles.  
  *Trade-off:* Simplifies implementation but relies on frontend to pass the correct IDs.

- **Separated Backend Routes by Resource**  
  Created individual routes for `campaigns`, `leads`, `sales`, and `roi` under `/dashboard`.  
  *Trade-off:* Slightly more boilerplate but clearer structure and easier maintenance.

- **Frontend User Selection**  
  Users are selected via a `UserSwitcher` component and stored in context. All data fetches are scoped based on this selection.  
  *Trade-off:* No real authentication; user context must be manually managed.

- **CSV Upload Handling**
  Uploads are handled by `UploadCsv` component with dynamic POST endpoints per table. Duplicate uploads are handled via UPSERT (`ON CONFLICT`) with unique constraints per table.
  *Trade-off:* Simplifies testing and demonstration but not production-ready.

- **Simplified Frontend Data Fetching**  
  Tables fetch data via `fetch` with query parameters for `brandId` and `companyId`. No token or headers required.  
  *Trade-off:* Faster development; lacks security and validation checks.

- **React Client Components**  
  All tables (`CampaignsTable`, `LeadsTable`, `SalesTable`, `RoiTable`) are client components using props for scoping.  
  *Trade-off:* Makes tables reusable but pushes all state and fetch logic to client-side.
