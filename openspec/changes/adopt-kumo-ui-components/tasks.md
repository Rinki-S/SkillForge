## 1. Kumo Setup and Compatibility Spike

- [x] 1.1 Add `@cloudflare/kumo` and `@phosphor-icons/react` to frontend dependencies and update the lockfile.
- [x] 1.2 Import Kumo styles using a Tailwind 3-compatible approach, preferring Kumo standalone styles unless a safer Tailwind 3 integration is verified.
- [x] 1.3 Add a temporary or minimal smoke usage of Kumo Button/Input/LayerCard through local wrappers to verify Vite and TypeScript resolution.
- [x] 1.4 Run `npm --prefix frontend run build` and record/fix any Kumo dependency or style resolution issues before broader migration.

## 2. Low-Risk Wrapper Migration

- [x] 2.1 Migrate `frontend/src/components/ui/Button.tsx` to wrap Kumo Button while preserving existing `variant`, `size`, `className`, disabled, type, and click behavior.
- [x] 2.2 Migrate `frontend/src/components/ui/Input.tsx` to wrap Kumo Input and Kumo InputArea/Textarea-compatible behavior while preserving `label`, `error`, refs, native events, and React Hook Form compatibility.
- [x] 2.3 Migrate `frontend/src/components/ui/Card.tsx` and resource surfaces in `Console.tsx` to Kumo LayerCard or Kumo-compatible surfaces while preserving layout className extension.
- [x] 2.4 Migrate `StatusBadge` and `MetaPill` to Kumo Badge or Kumo-compatible Badge compositions with status-specific variants.
- [x] 2.5 Migrate `LoadingState` and `EmptyState` to Kumo Loader and Empty components or Kumo-compatible compositions.
- [x] 2.6 Run a frontend build after the wrapper migration and fix any type/API mismatches.

## 3. Kumo Blocks Evaluation

- [x] 3.1 Run or inspect Kumo CLI block documentation for PageHeader and ResourceList before installing any block code.
- [x] 3.2 If adopting blocks, initialize Kumo block config and install blocks into a dedicated reviewed local path such as `frontend/src/components/kumo/`.
- [x] 3.3 Compare generated PageHeader/ResourceList block APIs with current `PageHeader`, `ResourcePanel`, and `ResourceRow` usage.
- [x] 3.4 Integrate adopted blocks only where they preserve SkillForge page titles, metadata, actions, responsive resource rows, and Prompt Rail composition.
- [x] 3.5 If blocks do not fit cleanly, keep local console compositions and document that decision in code comments or the implementation summary.

## 4. Select and Form Adapter Strategy

- [x] 4.1 Audit every current `Select` usage and classify it as controlled filter, detail-page controlled field, or React Hook Form field.
- [x] 4.2 Decide whether the first implementation pass keeps native Select or introduces a Kumo Select adapter.
- [x] 4.3 If introducing a Kumo Select adapter, implement support for controlled `value`/`onChange` compatibility and React Hook Form usage, using `Controller` where necessary.
- [x] 4.4 Verify marketplace filters, admin status filter, Skill detail variable selects, and SkillForm category/model/variable-type selects still update state and validation correctly.
- [x] 4.5 If Kumo Select is deferred, keep the existing Select wrapper stable and record the deferral in the implementation summary.

## 5. Page Integration and Product Identity

- [x] 5.1 Review Marketplace, MySkills, Favorites, UsageLogs, Admin, Profile, Login, Register, SkillCreate, SkillEdit, and SkillDetail pages for direct styling that should be simplified after wrapper migration.
- [x] 5.2 Replace direct local console styling with Kumo-backed wrappers where it reduces duplication without changing page behavior.
- [x] 5.3 Preserve AppLayout navigation behavior; only adopt Kumo Sidebar if public/authenticated/admin visibility and responsive behavior remain intact.
- [x] 5.4 Preserve SkillDetail Prompt Rail as a SkillForge-specific custom composition while migrating its internal controls/surfaces where practical.
- [x] 5.5 Keep or intentionally defer icon migration from `lucide-react` to `@phosphor-icons/react` based on implementation risk.

## 6. Verification

- [x] 6.1 Run `npm --prefix frontend run build` successfully after all intended migrations.
- [x] 6.2 Compare production build output size before/after Kumo adoption and note any significant increase.
- [x] 6.3 Verify representative public pages render: marketplace, login, register, and public Skill detail.
- [x] 6.4 Verify authenticated flows as feasible: create/edit Skill form behavior, My Skills, Favorites, Usage Logs, profile entry points, and Prompt generation UI.
- [x] 6.5 Verify admin console behavior as feasible: overview metrics, status filter, review queue, category/user/log sections, and moderation actions.
- [x] 6.6 Verify responsive layouts and visible focus states for Kumo-backed buttons, inputs, links, resource rows, and form controls.
- [x] 6.7 Search for obsolete local visual primitives/styles and remove or intentionally retain them where Kumo does not cover the product-specific composition.
