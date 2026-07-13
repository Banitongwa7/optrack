# OpTrack

OpTrack centralizes internship, job, apprenticeship and freelance opportunities across countries. Explore them in a searchable table, on an interactive world map, or through analytics dashboards.

Built with [Next.js 14](https://nextjs.org/) (App Router), [Prisma](https://www.prisma.io/) + PostgreSQL, [Tailwind CSS](https://tailwindcss.com/), [Chart.js](https://www.chartjs.org/) and [react-simple-maps](https://www.react-simple-maps.io/).

## Features

- **Dashboard** — live counters (opportunities, countries, companies, domains), opportunities by year, breakdown by type, latest entries, open/closed and remote/on-site overview.
- **Map** — opportunities by country on Google Maps (proportional markers) or a built-in world choropleth, with month/year filters, zoom, hover tooltips and a ranked side panel; click a country (or the ranking list) to jump to its filtered data.
- **Analytics** — top countries, breakdown by domain, evolution by year, work mode and open-vs-closed charts.
- **Explore Data** — paginated table with full-text search; country, type, domain, year, status and work-mode filters; sortable columns; a detail sheet per opportunity; CSV export of the current view; shareable filter URLs.

OpTrack is **read-only by design**: the web app is for consulting opportunities, not editing them. Data is managed through the seed script or `npx prisma studio`.

## Getting started

### 1. Database

The app needs a PostgreSQL database. Two options:

**Remote (Neon, Vercel Postgres, Supabase…):** put the connection strings in `.env`:

```bash
DATABASE_URL="postgres://…-pooler…/db?sslmode=require"      # pooled (runtime)
DATABASE_URL_UNPOOLED="postgres://…/db?sslmode=require"     # direct (migrations)
```

**Local (no install needed):** an embedded PostgreSQL is bundled for development. `.env.local` already points to it.

```bash
npm run db:local   # starts PostgreSQL on localhost:5502 (keep it running)
```

### 2. Install, migrate, seed

```bash
npm install            # also runs prisma generate
npm run db:migrate     # applies prisma/migrations
npm run db:seed        # inserts 120 demo opportunities (skips if data exists)
```

### 3. Google Maps (optional)

The map page has two views: a built-in world choropleth (no setup) and a Google Maps view. To enable the latter, create an API key in the [Google Cloud console](https://console.cloud.google.com/google/maps-apis) (enable **Maps JavaScript API**) and add it to `.env.local` (and to the hosting environment in production):

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-map-id   # optional, for custom styling
```

Without a key the app automatically falls back to the world view.

### 4. Run

```bash
npm run dev            # http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run db:local` | Start the embedded local PostgreSQL (dev only) |
| `npm run db:migrate` | Apply Prisma migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed demo data (`FORCE_SEED=1` to wipe and reseed) |

## API

The API is read-only.

| Endpoint | Description |
|---|---|
| `GET /api/opportunity?page=1&search=&country=&type=&domain=&status=&year=&remote=&sort=&dir=` | Paginated list (10/page) with filters and sorting |
| `GET /api/opportunity/:id` | One opportunity |
| `GET /api/opportunity/export?…` | CSV export (same filters as the list) |
| `GET /api/stats?year=&month=` | Aggregates for dashboard, analytics and map |

## Deploying to Vercel

1. Create a PostgreSQL database (e.g. [Neon](https://neon.tech) or Vercel Marketplace → Neon) and note the pooled + direct connection strings.
2. In the Vercel project settings, set the environment variables `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct). Connecting the Neon integration sets them automatically.
3. Deploy. `prisma generate` runs automatically via `postinstall`.
4. Apply migrations and seed once, from your machine, against the production database:

```bash
DATABASE_URL="<pooled-url>" DATABASE_URL_UNPOOLED="<direct-url>" npx prisma migrate deploy
DATABASE_URL="<pooled-url>" DATABASE_URL_UNPOOLED="<direct-url>" npx prisma db seed
```
