## Why

SkillForge 已经完成 Cloudflare-inspired 控制台重设计，但当前 UI primitives 仍由项目内手写实现，后续维护、可访问性和与 Cloudflare dashboard 视觉的一致性都需要持续手工保证。Cloudflare Kumo 正是面向产品界面的 React component library，引入它可以把底层按钮、表单、卡片、状态、空态、表格和资源模式迁移到更贴近目标风格的组件系统，同时保留 SkillForge 自己的 Prompt Rail 产品特征。

## What Changes

- 引入 `@cloudflare/kumo` 作为前端组件库，并添加必要 peer dependency `@phosphor-icons/react`。
- 配置 Kumo 样式，优先采用与当前 Tailwind 3/Vite 项目兼容的方式；不把 Tailwind 4 迁移纳入本 change。
- 通过现有 wrapper 层迁移低风险 primitives：`Button`, `Input`, `Textarea/InputArea`, `Card/LayerCard`, `StatusBadge/MetaPill/Badge`, `LoadingState/Loader`, `EmptyState/Empty`。
- 评估并有选择地引入 Kumo CLI blocks，例如 `PageHeader`、`ResourceList`，但仅在生成代码适合当前业务布局时使用。
- 谨慎处理 `Select`：先验证 Kumo Select 的 `onValueChange`/`items` API 与 React Hook Form `register` 的适配，再迁移受控筛选器和表单选择器。
- 暂不强制替换 `AppLayout` 的 sidebar；仅在 Kumo Sidebar 能保留当前 public/user/admin 可见性和响应式行为时迁移。
- 保留现有业务行为、路由、API、React Query query/mutation、React Hook Form + Zod 校验，以及自定义 Prompt Rail。
- 不改变后端、数据库、鉴权、审核状态机或 Prompt 生成规则。

## Capabilities

### New Capabilities
- `kumo-ui-adoption`: Covers dependency setup, Kumo style integration, wrapper migration strategy, Kumo block evaluation, Select/form adapter rules, and verification expectations for adopting Kumo UI.

### Modified Capabilities
- `frontend-console-experience`: The console presentation remains required, but its underlying primitives and selected layout patterns SHALL be backed by Kumo components/blocks where practical instead of project-only hand-written UI primitives.
- `prompt-generation`: Prompt generation behavior remains unchanged, but Prompt Rail SHALL preserve its custom product-specific composition while using Kumo-compatible primitives for controls, surfaces, status, and empty/loading feedback where practical.
- `skill-management`: Skill marketplace/detail/author pages SHALL preserve registry/resource-list behavior while migrating low-level primitives to Kumo-backed wrappers.
- `admin-moderation`: Admin console SHALL preserve review queue and management behavior while migrating low-level primitives to Kumo-backed wrappers.
- `user-engagement`: Favorites, usage history, and profile entry points SHALL preserve current behavior while migrating low-level primitives to Kumo-backed wrappers.

## Impact

- Frontend dependencies in `frontend/package.json` and lockfile.
- Frontend style entrypoint `frontend/src/index.css` and possibly Tailwind config if Kumo integration requires content/style adjustments.
- UI wrapper files under `frontend/src/components/ui` and state components under `frontend/src/components/states`.
- Page/component imports and markup where wrapper-only migration is insufficient, especially `SkillForm`, `MarketplacePage`, `AdminPage`, `SkillDetailPage`, and `AppLayout` if Sidebar is adopted.
- No backend API, database, auth, Docker service topology, or business logic changes are intended.
- Build and visual verification must account for Kumo CSS integration and bundle impact.
