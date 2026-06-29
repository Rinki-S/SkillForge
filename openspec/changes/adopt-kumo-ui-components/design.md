## Context

SkillForge 的前端是 React + Vite + Tailwind 3，并在 `redesign-frontend-cloudflare-console` change 中被重构为 Cloudflare-inspired 控制台体验。当前底层 UI 仍主要由项目内 wrapper 和自定义 Tailwind class 组成：

- `frontend/src/components/ui/Button.tsx`
- `frontend/src/components/ui/Input.tsx`
- `frontend/src/components/ui/Select.tsx`
- `frontend/src/components/ui/Card.tsx`
- `frontend/src/components/ui/Console.tsx`
- `frontend/src/components/states/QueryStates.tsx`

这些 wrapper 被各页面广泛使用，页面层目前不直接依赖第三方 UI 组件。这个结构适合作为 Kumo 迁移的适配层：先把 wrapper 内部迁移到 Kumo，再在必要时调整页面 markup。

Kumo 是 Cloudflare 的 React component library for product interfaces。文档要点：

- NPM package: `@cloudflare/kumo`
- Required peer dependency includes `@phosphor-icons/react`
- Components can be imported from `@cloudflare/kumo` or granular paths such as `@cloudflare/kumo/components/button`
- Kumo built on Base UI and re-exports primitives
- Kumo distinguishes package components from CLI-installed blocks
- CLI examples: `npx @cloudflare/kumo init`, `npx @cloudflare/kumo blocks`, `npx @cloudflare/kumo add PageHeader`
- Kumo Tailwind instructions are Tailwind v4-oriented, while standalone styles are available for non-Tailwind or compatibility use cases

## Goals / Non-Goals

**Goals:**

- Adopt Kumo as the frontend UI component foundation without changing SkillForge business behavior.
- Add `@cloudflare/kumo` and required peer dependencies.
- Configure Kumo CSS in a way that works with the current Vite + Tailwind 3 project before considering Tailwind 4.
- Migrate low-risk local wrappers to Kumo-backed implementations:
  - Button → Kumo Button
  - Input → Kumo Input
  - Textarea → Kumo InputArea or compatible Kumo input primitive
  - Card/ResourcePanel → Kumo LayerCard or compatible surface
  - StatusBadge/MetaPill → Kumo Badge where appropriate
  - LoadingState → Kumo Loader
  - EmptyState → Kumo Empty
- Preserve existing wrapper exports where possible so page code changes stay minimal.
- Evaluate Kumo PageHeader and ResourceList blocks as owned source code, not automatic package updates.
- Treat Select migration as a separate high-risk subtask because Kumo Select uses `onValueChange`/`items`, while current code often uses native `onChange` and React Hook Form `register`.
- Preserve SkillForge's custom Prompt Rail composition as product-specific identity, while using Kumo primitives inside it where practical.

**Non-Goals:**

- No backend, database, auth, API, audit state machine, or Prompt rendering changes.
- No Tailwind 4 migration in this change.
- No complete rewrite of all page markup if wrapper-level migration suffices.
- No forced migration from `lucide-react` to `@phosphor-icons/react` icons in this change, except where Kumo APIs require Phosphor icons.
- No removal of React Hook Form, Zod, TanStack Query, React Router, or Axios client patterns.
- No mandatory adoption of Kumo Sidebar unless it preserves current route/auth/admin behavior with lower risk than keeping the existing shell.

## Decisions

### 1. Use wrapper-first migration

Keep SkillForge's local UI wrapper imports as the first migration boundary. Page code should continue to import `../components/ui/Button`, `Input`, `Select`, `Card`, and `Console` unless a Kumo block requires a local composition change.

Rationale:

- Current UI usage is broad; wrapper-first migration reduces churn and limits behavioral regression.
- Wrapper APIs already encode SkillForge-specific variants such as `danger`, `sm`, `md`, `label`, and `error`.
- Kumo APIs are similar but not identical; wrapper adapters can map local props to Kumo props.

Alternative considered: replace all page imports directly with `@cloudflare/kumo`. Rejected because it would couple every page to Kumo API details and make Select/form migration riskier.

### 2. Prefer granular Kumo imports

Use granular imports such as `@cloudflare/kumo/components/button` where supported.

Rationale:

- Kumo docs recommend granular imports for tree-shaking.
- It keeps wrapper dependencies explicit.

Alternative considered: barrel import from `@cloudflare/kumo`. Acceptable for a spike, but not preferred for final implementation if granular paths work reliably with Vite.

### 3. Use Kumo standalone styles first

For initial adoption, import Kumo standalone styles rather than migrating Tailwind configuration to Tailwind 4-style `@source`/`@import "tailwindcss"`.

Rationale:

- Current project uses Tailwind 3 syntax (`@tailwind base/components/utilities`).
- Kumo's Tailwind docs include Tailwind v4-oriented directives such as `@source`.
- Standalone CSS reduces migration coupling and lets implementation verify Kumo component rendering first.

