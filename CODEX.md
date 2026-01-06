# Codex Notes

## Repository Overview
- Full-stack e-commerce monorepo migrating a legacy PHP platform to a modern TypeScript stack.
- Core apps: `backend/` (NestJS + Prisma + PostgreSQL), `frontend/` (Next.js storefront), `admin/` (Next.js admin dashboard).
- Supporting assets: `php/` (legacy resources), `postgres/` (database tooling/data), `DOC/` (deployment and reference docs), Docker compose variants for dev/prod/swarm/db/pgadmin, environment templates across services.
- Root tooling: `package.json` scripts orchestrate installs, builds, tests, Docker workflows; `setup.sh` provides scripted provisioning.

## QWEN.md Highlights
- Emphasizes the migration narrative, describing backend API features (JWT auth, image handling, product/catalog services) and dual Next.js frontends.
- Provides prerequisite stack (Node 18, PostgreSQL 15, Docker) plus Docker-first startup instructions with service endpoints.
- Details manual local setup, including Prisma migrations, image migration commands, and per-app development flows.
- Lists consolidated npm scripts for backend, frontend/admin, and root-level workflows (build/test/docker operations).
- Summarizes infrastructure artifacts: multiple compose files, Traefik-ready Swarm deployment, environment variable expectations, PGAdmin configuration, and key feature checklists for backend, admin, and migration tooling.

## CLAUDE.md Highlights
- Serves as an extensive operator manual for Claude Code with deep dive into commands, architecture, and workflows.
- Enumerates comprehensive npm scripts for setup, dev/prod cycles, testing, database tasks, Docker exec utilities, and legacy image migrations.
- Documents technology stack choices (NestJS, Next.js 14 App Router, Tailwind, Zustand, React Query, PostgreSQL) and advanced image management schema (Image relations, size/type enums).
- Maps API surface (auth, products, brands/categories), frontend routing patterns, Docker service layout, environment defaults, and recommended credentials/ports.
- Captures legacy migration strategy, daily development checklist, and outcomes from a large-scale data integrity/testing session (duplicate fixes, price conversion, search verification, tooling scripts, performance metrics, future optimization recommendations).

## Key Takeaways for Codex
- Favor Docker-based workflows unless specific local overrides are needed; Prisma migrations and seeding have both local and container variants.
- Image handling is central: multiple scripts, enums, and relations maintain consistency between legacy PHP assets and the new system.
- Testing and maintenance expectations are high—root scripts cover unit/e2e tests, data quality tooling, and database resets; follow documented migration/testing procedures before deployments.
- Environment configs are distributed (.env files per service plus templates); ensure JWT, database, and Traefik/domain details align with target environment when deploying.
