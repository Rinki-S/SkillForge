## Why

SkillForge 的当前前端更接近通用 AI SaaS 营销页：大 hero、蓝色品牌色、大圆角卡片和 soft shadow 让产品显得模板化，削弱了“管理、审核、复用 Prompt Skill”的工具可信度。现在需要把体验转向更克制、密集、可操作的控制台界面，参考 Cloudflare dashboard 的资源管理气质，让 MVP 在演示中呈现为可用于团队工作流的产品而不是视觉 demo。

## What Changes

- 将全局视觉语言从蓝色 SaaS 风格改为 Cloudflare-inspired 控制台风格：浅灰画布、白色面板、细边框、低阴影、橙色主操作和状态强调。
- 将应用外壳从顶部横向导航改为 dashboard shell：左侧资源导航、顶部搜索/账号区、主内容区域。
- 将 Marketplace 从营销式 hero + 卡片网格改为 Skill registry：紧凑页面标题、筛选 toolbar、资源列表/表格式 Skill 展示，并保留响应式移动端布局。
- 将 Skill 详情页强化为可操作资源页：展示 Skill 元数据、Prompt 模板、变量和生成结果，并引入“Prompt Rail”变量轨道作为 SkillForge 自己的生成器视觉特征。
- 将 Admin 页面从卡片堆叠改为审核控制台：统计概览、审核队列、分类/用户/日志管理采用更密集的列表和表格结构。
- 统一 Button、Card、Input、Select、empty/loading/error states 的视觉密度、focus 状态和复制/操作 affordance。
- 不改变后端 API、鉴权流程、数据库结构或核心业务状态机。

## Capabilities

### New Capabilities
- `frontend-console-experience`: Covers the dashboard shell, Cloudflare-inspired visual system, resource-list marketplace, prompt generation rail, and admin console presentation behavior.

### Modified Capabilities
- `skill-management`: Skill browsing/detail/creation/editing views keep the same functional requirements but gain new presentation requirements for registry-style browsing and resource-detail layout.
- `prompt-generation`: Prompt generation keeps the same API behavior but gains new presentation requirements for variable input flow, live preview, and generated result layout.
- `admin-moderation`: Admin moderation keeps the same actions and state machine but gains new presentation requirements for review queue and management console layout.
- `user-engagement`: Favorites/reviews/usage views keep the same data behavior but gain new presentation requirements for console-style metadata and action affordances.

## Impact

- Frontend code under `frontend/src/components`, `frontend/src/components/ui`, `frontend/src/pages`, `frontend/src/index.css`, and `frontend/tailwind.config.js`.
- No intended API contract changes for `backend/`.
- No new runtime service dependencies are required. Optional font choices should use system fallbacks unless the implementation explicitly adds web font loading.
- Existing React Router, TanStack Query, Axios client, auth context, and Tailwind setup remain in place.
- Visual regression risk is high because this affects the global layout and most major pages; implementation should verify responsive behavior, auth/admin route visibility, loading/error/empty states, and keyboard focus states.
