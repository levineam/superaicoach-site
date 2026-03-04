# SuperAI Coach — Marketing Site + Customer Mission Control

Minimal Next.js site for **superaicoach.com** with:
- marketing routes (`/`, `/philly`, resources)
- customer-safe Mission Control MVP (`/sign-in`, `/mission-control/*`)

## Run locally

```bash
cd /Users/andrew/clawd/superaicoach-site
npm install
npm run dev
```

Open:
- http://localhost:3000
- http://localhost:3000/philly
- http://localhost:3000/sign-in

For auth + tenant-shell smoke checks, keep the app on `npm run dev` (HTTP-local cookie behavior is dev-safe).

---

## Customer Mission Control (MVP)

### Routes

- `/sign-in` — magic-link sign in (preview link shown locally)
- `/auth/verify?token=...` — consumes one-time magic link + sets session cookie
- `/mission-control` — tenant-aware redirect
- `/mission-control/[tenantSlug]` — protected tenant shell

### Data model + migrations

Base schema migration:
- `supabase/migrations/20260219154500_customer_mission_control_mvp.sql`
  - `users`
  - `tenants`
  - `memberships`
  - `tenant_openclaw_endpoints`
  - `audit_log`

Runtime support migration:
- `supabase/migrations/20260219170500_customer_mission_control_runtime_tables.sql`
  - `mission_control_activities`
  - `mission_control_magic_links`

### DAL behavior (DB-first with safe fallback)

`src/lib/mission-control/data-access.ts` now supports:

1. **DB-backed mode** (Supabase/Postgres) when env is configured
2. **In-memory fallback mode** when DB env is missing (local/dev safety)

DB mode auto-bootstraps a default `vai` tenant if missing. It can also auto-seed:
- owner membership
- starter activity feed rows (for shell data load)
- a primary endpoint when endpoint env vars are provided

If runtime tables are not migrated yet, bootstrap safely skips activity seeding instead of hard-failing.

---

## Required environment variables

### Core security

- `MISSION_CONTROL_SESSION_SECRET`
  - Strong random string used to sign session cookies.
- `MISSION_CONTROL_TOKEN_ENCRYPTION_KEY`
  - Base64-encoded 32-byte key used for endpoint token encryption at rest.

Generate key example:

```bash
openssl rand -base64 32
```

### DB mode enablement (Supabase/Postgres)

Use either pair:

- `MISSION_CONTROL_SUPABASE_URL`
- `MISSION_CONTROL_SUPABASE_SERVICE_ROLE_KEY`

or:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Optional bootstrap defaults

- `MISSION_CONTROL_DEFAULT_TENANT_SLUG` (default: `vai`)
- `MISSION_CONTROL_DEFAULT_TENANT_NAME` (default: `Vai Pilot Tenant`)
- `MISSION_CONTROL_DEFAULT_OWNER_EMAIL` (optional; seeds owner membership)

### Optional Vai endpoint mapping

- `MISSION_CONTROL_VAI_ENDPOINT_URL`
- `MISSION_CONTROL_VAI_ENDPOINT_TOKEN`
- `MISSION_CONTROL_VAI_ENDPOINT_LABEL` (default: `Vai OpenClaw Primary`)

For a **real** Vai pilot run (non-simulated), URL + token are required.

### Endpoint adapter routing

- `MISSION_CONTROL_ENDPOINT_ACTION_PATH` (default: `/api/mission-control/customer-action`)
- `MISSION_CONTROL_ENDPOINT_ACTION_METHOD` (default: `POST`)
- `MISSION_CONTROL_ENDPOINT_ACTION_FALLBACK_PATHS` (optional CSV, default includes `/api/mission-control/actions`)
- `MISSION_CONTROL_ENDPOINT_ACTION_FALLBACK_METHODS` (optional CSV, default tries the opposite of primary method)
- `MISSION_CONTROL_ENDPOINT_TIMEOUT_MS` (default: `15000`)
- `MISSION_CONTROL_ENDPOINT_SIMULATION_ONLY` (`true` to force simulated routing)

Routing behavior:
- primary call uses configured path + method
- on `404`/`405`, Mission Control automatically tries compatibility fallbacks (method/path)
- low-risk read actions (`view_status`, `view_activity`, `refresh_status`) also try read-only GET fallback paths

---

## Apply migrations + bootstrap (DB mode)

Run your Supabase migration flow, then optional bootstrap:

```bash
npm run mission-control:bootstrap
```

Bootstrap script: `scripts/mission-control-bootstrap.mjs`

It will:
- upsert tenant
- upsert owner user (defaulting to `vai.owner@example.com` if not provided)
- upsert owner membership
- seed starter activity rows when runtime tables exist
- optionally insert a primary endpoint mapping (if endpoint env is provided)

---

## Local smoke check (sign-in + tenant shell)

With dev server running (`npm run dev`):

```bash
npm run mission-control:smoke
# optional custom base URL:
# MISSION_CONTROL_SMOKE_BASE_URL=http://localhost:3006 npm run mission-control:smoke
```

Smoke script: `scripts/mission-control-smoke.mjs`

Checks performed:
- magic-link generation
- verify-token redirect + session cookie issue
- tenant shell load
- confirmation gate (`428`) for medium-risk action
- confirmed action response
- audit feed load

### Endpoint handshake smoke (real endpoint contract)

Use this when validating real endpoint method/path compatibility (including `405` fallback handling):

```bash
npm run mission-control:endpoint-handshake
# optional:
# MISSION_CONTROL_HANDSHAKE_ACTION=view_status npm run mission-control:endpoint-handshake
```

Script: `scripts/mission-control-endpoint-handshake.mjs`

It reports each attempted method/path and exits `0` only when a compatible endpoint response is found.

---

## API surface

- `POST /api/auth/magic-link`
- `POST /api/auth/sign-out`
- `POST /api/mission-control/actions`
- `GET /api/mission-control/audit`

`/api/mission-control/actions` enforces:
- tenant membership
- role allowlist
- pilot-mode restrictions
- confirmation step for medium-risk actions
- audit logging

---

## Role/copy defaults (MVP shipped)

Default role capability copy is implemented in `src/lib/mission-control/permissions.ts` and rendered in the action panel.

- **Owner**: all customer-safe actions + confirmed safe workflow reruns
- **Team member**: same customer-safe action set as owner for pilot MVP
- **Coach**: read/refresh/support actions only (no safe workflow rerun)

Confirmation copy now clearly states tenant + action scope before execution.

> Andrew-review checkpoint: capability wording can still be refined after pilot feedback; current defaults are shipping-safe.

---

## Notes

- Deployed via Vercel project `superaicoach-site`.
- In Vercel project settings (monorepo), set Root Directory to `superaicoach-site`.
- PRs should produce a public Vercel preview deployment.
