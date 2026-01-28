# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands

### Backend (Express + TypeScript)
```bash
cd backend
npm install
npm run dev      # Development server with hot reload (ts-node-dev)
npm start        # Production server (ts-node)
```
Runs on http://localhost:5000

### Frontend (Next.js 16)
```bash
cd frontend
npm install
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```
Runs on http://localhost:3000

### Prerequisites
- PostgreSQL running on localhost:5432
- Backend `.env` file with DB credentials and JWT_SECRET

## Architecture

This is a full-stack multi-tenant marketing dashboard (take-home assessment project) with separated backend and frontend.

### Database Schema
Full pg_dump schema is in `schema.sql` at the project root. Tables: `brands`, `companies`, `locations`, `campaigns`, `leads`, `sales`, `users`. There are also `staging_campaigns`, `staging_leads`, `staging_sales` tables (not used by application code).

### Data Hierarchy
```
Brand (e.g., "Acme")
 └── Company (e.g., "Acme Downtown LLC")
      └── Locations (campaigns run per-location)
```

### Multi-Tenancy Model
- Enforced at **database query layer** via SQL WHERE clauses
- Frontend passes `brandId` and `companyId` as URL query parameters
- **Brand User** — sees all companies and locations under their brand
- **Company User** — sees only their company's locations
- No middleware-level tenant enforcement; relies on frontend passing correct IDs

### Test Users
| User | Role | Scope |
|------|------|-------|
| User1 | Brand User | Acme (all Acme companies) |
| User2 | Company User | Acme Downtown LLC |
| User3 | Company User | Competitor Wellness Inc |

### Data Flow
1. User selects role via UserSwitcher component
2. UserContext stores selected user's `brandId` and `companyId`
3. Dashboard tabs fetch data with these IDs as query parameters
4. Backend routes filter data accordingly
5. CSV uploads trigger table refreshes via `refreshKey` state

### Key Patterns

**Frontend State Management:** React Context (`UserContext.tsx`) manages current user selection across the app.

**Dashboard Refresh:** Parent component (`dashboard/page.tsx`) manages `refreshKey` state variable. Tables receive this as React key to force remounts after CSV uploads.

**Backend Routes:** Parameterized SQL with conditional WHERE clauses for brand/company filtering. Routes organized by resource under `/dashboard` and `/upload`.

**API Base URL:** Frontend hardcodes `http://localhost:5000` in component fetch calls.

### Dashboard Tabs
- **Campaigns** — campaign data for user's scope
- **Leads** — lead data for user's scope
- **Sales** — sales data for user's scope
- **ROI Report** — joined/aggregated table (spend vs revenue by company or location)

### API Endpoints
- `GET /api/users` - List users
- `GET /dashboard/{campaigns,leads,sales,roi}?brandId=X&companyId=Y` - Data endpoints
- `POST /upload/{campaigns,leads,sales}` - CSV upload (multipart/form-data)

## Notable Design Decisions
- Authentication removed for demo simplicity
- All data tables are client components using `useEffect` for fetching
- CSV upload determines endpoint from filename pattern
- CSV uploads use UPSERT (`ON CONFLICT`) to prevent duplicate data:
  - Campaigns: unique on `(location_id, campaign_name, channel, date)`
  - Leads: unique on `(location_id, email)`
  - Sales: unique on `(location_id, product_category, date)`
- User switching is available via button in the dashboard header