Alternative considered: upgrade to Tailwind 4 and use Kumo's Tailwind-native integration. Rejected for this change because it adds a separate framework migration and expands regression surface.

### 4. Migrate low-risk primitives before complex controls

Button, Input, InputArea/Textarea, LayerCard/Card, Badge-like components, Loader, and Empty should be migrated before Select, Sidebar, Table, or blocks.

Rationale:

- Low-risk primitives have straightforward prop mappings and less business logic.
- This creates early visible value and validates Kumo CSS/build integration.
- Complex controls often affect forms, routing, or accessibility behavior.

Alternative considered: migrate all components in one pass. Rejected because failures would be hard to isolate.

### 5. Treat Select as an adapter project

Kumo Select should be adopted only after a dedicated adapter proves compatibility with both controlled use cases and React Hook Form fields.

Current native-style usage includes:

- `value` + `onChange(event)` filters in Marketplace/Admin/SkillDetail
- `register('categoryId')`, `register('modelType')`, and nested `register('variables.X.type')` in SkillForm

Kumo Select uses `items` and `onValueChange(value)`, so implementation must either:

- keep the current native Select wrapper temporarily, or
- implement an adapter that can produce native-like `onChange` semantics and/or work with React Hook Form `Controller`

Rationale:

- Skill creation/edit forms are business-critical and validation-sensitive.
- A broken Select adapter could prevent authors from creating or editing Skills.

Alternative considered: immediately replace `Select` with Kumo Select. Rejected until adapter behavior is tested.

### 6. Evaluate blocks as owned code

Kumo blocks such as `PageHeader` and `ResourceList` should be installed only after reviewing generated code. If adopted, they live under a local directory such as `frontend/src/components/kumo/` and become owned/customizable source.

Rationale:

- Kumo docs define blocks as copy-paste starting points that the application owns.
- SkillForge already has product-specific layouts and Prompt Rail, so blocks should be adapted rather than treated as immutable dependencies.

Alternative considered: avoid blocks entirely. Possible, but PageHeader/ResourceList are likely aligned with the current console redesign and worth evaluating.

### 7. Keep existing AppLayout shell initially

Do not replace AppLayout sidebar with Kumo Sidebar in the first migration pass. Evaluate Kumo Sidebar after primitive and resource components are stable.

Rationale:

- AppLayout encodes public/authenticated/admin navigation visibility.
- Existing shell was recently verified and is responsive.
- Sidebar migration is visual/structural and can be isolated later.

Alternative considered: replace AppLayout immediately with Kumo Sidebar. Rejected due to route/auth regression risk.

## Risks / Trade-offs

- Kumo CSS conflicts with Tailwind/global styles → Mitigation: start with standalone styles in a branch/change, verify build and representative pages, then remove/adjust overlapping local token CSS gradually.
- Bundle size increase → Mitigation: prefer granular imports and compare production build output before/after migration.
- Select breaks React Hook Form fields → Mitigation: keep native Select initially or migrate via `Controller` with dedicated form tests.
- Wrapper APIs mismatch Kumo props → Mitigation: map variants and sizes in local wrappers; avoid leaking Kumo-specific API into pages until stable.
- Blocks overwrite or conflict with local component names → Mitigation: install blocks into a dedicated `components/kumo` directory and review diffs before integrating.
- Visual identity becomes generic Cloudflare clone → Mitigation: retain SkillForge Prompt Rail and product-specific copy/layout; use Kumo for primitive quality, not all composition choices.
- Dependency update affects Docker build → Mitigation: verify `npm --prefix frontend run build` and rebuild frontend Docker image after implementation.
- Kumo docs/CLI may change → Mitigation: pin package version through lockfile and record exact setup in tasks.

## Migration Plan

1. Install dependencies: `@cloudflare/kumo` and `@phosphor-icons/react`.
2. Add Kumo style import using the compatibility path chosen during implementation.
3. Run a small build smoke to verify Vite resolves Kumo package and styles.
4. Migrate low-risk wrappers one at a time, running build after each cluster.
5. Evaluate Kumo CLI blocks in a temporary or reviewed path; adopt only if they reduce local code without harming product-specific layout.
6. Decide Select strategy: keep native wrapper for this change or implement a Kumo adapter using controlled values/React Hook Form Controller.
7. Optionally evaluate Sidebar after primitives and resource patterns are stable.
8. Verify key flows: marketplace filtering, login/register, create/edit Skill, Skill detail, Prompt generation UI, admin status filter and actions, favorites, usage logs, responsive layout, focus states.

Rollback strategy: revert frontend dependency/style/wrapper changes. Since no backend or data changes are planned, rollback does not require database migration.

## Open Questions

- Should this change use Kumo standalone styles only, or attempt Kumo Tailwind integration with Tailwind 3 content scanning if feasible?
- Should `Select` remain native in the first implementation pass, or should the change include a full Kumo Select + React Hook Form adapter?
- Should Kumo CLI blocks be committed as generated source, or should the project keep custom `Console.tsx` primitives and only use Kumo package components?
- Should icon migration from `lucide-react` to `@phosphor-icons/react` be included later as a visual cleanup change?
