# AGENTS.md — Ashborne v2

## Project State

- **Not yet implemented.** `src/` is empty. All roadmap items in `docs/roadmap.md` are unchecked.
- `package.json` has only devDependencies: `tsx`, `typescript`, `@types/node`.
- No test runner, linter, or formatter installed yet.
- **`docs/` is gitignored** — docs are local reference only, do not commit changes to them.

## What This Is

Terminal-based roguelike game using **React + Ink** (React terminal renderer). Follows Hexagonal Architecture with DDD bounded contexts.

## Architecture — Dependency Direction

```
ui/ → engine/*/application/ → engine/*/domain/ → shared/
infrastructure/ → shared/ (implements ports)
```

**Golden rule:** No layer imports from a more outer layer. `shared/` imports nothing.

## Path Aliases (tsconfig.json)

| Alias       | Maps to                |
| ----------- | ---------------------- |
| `@shared/*` | `src/shared/*`         |
| `@engine/*` | `src/engine/*`         |
| `@infra/*`  | `src/infrastructure/*` |
| `@ui/*`     | `src/ui/*`             |
| `@config/*` | `src/config/*`         |
| `@utils/*`  | `src/utils/*`          |

Always use aliases, never long relative imports.

## Two "Ink" Projects — Do Not Confuse

| Ink             | What                      | Purpose                                                                      |
| --------------- | ------------------------- | ---------------------------------------------------------------------------- |
| **Ink (Inkle)** | `.ink` narrative language | Author branching story, compiled via `inklecate` → JSON, runtime via `inkjs` |
| **Ink (React)** | npm package `ink`         | Render React components in the terminal                                      |

They work together: inkjs runs story JSON, Ink (React) renders the UI.

## Ink (Inkle) Workflow

- `.ink` files compile to JSON via `inklecate -o src/config/historia.json src/narrative/historia.ink`
- JSON is imported as `import storyJson from '@config/historia.json'`
- Tags in `.ink` (e.g., `# combate:goblin:1`) trigger TS logic
- External functions let `.ink` call TS: `story.BindExternalFunction('RollDado', ...)`
- See `docs/storytelling.md` for full integration details.

## File Naming Conventions

kebab-case with type suffixes:

| Suffix           | Type                        |
| ---------------- | --------------------------- |
| `.entity.ts`     | Domain class                |
| `.service.ts`    | Application/infra service   |
| `.port.ts`       | Interface (domain contract) |
| `.enum.ts`       | Enum                        |
| `.type.ts`       | Type alias                  |
| `.error.ts`      | Custom error class          |
| `.util.ts`       | Utility function            |
| `.config.ts`     | Static config               |
| `.factory.ts`    | Factory                     |
| `.adapter.ts`    | Infrastructure adapter      |
| `.screen.tsx`    | UI screen                   |
| `.component.tsx` | UI component                |
| `.hook.tsx`      | React hook                  |
| `.event.ts`      | Narrative event             |

## DI Pattern

- **Constructor injection only.** No `new` inside application/service classes.
- All dependencies assembled in `main.ts` (composition root).
- Ports are interfaces in `shared/ports/`; infrastructure implements them.

## TypeScript Strictness

`strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`. Declare return types on all public functions.

## Style

- Single quotes, semicolons always.
- Import order: built-ins → externals → ports → entities → siblings → utils.
- `type` for unions/tuples/mapped types; `interface` for extendable object contracts.

## Tests (when added)

- Framework: vitest (per roadmap).
- Mirror `src/` structure under `tests/`.
- AAA pattern. Mock ports, never implementation.
- No UI tests — logic only.

## Commands

- Run: `tsx src/main.ts`
- Typecheck: `npx tsc --noEmit`
- (No test/lint scripts defined yet — add them when tooling is installed.)

## Reference Docs

- `docs/architecture.md` — full architecture, folder structure, DI examples
- `docs/conventions.md` — coding style, test naming, commit conventions
- `docs/roadmap.md` — 12-phase implementation plan (follow one item at a time)
- `docs/storytelling.md` — ink/inkjs integration, save structure, tag conventions
