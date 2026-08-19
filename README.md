# RSS Server + Client for LMS — Assessment 3

CSE5006 — Assessment 3: extends the Assessment 2 RSS server and client with a data-driven dashboard, request logging and observability metrics, simulated historical data, and automated testing via Playwright, JMeter, and Lighthouse.

Assessment 2 built the core RSS server (REST API, database, Docker). This assessment adds a monitoring/reporting layer on top of that same foundation — every API request is now logged to the database, and a new dashboard page turns those logs into operational metrics: request totals, requests per feed/client, unique clients, and feed status summaries.

## Overview

The project contains two independent Next.js applications, unchanged in structure from Assessment 2:

- **`frontend/`** — the RSS Client. UI only, no API routes. Fetches data from the `api` service and renders it, including the new Dashboard page.
- **`api/`** — the RSS Server. REST API only, no UI pages. Uses Prisma to read and write a SQLite database, and now logs every request it serves.

They're deployed as separate Docker containers, connected over a shared network, with the database persisting in a named Docker volume.

## Tech Stack

- **Framework:** Next.js (App Router), React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database / ORM:** SQLite, Prisma (v5.19.1)
- **Fonts:** Spectral (headings), Inter (body) — loaded via `next/font/google`
- **State management:** React Context API (`SiteContext` / `SiteProvider`)
- **Containerisation:** Docker, Docker Compose
- **Testing:** Playwright (end-to-end), JMeter (load testing), Lighthouse (accessibility)
- **Version control:** Git, with feature-branch workflow

## Getting Started

### Option A — locally, without Docker

Requires Node.js v20 or later.

**1. Clone the repository**
```
git clone https://github.com/taylcasey/cse5006-assessment3.git
cd cse5006-assessment3
```

