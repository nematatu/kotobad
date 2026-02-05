# Repository Guidelines

## Project Overview
- **kotobad** is a badminton bulletin board site (threads + posts) at `https://kotobad.com`.
- Monorepo with Bun workspaces. Frontend is Next.js (App Router) on Cloudflare via OpenNext; backend is Hono on Workers with D1.
- Shared types/schemas live in `packages/shared` and are used across the app.

## Project Structure & Module Organization
- `packages/frontend/`: Next.js 15, Tailwind, OpenNext config, UI components.
  - App routes under `packages/frontend/src/app`.
  - Static assets under `packages/frontend/public`.
- `packages/backend/`: Hono API, Drizzle ORM, D1 migrations.
  - API routes under `packages/backend/src/routes`.
  - Drizzle schema + migrations under `packages/backend/drizzle/`.
- `packages/shared/`: Zod schemas, shared types, constants.
- `scripts/`: repo tooling (build checks, docs helpers).
- `docs/`: documentation.
  - `docs/incidents/`: incident reports and operational notes.
  - `docs/agent-logs/`: AI handoff logs.
  - `docs/performance/`: performance notes and findings.
  - `docs/_sidebar.md`: Docsify sidebar source.

## Build, Test, and Development Commands
- `bun run dev`: run frontend + backend concurrently.
- `bun run dev:frontend` / `bun run dev:backend`: run a single side.
- `bun run build:frontend` / `bun run build:backend`: build each package.
- `bun run deploy:frontend` / `bun run deploy:backend`: deploy via Wrangler/OpenNext.
- `bun run format` / `bun run lint` / `bun run check`: Biome format/lint/check.
- Backend DB (Drizzle + D1):
  - `bun --filter '@kotobad/backend' generate`
  - `bun --filter '@kotobad/backend' local:migration`
  - `bun --filter '@kotobad/backend' remote:migration`

## Coding Style & Naming Conventions
- Indentation: **tabs** (Biome). Quotes: **double** (Biome).
- TypeScript everywhere; avoid implicit `any`.
- DB access: **Drizzle ORM only** (no ad-hoc SQL).
- Keep changes minimal and targeted; avoid formatting unrelated files.

## Static Assets Consistency (Critical)
- There is a build-time check to prevent deleted `/_next/static/*` assets from being referenced by cached CSS/JS.
- Script: `scripts/check-save-next-static-assets.ts`
  - Scans `.open-next/assets/_next/static/**/*.css|js` for `/_next/static/...` refs.
  - Compares against the R2 snapshot and fails if a referenced asset is missing.
  - Saves the updated snapshot to R2 on success.
- Required env vars: `R2_SNAPSHOT_BUCKET`, `R2_KEY`.
  - Optional: `WRANGLER_CONFIG`, `WRANGLER_BIN`, `ASSETS_DIR`, `SNAPSHOT_FILE`.

## Documentation Consistency (Required)
- **You must check and fix doc/implementation mismatches after every change. This is mandatory.**
- Review **all** documentation under `docs/` after every change (do not rely on subdirectory lists).
- Do not introduce automated doc-check scripts (per user request). The check is required and must be done by the agent.

## Testing Guidelines
- No test runner configured yet. If adding tests, document how to run them.

## Commit & Pull Request Guidelines
- Commit messages follow **Conventional Commits** (e.g., `feat:`, `fix:`).
- Keep commits scoped; include command output or logs for operational changes.

## Agent-Specific Instructions
- Use **polite Japanese** in responses.
- Do not create migrations or write raw SQL without explicit instruction.
- Do not reformat `package.json` or unrelated files.
- Avoid forced type casts (`as unknown as ...`).
