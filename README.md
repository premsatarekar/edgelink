# SEO Automation Dashboard

Automated SEO audits for local business websites. A BullMQ worker crawls a site, collects SEO signals, sends them to Claude for analysis, stores the result in Postgres, generates a PDF report and delivers it. A Next.js app provides an admin portal and a client dashboard.

Built for the EdgeLink Technology assessment (AI Developer and Automation Engineer).

## Stack

| Layer | Technology |
|---|---|
| App | Next.js 14 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| Database | Postgres on Neon, Prisma 6 |
| Queue | BullMQ on Upstash Redis |
| Crawling | fetch + Cheerio |
| AI analysis | Anthropic Claude (`claude-sonnet-4-6`), zod-validated JSON |
| PDF | Puppeteer |
| Validation and feedback | zod, sonner toasts |

## Audit pipeline

```
Admin clicks "Run audit" (or cron-job.org calls /api/cron/audit)
        |
        v
POST /api/audits  ->  Audit row (QUEUED)  ->  BullMQ queue "seo-audit-jobs"
        |
        v
Worker (separate Node process) runs, saving progress to the database after each step:
   10%  Step 1  fetch + Cheerio crawl
   25%  Step 2  PageSpeed Insights            (mock)
   35%  Step 3  Google Search Console         (mock)
   45%  Step 4  Schema.org validation
   55%  Step 5  On-page analysis
   65%  Step 6  robots.txt + sitemap.xml
   75%  Step 7  DataForSEO rankings           (mock)
   85%  Claude analysis                       (mock by default, real code included)
   90%  Result saved to Postgres
   95%  PDF report generated (/tmp/reports)
   98%  WhatsApp + email delivery             (mock, console log)
  100%  COMPLETED
```

The admin UI polls `GET /api/audits/[id]` every 2 seconds to show live progress. A failure at any step sets the audit to `FAILED` with a short message.

## Mock versus real

One flag controls it: `USE_MOCKS` (default `true`). Mock data files are in `src/mocks/` and are copied as given in the assessment document.

| Integration | Status |
|---|---|
| Neon Postgres | Real |
| Upstash Redis and BullMQ | Real |
| Site crawl, schema, on-page, robots.txt, sitemap | Real (runs against the live site) |
| Google PageSpeed Insights, Search Console, DataForSEO | Mock |
| Twilio WhatsApp and email delivery | Mock (console log) |
| PDF storage | Local `/tmp/reports` (replaces Cloudflare R2) |
| Claude analysis | Mock by default. Real call is implemented in `src/ai/analyze.ts` |

Notes on honesty:

- The mock Claude result is the same static, schema-valid result for every site. It is only there so the full pipeline runs without an API key. The crawl data in the pipeline is real.
- Real Claude was not run for this submission (no paid API key). The real path exists: `npm run test:analysis -- <url> --real` with `ANTHROPIC_API_KEY` set. The response is parsed, validated with zod and retried once if invalid.
- With `USE_MOCKS=false`, the PageSpeed, Search Console, DataForSEO and delivery modules throw a clear "not implemented yet" error, because those real integrations were out of scope.

## Getting started

Requirements: Node 20.6 or newer, a Neon database, an Upstash Redis database.

```bash
npm install
npx puppeteer browsers install chrome   # downloads Chrome for PDF generation
cp .env.example .env                    # then fill in the values
npm run db:push                         # creates the tables
```

Run two processes in separate terminals:

```bash
npm run dev      # Next.js app on http://localhost:3000
npm run worker   # BullMQ worker (needed for audits to run)
```

Open `http://localhost:3000`. Add a client, then press "Run audit".

### Environment variables

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Pooled Neon connection string (used by the app) |
| `DIRECT_URL` | Direct Neon connection string (used by `prisma db push`) |
| `REDIS_URL` | Upstash Redis URL, starts with `rediss://` |
| `ANTHROPIC_API_KEY` | Optional. Only needed for real Claude calls |
| `CRON_SECRET` | At least 16 characters. Protects `/api/cron/audit` |
| `USE_MOCKS` | `true` runs the pipeline on mock data |

