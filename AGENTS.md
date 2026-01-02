# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Next.js App Router pages, layouts, and route files.
- `components/` contains reusable UI components (PascalCase filenames).
- `lib/` provides shared utilities and domain logic (kebab-case modules).
- `services/` stores service-layer integrations (e.g., lead scoring, i18n).
- `data/`, `i18n/`, and `locales/` contain structured content and translations.
- `public/` is for static assets; `tests/` has unit/integration suites.
- `docs/` and `monitoring/` include operational and observability references.

## Build, Test, and Development Commands
- `npm run dev` starts the local Next.js dev server.
- `npm run build` creates a production build; `npm run start` serves it.
- `npm run lint` runs Next.js ESLint rules.
- `npm run type-check` performs a TypeScript no-emit check.
- `npm run format` applies Prettier (including Tailwind class sorting).
- Testing uses Jest (`jest.config.js`). See `tests/README_TESTING.md`.
  Example: `npx jest --config jest.config.js` or run the scripts listed in
  `package.testing.json` after installing its devDependencies.

## Coding Style & Naming Conventions
- Indentation: 2 spaces, LF line endings, single quotes, semicolons.
- Formatting: Prettier with `prettier-plugin-tailwindcss`.
- Linting: ESLint with `next/core-web-vitals` and `next/typescript`.
- Naming: React components use PascalCase (`components/PropertyGallery.tsx`),
  utilities use kebab-case (`lib/whatsapp-queue.ts`), tests use `*.test.ts`.

## Testing Guidelines
- Framework: Jest + ts-jest, with globals in `tests/setup-tests.ts`.
- Structure: `tests/unit/` and `tests/integration/`.
- Naming: `*.test.ts` and `__tests__/` are both supported.
- Coverage: 80% global thresholds (branches/functions/lines/statements).

## Commit & Pull Request Guidelines
- Commit history favors Conventional Commits (e.g., `feat: add i18n support`).
  Use `type: short imperative summary`, and avoid generic messages.
- PRs should include: clear description, linked issue (if any), test evidence,
  and UI screenshots when changes affect the frontend.

## Security & Configuration Tips
- Use `.env.example` as the baseline; do not commit real secrets.
- For local services, `docker-compose.yml` covers Redis and supporting tools.
