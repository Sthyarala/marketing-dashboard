# Multi-Tenant Marketing Dashboard

## Overview
Full-stack demo showing CSV ingestion, multi-tenant data isolation, and reporting.

## Tech Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, React  
- **Backend:** Node.js, Express, PostgreSQL  
- **Database:** PostgreSQL (managed via `pgAdmin`)  
- **CSV Upload:** Supports ingesting new campaign, lead, or sales data  

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

## Running Locally
To run the full-stack dashboard locally, follow these steps:

### 1. Start the Backend
Open a terminal and navigate to the backend folder:
cd backend
npm install
npm run dev
The backend API will be running on: http://localhost:5000

### 1. Start the Frontend
Open a terminal and navigate to the backend folder:
cd Frontend
npm install
npm run dev
The frontend will be available at: http://localhost:3000

## API Endpoints
- GET /api/users
- GET /dashboard/campaigns?brandId=<id>&companyId=<id>
- GET /dashboard/leads?brandId=<id>&companyId=<id>
- GET /dashboard/sales?brandId=<id>&companyId=<id>
- GET /dashboard/roi?brandId=<id>&companyId=<id>
- POST /upload/campaigns
- POST /upload/leads
- POST /upload/sales

## Key Decisions and Trade-offs

- **Removed Authentication for Simplicity**  
  For the take-home assessment, JWT-based token login was not used in order to simplify the flow. This allows direct access to endpoints without tokens.

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
  Uploads are handled by `UploadCsv` component with dynamic POST endpoints per table.  
  *Trade-off:* Simplifies testing and demonstration but not production-ready.

- **Simplified Frontend Data Fetching**  
  Tables fetch data via `fetch` with query parameters for `brandId` and `companyId`. No token or headers required.  
  *Trade-off:* Faster development; lacks security and validation checks.

- **React Client Components**  
  All tables (`CampaignsTable`, `LeadsTable`, `SalesTable`, `RoiTable`) are client components using props for scoping.  
  *Trade-off:* Makes tables reusable but pushes all state and fetch logic to client-side.
