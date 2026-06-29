## Why

SkillForge 是一个面向学生、开发者与 AI 工具使用者的「AI Skills 分享与管理系统」。当前项目为全新启动——仅有规划文档与 OpenSpec 骨架，尚无任何代码。AI Skill 指一种可复用的 AI 能力模板（含 Prompt 模板、输入变量、输出格式、使用示例），其核心价值在于让使用者把 AI 使用经验沉淀为结构化、可被他人浏览复用的资产。本次 change 建立 MVP 的全栈骨架，把规划文档（9 阶段 / 10 天）落地为可运行的系统，并把探索阶段沉淀的关键架构决策固化为 spec 契约。

## What Changes

- 建立后端工程：Java + Spring Boot，分层架构（Controller / Service / Repository / Security），统一 `Result<T>` 响应包装 + `@RestControllerAdvice` 全局异常处理。
- 建立前端工程：React + Vite + Tailwind CSS + baseui，配套 React Router（路由守卫）、TanStack Query（服务端状态/加载·错误·空态）、React Hook Form + Zod（表单校验）、Axios 拦截器（注入 JWT、统一错误提示）。
- 实现用户认证与权限：注册 / 登录 / 退出、BCrypt 密码加密、JWT 无状态鉴权、USER/ADMIN 双角色，前端路由拦截 + 后端接口权限校验。
- 实现 Skill 核心能力：CRUD（仅作者可编辑/删除自己的）、广场列表（卡片式）、详情页、按关键词/分类/模型类型筛选与搜索、Skill 状态可见性控制。
- 实现 Prompt 变量生成引擎：变量配置、`{{var}}` 模板解析与校验（前端实时预览 + 后端权威校验双端）、按变量类型动态渲染表单、生成可复制的最终 Prompt、记录使用日志并递增使用次数。
- 实现用户互动：收藏/取消收藏（去重）、评分评价（一人一 Skill 一条）、使用记录查看、个人中心。
- 实现管理员后台：数据概览、Skill 审核（通过/拒绝/下架/删除）、分类管理、用户管理、审核日志、基础统计。
- 引入 Skill 审核状态机：`PENDING → PUBLISHED / REJECTED`，`PUBLISHED → OFFLINE`，离线/拒绝重交回 `PENDING`，广场仅展示 `PUBLISHED`。
- 全程异常与拦截：表单校验、登录失败提示、Prompt 模板变量匹配校验、未登录访问拦截、越权编辑拦截、重复收藏提示、数据不存在提示。
- 数据持久化：8 张核心表（users / skills / skill_categories / skill_variables / favorites / skill_usage_logs / reviews / audit_logs）。

> 绿地项目，无既有代码，**无 Breaking Change**。

## Capabilities

### New Capabilities
- `user-auth`: 用户注册、登录、退出、BCrypt 密码存储、JWT 鉴权、USER/ADMIN 角色区分、前端路由权限拦截与后端接口权限校验、登录态保持。
- `skill-management`: AI Skill 的创建/编辑/删除（仅作者）、广场列表与详情、按关键词/分类/模型类型筛选搜索、Skill 状态可见性与作者归属校验。
- `prompt-generation`: Skill 变量配置、`{{var}}` Prompt 模板解析与变量匹配校验（前端预览 + 后端权威校验）、按变量类型动态渲染表单、生成最终可复制 Prompt、记录使用日志并递增使用次数。
- `user-engagement`: Skill 收藏/取消收藏（去重）、评分评价（一人一条 + 评分统计）、使用记录查看、个人中心。
- `admin-moderation`: 管理员登录、平台数据概览、Skill 审核（通过/拒绝/下架/删除）、分类管理、用户管理、审核日志记录、基础统计。

### Modified Capabilities
<!-- 无既有 spec，全部为新建。 -->

## Impact

- **新增代码**：`backend/`（Spring Boot）、`frontend/`（React + Vite）两个顶层工程，当前均不存在。
- **API**：RESTful 接口，统一 `Result<T>` 返回；覆盖 5 个能力的全部端点（鉴权、Skill CRUD、Prompt 生成、收藏/评价/使用记录、管理员审核）。建议附 springdoc-openapi 自动生成接口文档。
- **依赖**：后端 Spring Boot 3.x（Java 17）、Spring Security、JWT、MyBatis-Plus、PostgreSQL 驱动；前端 Base UI(`@base-ui/react`)、Tailwind、React Router、TanStack Query、React Hook Form、Zod、Axios。
- **数据库**：PostgreSQL（单一数据库）；8 张核心表 + 种子管理员账号。
- **OpenSpec**：在 `openspec/config.yaml` 的 `context` 填入技术栈约定（当前为空），并把上述 5 个能力写入 `specs/`。

## Open Decisions

> 探索阶段识别的分叉，**已全部敲定**（用户 2026-06-28 确认）。结果已同步写入 `openspec/config.yaml` 的 `context`。

| # | 决策点 | 选定结果 | 影响面 |
|---|---|---|---|
| D1 | `baseui` 指向哪个库 | **Base UI**（`@base-ui/react`，base-ui.com 的无头/unstyled 库） | 前端组件层：Base UI 只给行为+无障碍，**样式全归 Tailwind**，无 CSS-in-JS、无 preflight 冲突；子路径导入如 `@base-ui/react/popover` |
| D2 | Java 版本 | **Java 17** | Spring Boot 3.x 兼容；不用虚拟线程/records 高级特性 |
| D3 | 构建工具 | **Maven** | `spring-boot-starter-parent` 一把梭 |
| D4 | 持久层 | **MyBatis-Plus** | 8 表 CRUD 自带通用 CRUD+分页+逻辑删除 |
| D5 | 数据库 | **PostgreSQL**（单一数据库，**不**用 H2 兜底） | DDL 用 PostgreSQL 方言；演示与生产同一库 |
| D6 | 开发规模 | **团队开发** | 任务可并行拆分；保留完整 5 能力，无需降级 |