Variables are validated at startup with zod (`src/lib/env.ts`), so a missing value fails fast with a clear message.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js app |
| `npm run worker` | Starts the BullMQ worker |
| `npm run db:push` / `db:studio` | Syncs the Prisma schema / opens Prisma Studio |
| `npm run check:connections` | Checks Postgres and Redis |
| `npm run test:crawlers -- <url>` | Runs every crawl step on a URL |
| `npm run test:analysis -- <url> [--real]` | Runs crawl plus Claude analysis |
| `npm run test:enqueue -- <url>` | Queues an audit and prints progress |

## Pages and API

| Page | Purpose |
|---|---|
| `/admin/clients` | Client list, add-client form, Run audit with live progress |
| `/admin/audits` | Audit history with status, score, report and PDF links |
| `/admin/audits/[id]` | Full report: score, breakdown, issues, quick wins, recommendations |
| `/dashboard/[clientId]` | Client-facing report: score, breakdown, critical issues, quick wins, PDF, score history |

| Endpoint | Purpose |
|---|---|
| `GET /api/clients`, `POST /api/clients` | List and create clients (zod validated) |
| `GET /api/audits`, `POST /api/audits` | List audits, create and queue an audit (202) |
| `GET /api/audits/[id]` | Status, progress, scores and the full result |
| `GET /api/audits/[id]/pdf` | PDF download |
| `GET /api/cron/audit` | For cron-job.org. Needs `Authorization: Bearer <CRON_SECRET>` |

Responses use `{ data }` on success and `{ error, details? }` on failure, with proper status codes (400 validation, 404, 409 audit already running, 401 cron, 503 queue unavailable).

### Cron

Create a job on cron-job.org that calls `GET https://<your-app>/api/cron/audit` with the header `Authorization: Bearer <CRON_SECRET>`. Each call queues audits for up to 3 clients that have had no audit in the last 30 days. Once a day is enough.

## Database

Two models in `prisma/schema.prisma`: `Client` (name, website, business type, city, state, contact details) and `Audit` (status `QUEUED | RUNNING | COMPLETED | FAILED`, progress, current step, overall score, score breakdown JSON, full Claude result JSON, PDF path, error message, timestamps).

## Project structure

```
src/
  app/            pages (admin, dashboard) and API route handlers
  components/     admin/, audit/ and shadcn ui/
  crawlers/       fetcher, onpage, schema, technical + mock-switched PageSpeed, GSC, DataForSEO
  ai/             Claude prompt and analysis (zod validation, one retry)
  workers/        audit pipeline and BullMQ worker
  queue/          queue definition and Redis connection options
  reports/        PDF template and generator
  delivery/       WhatsApp and email delivery (mock)
  mocks/          USE_MOCKS switch and mock data
  lib/            env, prisma, validations, queries, api helpers
  data/, types/   UI copy and shared types
prisma/schema.prisma
scripts/          developer scripts (connection check, crawler test, enqueue test)
```

## Decisions and trade-offs

- **TypeScript** (allowed in the assessment clarification). Mock files stay as JavaScript, exactly as provided.
- **Prisma schema and audit routes** are my own design, as the assessment left those sections open.
- **Worker runs as a separate Node process.** BullMQ workers are long-running and Puppeteer is heavy, so they do not fit Vercel's serverless limits. Vercel hosts the Next.js app and API; the worker runs on a VPS or locally.
- **Audit routes return 202 immediately** and the worker does the long job, so API routes stay far below the 10 second limit.
- **SSRF protection** in the crawler: only public http(s) URLs, private and local addresses are rejected.
- **Upstash free tier:** worker concurrency is 1 and idle polling is reduced (`drainDelay` 30 s) to save commands. Stop the worker when it is not needed.
- **Server components read the database directly** for lists and reports; client components are used only where interaction is needed (forms, polling).

## Known limitations

- No authentication. Admin pages and the client dashboard link (unguessable id) are open. Out of scope for this assessment.
- PDFs are stored on the local disk (`/tmp/reports`). PDF download only works where the API and the worker share a file system. Production needs object storage such as R2.
- Real PageSpeed, Search Console, DataForSEO, Twilio and email integrations are not implemented.
- No automated test suite. Verification is done with the developer scripts above.