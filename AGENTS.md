# Repository Guidelines

## Project Structure & Module Organization
- Monorepo with Bun workspaces under `packages/`.
- `packages/frontend/`: Next.js 15 app, Tailwind, OpenNext Cloudflare output.
- `packages/backend/`: Hono + Cloudflare Workers API, Drizzle ORM, D1 database.
- `packages/shared/`: Shared types, schemas, and utilities.
- `docs/`: documentation (Docsify). `scripts/`: repo tooling scripts.
- Database migrations live under `packages/backend/drizzle/`.

## Build, Test, and Development Commands
- `bun install`: install workspace dependencies.
- `bun run dev`: run frontend + backend in parallel.
- `bun run dev:frontend` / `bun run dev:backend`: run one side only.
- `bun run build:frontend` / `bun run build:backend`: build each package.
- `bun run deploy:frontend` / `bun run deploy:backend`: deploy via Wrangler/OpenNext.
- `bun run format` / `bun run lint` / `bun run check`: Biome format/lint/check.
- Backend DB:
  - `bun --filter '@kotobad/backend' generate` (Drizzle schema gen)
  - `bun --filter '@kotobad/backend' local:migration` or `remote:migration`

## Coding Style & Naming Conventions
- Indentation: tabs (Biome formatter). Quotes: double (Biome).
- TypeScript throughout; prefer explicit types over implicit any.
- Use Drizzle ORM for DB access; avoid raw SQL unless required.
- Keep files organized by feature under `packages/*/src/...`.

## Testing Guidelines
- No automated test framework detected. If adding tests, document how to run them and keep naming consistent (e.g., `*.test.ts`).

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (seen in history: `feat:`, `fix:`).
- Keep commits scoped and descriptive.
- For PRs: include a short summary, affected packages, and any deploy/test steps.

## Security & Configuration Tips
- Cloudflare config lives in `packages/*/wrangler.jsonc` and `packages/frontend/open-next.config.ts`.
- Avoid committing secrets; use Wrangler/Cloudflare bindings and env vars.
