## Context

SkillForge 当前 React/Vite/Tailwind 前端已经覆盖 MVP 主要功能，但界面语言偏通用 AI SaaS：顶部横向导航、黑色营销 hero、蓝色品牌色、大圆角卡片和 soft shadow。这个方向适合 landing page，却不适合 SkillForge 的核心任务：让团队查找、审核、复用、生成 Prompt Skill。

本设计将前端重新组织为 Cloudflare-inspired 控制台体验。参考点是 Cloudflare dashboard 的资源管理气质：左侧产品导航、顶部账号/搜索区、浅灰画布、白色资源面板、细边框、紧凑列表、少量橙色强调、复制/行级操作等。设计不追求像素级复制 Cloudflare，而是把 SkillForge 表达成“Prompt operations console”。

当前相关实现位置：

- `frontend/src/components/AppLayout.tsx`: 全局导航与页面 shell。
- `frontend/src/index.css`: Tailwind base/components 层，含 `.page-shell`, `.sf-card`, `.sf-input` 等全局样式。
- `frontend/tailwind.config.js`: 当前 blue `brand` token 与 `shadow-soft`。
- `frontend/src/components/ui/*`: Button/Card/Input/Select 等基础 UI。
- `frontend/src/pages/*`: Marketplace、Skill detail/create/edit、Admin、Favorites、Usage logs、Profile、Login/Register。

## Goals / Non-Goals

**Goals:**

- 建立一套控制台视觉 token：浅灰画布、白色面板、细边框、紧凑 spacing、低阴影、橙色主强调。
- 将 `AppLayout` 改为 dashboard shell：左侧导航 + 顶部 utility bar + 主内容区。
- 将 Marketplace 改为 Skill registry：页面标题 + 统计/上下文 + filter toolbar + 资源列表/表格优先，移动端退化为 compact cards。
- 将 Skill Detail 改为资源详情页，并使用 “Prompt Rail” 展示变量输入、实时预览、生成结果的流程关系。
- 将 Admin 改为审核控制台：审核队列、分类管理、用户管理、日志以列表/表格方式组织。
- 保持所有页面 responsive、键盘 focus 可见、loading/error/empty states 可理解。
- 保留现有 API、路由守卫、TanStack Query 数据流和 AuthContext。

**Non-Goals:**

- 不改后端 API、数据库 schema、鉴权、角色权限或 Skill 审核状态机。
- 不新增复杂 UI 框架或 CSS-in-JS；继续使用 Tailwind 和现有组件结构。
- 不做 Cloudflare 品牌复制；只借鉴控制台结构和视觉密度。
- 不在本 change 中引入暗色模式、主题切换、国际化或新的业务功能。
- 不重写整个前端架构；优先通过现有 pages/components 的重构完成。

## Decisions

### 1. Dashboard shell replaces top navigation

Use a persistent sidebar for primary navigation and a slim top utility bar for search/account/session actions.

Rationale:

- SkillForge 的核心体验是管理资源，不是浏览营销内容。sidebar 更适合多模块控制台：Marketplace、My Skills、Favorites、Usage Logs、Admin。
- 当前横向导航在功能增加后会拥挤，且不利于表达 admin/user 不同能力区。
- Cloudflare-style dashboard 的可信度主要来自“资源控制台”结构，而不仅是颜色。

Alternative considered: keep top navigation and only restyle colors. Rejected because it would mostly是换皮，无法解决当前 hero/card layout 的 AI 模板感。

### 2. Token-first visual redesign

Define console-oriented tokens in Tailwind and global CSS:

- Canvas: `#F7F7F4`
- Panel: `#FFFFFF`
- Ink: `#1D1D1B`
- Muted: `#6B6B63`
- Line: `#D9D9D3`
- Orange: `#F48120`
- Orange soft: `#FFF1DF`
- Code surface: `#101010`

Rationale:

- 统一 token 能避免在各页面散落 `slate-*` / `brand-*` 后继续产生混合风格。
- Orange 作为操作与状态强调，保留 Cloudflare 关联，但大面积界面仍以中性色为主。
- 降低 radius 和 shadow，改用 border/section header 形成控制台感。

Alternative considered: directly把现有 `brand` 从 blue 改成 orange。Rejected because existing `rounded-2xl` + `shadow-soft` + hero pattern 仍会保留 AI SaaS 感。

### 3. Resource rows over marketing cards

