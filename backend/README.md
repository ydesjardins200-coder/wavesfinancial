# Waves Financial — Backend

This folder documents the backend infrastructure for Waves Financial.

The backend runs as a separate Node.js service hosted on Railway.
**Repo:** https://github.com/ydesjardins200-coder/waves-backend

---

## Architecture

```
wavesfinancial.ca  (this repo — Netlify)
  ├── apply.html          → submits to Railway backend
  ├── admin.html          → reads from Supabase directly (anon key)
  └── backend/            → you are here (docs + config reference)

waves-backend  (Railway)
  ├── server.js           → Express server, two endpoints
  ├── decisionResolver.js → full pipeline orchestrator
  ├── scoringEngine.js    → pure scoring function (208 tests)
  ├── flinksFetcher.js    → Flinks API + mock data
  ├── db.js               → Supabase database operations
  └── supabaseClient.js   → shared Supabase client
```

## Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET`  | `/health` | Server health check |
| `GET`  | `/debug`  | Supabase connection test |
| `POST` | `/api/apply/new` | New loan application |
| `POST` | `/api/apply/renewal` | Loan renewal |

**Live URL:** https://web-production-31ce.up.railway.app

---

## Environment Variables (Railway)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_API_KEY` | Supabase **service_role** key |
| `FLINKS_BASE_URL` | Flinks API base URL |
| `FLINKS_API_KEY` | Flinks API key |
| `ALLOWED_ORIGINS` | `https://wavesfinancial.ca,https://wavesfinancials.netlify.app` |

---

## Database (Supabase)

**Project URL:** https://rutupqpzvfeubzpnqujn.supabase.co

Tables:
- `applications` — every loan application with full scoring result
- `review_queue` — view of unreviewed manual_review applications

Setup SQL: see `waves-backend/supabase-setup.sql`

---

## Decisioning Engine

Risk score 0–100 (lower = better):

| Tier | Score | Decision |
|------|-------|----------|
| 🥇 Gold | 0–15 | Auto-approved |
| 🟢 Green | 15–30 | Manual review |
| 🔵 Blue | 30–50 | Manual review |
| 🟡 Yellow | 50–70 | Manual review |
| 🟠 Orange | 70–90 | Manual review (feasible amount surfaced) |
| 🔴 Red | 90–100 | Auto-declined |

Scoring signals:
- NSF events (25 pts max)
- Payment oppositions (20 pts max)
- DTI ratio (20 pts max) — limit: 75%
- Income regularity (15 pts max)
- Income mismatch (10 pts max)
- Balance cushion (10 pts max)

---

## Go-Live Checklist

- [ ] Replace `YOUR_FLINKS_CLIENT_ID` in `apply.html` with real Flinks iframe URL
- [ ] Set real `FLINKS_API_KEY` in Railway
- [ ] Set `FLINKS_BASE_URL` to production Flinks URL
- [ ] Replace placeholder phone number `1-800-123-4567` in `apply.html`
- [ ] Replace `[Parent Co.]` with real company name
- [ ] Remove dummy fill buttons from `apply.html`
- [ ] Remove pre-check checkbox code from `apply.html`
- [ ] Remove `/debug` endpoint from `server.js`
