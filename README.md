# RSS Server + Client for LMS — Assessment 2

CSE5006 — Assessment 2: extends the Assessment 1 frontend with backend layer — a REST API, a Prisma-managed SQLite database, and Docker containerization — creating a working RSS server and client foundation.

Assessment 1 focused solely on the frontend interface with static placeholder data - this assessment adds a separate Next.js API service with an ORM database, full CRUD operations, and a Dockerized deployment that can be reproduced consistently across environments.

## Overview

The project contains two independent Next.js applications:

- **`frontend/`** — the RSS Client. UI only, no API routes. Fetches data from the `api` service and renders it.
- **`api/`** — the RSS Server. REST API only, no UI pages. Uses Prisma to read and write a SQLite database.

They're deployed as separate Docker containers, connected over a shared network, with the database persisting in a named Docker volume.

## Tech Stack

- **Framework:** Next.js (App Router), React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database / ORM:** SQLite, Prisma (v5.19.1)
- **Fonts:** Spectral (headings), Inter (body) — loaded via `next/font/google`
- **State management:** React Context API (`SiteContext` / `SiteProvider`)
- **Containerisation:** Docker, Docker Compose
- **Version control:** Git, with feature-branch workflow

## Getting Started

### Option A — locally, without Docker

Requires Node.js v20 or later.

**1. Clone the repository**
```
git clone https://github.com/taylcasey/cse5006-assessment2.git
cd cse5006-assessment2
```

**2. Set up the API**
```
cd api
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
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

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:4000/api/health](http://localhost:4000/api/health)

The database is stored in a named Docker volume, so data persists across container restarts and rebuilds.

## Project Structure

```
cse5006-assessment2/
├── frontend/                     # RSS Client (Next.js UI, no API routes)
│   ├── app/
│   │   ├── page.tsx                # Home
│   │   ├── about/                    # About page
│   │   ├── feeds/                      # Feeds list (create/edit/delete) + [id] post detail
│   │   ├── settings/                     # Theme and view mode preferences
│   │   ├── layout.tsx                      # Root layout, blocking theme-init script
│   │   └── globals.css                       # Design tokens, base styles
│   ├── components/                 # Header, Footer, NavBar, Breadcrumbs, ThemeToggle, ViewToggle
│   ├── context/                      # SiteContext / SiteProvider (theme + view state)
│   └── Dockerfile
├── api/                           # RSS Server (Next.js API only, no UI pages)
│   ├── app/api/
│   │   ├── health/                   # Server health
│   │   ├── count/                      # Request counter
│   │   ├── feeds/                        # Feed CRUD
│   │   ├── authors/                        # Author read/create
│   │   └── posts/                            # Post CRUD (with feed/author relations)
│   ├── lib/prisma.ts                # Shared Prisma client instance
│   ├── prisma/schema.prisma           # Feed, Author, Post models
│   └── Dockerfile
└── docker-compose.yml             # Orchestrates frontend + api + shared SQLite volume
```

## Database Schema

Three models with two one-to-many relationships:

- **Feed** → has many **Posts**
- **Author** → has many **Posts**
- **Post** holds `feedId` and `authorId` foreign keys, linking back to both

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health |
| GET | `/api/count` | Request counter |
| GET / POST | `/api/feeds` | List / create feeds |
| GET / PUT / DELETE | `/api/feeds/:id` | Read / update / delete a feed |
| GET / POST | `/api/authors` | List / create authors |
| GET / POST | `/api/posts` | List / create posts |
| GET / PUT / DELETE | `/api/posts/:id` | Read / update / delete a post |

## Features

- **Full CRUD on the Feeds page** — create, edit, and delete posts directly from the UI, backed by real API calls
- **Live data** — Feeds list and post detail pages fetch from the database via the API, no static placeholder data
- **Responsive navigation** — horizontal nav bar on desktop, collapsing into an overlay hamburger menu on mobile, with sticky positioning
- **Breadcrumb navigation** — full trail on desktop, a single "Back" link on mobile, hidden on the homepage
- **Light/dark theme** — respects system preference by default, overridable and persisted via `localStorage`, applied via a blocking script before first paint to avoid a flash of the wrong theme
- **Card/list view toggle** for the Feeds page, also persisted via Context
- **Dockerized deployment** — both services run as separate containers with a shared, persistent database volume
- **Accessibility** — semantic HTML throughout, ARIA attributes (`aria-expanded`, `aria-pressed`, `aria-current`, `aria-labelledby`, etc.), a sitewide keyboard-visible focus system, a skip-to-content link, and WCAG AA–verified colour contrast across both themes

## Known Limitations / Future Work

- No authentication — the "posting as" author on new posts defaults to the first Author record in the database, since there's no login system establishing a current user
- Author selection for new posts is not user-facing by design (see above); a login system would be needed to support this properly
- The theme toggle control on the Settings page briefly renders a neutral placeholder immediately after a full page reload, to avoid a hydration mismatch

## Author

Taylor C. — Student No. 23012738
LaTrobe University — CSE5006