Marketplace, My Skills, Favorites, Admin review queue, Usage Logs should prefer dense resource rows/tables on desktop. Cards may remain for mobile or secondary summaries.

Rationale:

- Skill 的关键信息是 title、model、category、author、usage、rating/status/actions；这些更适合横向扫描。
- 控制台用户通常带着任务进入：搜索、筛选、打开、审核、复制/生成，而不是被大卡片吸引。
- 表格/资源行能自然容纳 Cloudflare-like row actions 和 metadata。

Alternative considered: keep grid cards with smaller radius. Rejected for Marketplace/Admin because grid cards降低批量浏览和审核效率。

### 4. Prompt Rail as SkillForge-specific signature

Skill detail page should present generation as a vertical rail/pipeline:

```text
Template
  │
  ├─ variable: audience
  ├─ variable: tone
  ├─ variable: output_format
  ▼
Generated prompt
```

Rationale:

- 这是本 redesign 的唯一明显视觉风险，避免只是“Cloudflare clone”。
- Prompt Skill 的真实结构就是 template + variables + rendered output；rail 把这个关系显性化。
- 轨道能帮助用户理解变量填写顺序、实时预览和最终生成之间的关系。

Alternative considered: keep standard form card. Rejected because普通表单无法形成 SkillForge 的独特记忆点。

### 5. Components remain simple and Tailwind-based

Refactor existing `Button`, `Card`, `Input`, `Select` styles and add small layout primitives only if needed, such as `PageHeader`, `ResourceTable`, `MetricTile`, `StatusBadge`, `PromptRail`.

Rationale:

- MVP 项目不应为视觉重构引入重型 design system。
- 现有 component surface area 小，集中改造成本低。
- Tailwind 保持与项目约束一致。

Alternative considered: introduce a component library for dashboard/table/sidebar. Rejected because会增加依赖和迁移成本，不符合 MVP-first。

### 6. Preserve route/data behavior while changing presentation

All existing query keys, API client calls, route guards, auth checks and mutation behavior should remain semantically unchanged unless a page needs minor local data mapping for table rows.

Rationale:

- 这是视觉和信息架构 change，不应同时改变业务行为。
- 降低回归风险，便于用现有手动流程验证。

Alternative considered: redesign routes and split marketplace/admin into new subroutes. Deferred; current scope should stay demo-friendly。

## Risks / Trade-offs

- Global layout regression → Mitigation: implement shell first, verify authenticated/unauthenticated/admin nav visibility and all routes render inside the new outlet.
- Dense UI may feel cramped on small screens → Mitigation: use responsive breakpoints where desktop tables become stacked resource cards on mobile.
- Cloudflare inspiration may become brand imitation → Mitigation: avoid Cloudflare names/logos and reserve the unique Prompt Rail for SkillForge identity.
- Replacing cards with tables may reduce visual warmth → Mitigation: keep concise page headers, helpful empty states, and subtle orange status accents.
- Tailwind token migration may miss old `brand-*` references → Mitigation: search for `brand-`, `slate-`, `shadow-soft`, and large-radius utilities during implementation.
- Prompt Rail can become visually noisy for many variables → Mitigation: make the rail scrollable/sticky only inside the generator panel and keep each variable row compact.
- Admin actions in dense rows may become harder to discover → Mitigation: keep primary action visible (`Approve`), group destructive/secondary actions clearly, and preserve confirmation for destructive operations.

## Migration Plan

1. Update Tailwind/global CSS tokens and base component styles while keeping old routes working.
2. Refactor `AppLayout` into dashboard shell and verify all pages render in the new layout.
3. Redesign Marketplace and shared resource row/list patterns.
4. Redesign Skill Detail with Prompt Rail and resource metadata presentation.
5. Redesign Admin, My Skills, Favorites, Usage Logs, Profile/Auth pages for visual consistency.
6. Run frontend build/typecheck and manually verify key flows: browse, login/register, create/edit skill, generate prompt, favorite/review, admin audit.

Rollback strategy: revert the frontend-only change set. Since no backend API or database changes are planned, rollback does not require data migration.

## Open Questions

- Should the implementation add a dedicated dashboard overview route, or keep Marketplace as the default `/` landing page for MVP?
- Should font loading remain system-only for reliability, or add an optional monospace/display web font for stronger identity?
- Should Marketplace use a true table element on desktop or semantic resource-list cards styled as rows? Table improves scanning; resource-list cards may adapt better to mixed content and mobile.
