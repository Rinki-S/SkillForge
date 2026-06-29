## 1. Visual Foundation

- [x] 1.1 Update `frontend/tailwind.config.js` with console tokens for canvas, panel, ink, muted text, border line, orange accent, soft orange, and code surface.
- [x] 1.2 Update `frontend/src/index.css` base styles and shared component classes to use the console visual system, reduced shadows, tighter radii, compact spacing, and visible orange focus states.
- [x] 1.3 Refactor `Button`, `Card`, `Input`, and `Select` styles to match the new control-console density while preserving existing props and variants.
- [x] 1.4 Add small shared UI primitives where useful, such as page headers, metric tiles, status badges, resource rows, or table/list wrappers.

## 2. Dashboard Shell

- [x] 2.1 Refactor `frontend/src/components/AppLayout.tsx` from top navigation into a dashboard shell with sidebar navigation, top utility bar, account actions, and main content outlet.
- [x] 2.2 Preserve unauthenticated, authenticated, and admin-only navigation visibility rules in the new shell.
- [x] 2.3 Make the shell responsive so mobile users can access navigation and account actions without full-page horizontal scrolling.
- [x] 2.4 Verify the shell renders all existing routes inside the main content area without changing route paths.

## 3. Marketplace and Resource Lists

- [x] 3.1 Redesign `MarketplacePage` to remove the marketing hero and replace it with a compact resource-oriented header and primary create-skill action.
- [x] 3.2 Convert marketplace filters into a console toolbar that preserves keyword, category, model type, and manual search/refetch behavior.
- [x] 3.3 Render marketplace Skills as registry-style resource rows or a table-like list on desktop with title, intro, category, author, model, usage, favorites, and rating.
- [x] 3.4 Provide a mobile-friendly stacked representation for marketplace Skills with the same metadata and detail navigation.
- [x] 3.5 Redesign `MySkillsPage`, `FavoritesPage`, and `UsageLogsPage` to use the same console resource-list language and clear empty states.

## 4. Skill Detail and Prompt Rail

- [x] 4.1 Redesign `SkillDetailPage` as a resource-detail page with compact operational metadata for category, model, author, usage, favorites, and rating.
- [x] 4.2 Restyle Prompt template, output format, and usage examples as console panels with clear headings and code-like surfaces where appropriate.
- [x] 4.3 Implement the Prompt Rail presentation for variable inputs, live preview, generation action, and generated result while preserving existing validation, mutation, copy, favorite, and review behavior.
- [x] 4.4 Ensure live preview and backend-generated result are visually distinct and clearly labeled.
- [x] 4.5 Keep the generation panel usable with many variables by using compact spacing and contained scrolling where needed.

## 5. Admin and Account Pages

- [x] 5.1 Redesign `AdminPage` overview stats as compact console metrics.
- [x] 5.2 Convert Skill audit cards into a review queue with title, intro, status, and moderation actions laid out for scanning.
- [x] 5.3 Restyle category management, user management, and audit logs as compact management lists while preserving create/delete/list behavior.
- [x] 5.4 Redesign `ProfilePage`, `LoginPage`, and `RegisterPage` so auth/account screens align with the console visual system without changing auth behavior.

## 6. Verification

- [x] 6.1 Run frontend typecheck/build and fix any TypeScript or bundling errors introduced by the redesign.
- [x] 6.2 Search for old visual tokens such as `brand-`, `shadow-soft`, large-radius hero/card patterns, and inconsistent `slate-*` usage; remove or intentionally retain them only where justified.
- [x] 6.3 Manually verify public browsing, login/register, create/edit Skill, Skill detail, Prompt generation/copy, favorite/review, my skills, favorites, usage logs, and admin moderation flows.
- [x] 6.4 Manually verify responsive layouts for desktop and narrow mobile widths, including sidebar/mobile navigation and resource lists.
- [x] 6.5 Manually verify keyboard focus visibility for navigation, buttons, form fields, links, and moderation actions.