**2. Set up the API**
```
cd api
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```
API runs at [http://localhost:4000](http://localhost:4000)

**3. Set up the frontend** (in a separate terminal)
```
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Frontend runs at [http://localhost:3000](http://localhost:3000)

### Option B — with Docker

Requires Docker Desktop installed and running.

```
docker compose up --build
```

Once running, seed the containerized database (the container's startup only runs migrations, not the seed script):
```
docker exec -it cse5006-assessment3-api-1 npx prisma db seed
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:4000/api/health](http://localhost:4000/api/health)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

The database is stored in a named Docker volume, so data persists across container restarts and rebuilds.

## Project Structure

```
cse5006-assessment3/
├── frontend/                     # RSS Client (Next.js UI, no API routes)
│   ├── app/
│   │   ├── page.tsx                # Home
│   │   ├── about/                    # About page
│   │   ├── feeds/                      # Feeds list (create/edit/delete) + [id] post detail
│   │   ├── dashboard/                    # Data-driven dashboard: metrics, charts, alerts
│   │   ├── settings/                       # Theme and view mode preferences
│   │   ├── layout.tsx                        # Root layout, blocking theme-init script
│   │   └── globals.css                         # Design tokens, base styles
│   ├── components/                 # Header, Footer, NavBar, Breadcrumbs, ThemeToggle, ViewToggle
│   ├── context/                      # SiteContext / SiteProvider (theme + view state)
│   ├── lib/clientId.ts               # Generates/persists a per-browser client ID
│   └── Dockerfile
├── api/                           # RSS Server (Next.js API only, no UI pages)
│   ├── app/api/
│   │   ├── health/                   # Server health
│   │   ├── count/                      # In-memory request counter
│   │   ├── dashboard/                    # Aggregated metrics for the dashboard
│   │   ├── feeds/                          # Feed CRUD
│   │   ├── authors/                          # Author read/create
│   │   └── posts/                              # Post CRUD (with feed/author relations)
│   ├── lib/prisma.ts                # Shared Prisma client instance
│   ├── lib/requestLog.ts              # Shared logging helper, called from every route
│   ├── prisma/schema.prisma             # Feed, Author, Post, RequestLog models
│   ├── prisma/seed.ts                     # Generates simulated feeds/posts/logs
│   └── Dockerfile
├── e2e/                            # Playwright end-to-end tests
│   ├── tests/server-crud.spec.ts     # Server use case: full CRUD lifecycle via the API
│   ├── tests/client-view.spec.ts       # Client use case: viewing a post through the UI
│   └── playwright.config.ts
└── docker-compose.yml             # Orchestrates frontend + api + shared SQLite volume
```

## Database Schema

Four models, two one-to-many relationships plus a standalone logging table:

- **Feed** → has many **Posts**; also carries a `status` field (`active` / `inactive` / `error`)
- **Author** → has many **Posts**
- **Post** holds `feedId` and `authorId` foreign keys, linking back to both
- **RequestLog** — one row per API request received: endpoint, method, client ID, related feed (if any), status code, and timestamp. This table is what the dashboard's metrics are calculated from.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health |
| GET | `/api/count` | In-memory request counter |
| GET | `/api/dashboard` | Aggregated metrics: totals, requests by endpoint/feed/client, feed status summary |
| GET / POST | `/api/feeds` | List / create feeds |
| GET / PUT / DELETE | `/api/feeds/:id` | Read / update / delete a feed |
| GET / POST | `/api/authors` | List / create authors |
| GET / POST | `/api/posts` | List / create posts |
| GET / PUT / DELETE | `/api/posts/:id` | Read / update / delete a post |

Every route above (except `/api/health`) logs a `RequestLog` row on each call via a shared helper in `api/lib/requestLog.ts`, rather than duplicating logging logic per route.

## Dashboard & Observability

- **Client tracking:** the frontend generates a random ID on first visit, stores it in `localStorage`, and sends it as an `X-Client-Id` header on every request — a stand-in for identifying distinct visitors without a login system.
- **Simulated data:** `api/prisma/seed.ts` generates multiple feeds (including one deliberately set to `error` status), sample authors and posts, and roughly 400 historical request logs spread across the past two weeks, so the dashboard reflects realistic activity rather than empty tables.
- **Alerts:** the dashboard shows warning banners for three conditions — no feeds exist, feeds exist but have no posts, and any feed currently has an `error` status.

## Testing

- **Playwright** (`e2e/`) — one server-side test exercising the full CRUD lifecycle for a post via the API directly, and one client-side test that loads the Feeds page in a real browser and confirms navigation to a post's detail page.
- **JMeter** — load-tested the API at four staged levels (1, 10, 100, and 500 concurrent simulated users) against the feeds and posts endpoints. All levels completed with a 0% error rate; response times and consistency degraded noticeably from 100 users onward, consistent with SQLite's single-writer locking and the non-production dev server.
- **Lighthouse** — accessibility audited across all pages, desktop and mobile. One real issue was found and fixed: insufficient colour contrast on red alert/error elements, resolved by adding a dedicated `--danger` design token (separate light/dark values) in place of Tailwind's default red-500.

## Features

- **Data-driven dashboard** — real-time operational metrics sourced entirely from the database, not hardcoded
- **Full CRUD on the Feeds page** — create, edit, and delete posts directly from the UI, backed by real API calls
- **Live data** — Feeds list and post detail pages fetch from the database via the API, no static placeholder data
- **Responsive navigation** — horizontal nav bar on desktop, collapsing into an overlay hamburger menu on mobile, with sticky positioning
- **Breadcrumb navigation** — full trail on desktop, a single "Back" link on mobile, hidden on the homepage
- **Light/dark theme** — respects system preference by default, overridable and persisted via `localStorage`, applied via a blocking script before first paint to avoid a flash of the wrong theme
- **Card/list view toggle** for the Feeds page, also persisted via Context
- **Dockerized deployment** — both services run as separate containers with a shared, persistent database volume
- **Accessibility** — semantic HTML throughout, ARIA attributes, a sitewide keyboard-visible focus system, a skip-to-content link, and WCAG AA–verified colour contrast (contrast issue found via Lighthouse and fixed — see Testing above)

## Known Limitations / Future Work

- No authentication — the "posting as" author on new posts defaults to the first Author record in the database, since there's no login system establishing a current user
- Client ID tracking only works for requests made client-side (in the browser). The post detail page fetches server-side, so those specific requests log as `"unknown"` rather than a real client ID — a complete fix would need a cookie-based approach instead of `localStorage`
- `/api/count`'s in-memory counter resets on server restart and is separate from the dashboard's `totalRequests`, which is calculated from the persisted `RequestLog` table
- JMeter load testing was capped at 500 simulated concurrent users, chosen as a realistic ceiling for a single local development machine rather than a higher figure that would mostly demonstrate hardware limits rather than application behaviour
- The theme toggle control on the Settings page briefly renders a neutral placeholder immediately after a full page reload, to avoid a hydration mismatch

## Author

Taylor C. — Student No. 23012738
LaTrobe University — CSE5006
