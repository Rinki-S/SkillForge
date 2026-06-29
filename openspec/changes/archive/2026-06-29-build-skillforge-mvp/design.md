## Context

SkillForge 是全新启动的绿地项目：当前仓库仅含规划文档（`SkillForge 项目规划.md`，9 阶段 / 10 天）与 OpenSpec 骨架，无任何业务代码。本设计文档把探索阶段沉淀的架构决策固化为工程蓝图，作为后续 `tasks.md` 实现步骤与 spec 验收的依据。

硬约束（用户锁定）：后端 Java，前端 React + Vite + Tailwind CSS + baseui。

利益相关方：学生/开发者（终端用户，发布与复用 Skill）、管理员（审核与平台治理）、课程评审（关注可运行交付与演示）。项目以「可演示的 MVP」为第一目标，兼顾架构整洁与异常完备性。

## Goals / Non-Goals

**Goals:**
- 建立前后端可独立运行、跨域打通的全栈骨架，第 2 天即具备「统一响应 + 全局异常 + 健康检查」基线。
- 认证/权限、Skill CRUD、Prompt 引擎、用户互动、管理员审核 5 个能力解耦，可按阶段独立交付与验收。
- 异常与状态治理（状态机、去重、越权、空/错/加载态）在设计中前置，避免第 8 天集中返工。
- 数据库统一 PostgreSQL：开发/演示/生产同库，无演示兜底，避免双 profile 行为漂移。

**Non-Goals:**
- 不做真实 LLM 调用——Prompt 引擎只做模板渲染与复制，不调用外部模型 API（避免依赖与密钥管理）。
- 不做实时协同、消息推送、WebSocket。
- 不做复杂权限矩阵（仅 USER/ADMIN 两角色，无角色组/细粒度资源 ACL）。
- 不做生产级可观测性（仅基础日志，无分布式追踪/指标采集）。
- 不做 CI/CD 流水线自动化（手动构建即可，第 9 天交付 README + 演示）。

## Decisions

### D1 后端分层与统一响应

后端采用经典四层：`Controller → Service → Repository → Security`。所有接口返回 `Result<T>`：

```
{ "code": 200, "message": "ok", "data": <T> }
```

- 成功：`code=200`，业务数据放 `data`。
- 业务异常：`code=4xx`（如 4001 未登录、4003 越权、4040 数据不存在、4091 重复收藏），`message` 为面向用户的中文提示。
- `@RestControllerAdvice` 统一捕获 `BusinessException`（携带 code+message）与未捕获异常（兜底 5000），保证响应结构一致，前端只需一套解析逻辑。

**为什么**：规划第 8 阶段要求统一错误提示与异常处理，统一响应 + 全局异常是成本最低、收益最早的基础设施，第 2 天落地后贯穿全程。
**备选**：直接抛 `ResponseStatusException`+Spring 默认错误体——被否，结构不统一、前端需多套分支。

### D2 认证：BCrypt + JWT 无状态

- 密码用 BCrypt（strength=10）加盐哈希存储，明文绝不落库、绝不返回。
- 登录成功签发 JWT（HS256），payload 含 `userId`、`role`（USER/ADMIN）、`exp`；前端存 localStorage，Axios 拦截器自动注入 `Authorization: Bearer`。
- 后端 `JwtAuthenticationFilter` 解析 token、填充 `SecurityContext`；`@PreAuthorize("hasRole('ADMIN')")` 或自定义注解守管理员接口。
- 前端 React Router `loader`/守卫组件：未登录跳登录页；普通用户访问 `/admin/*` 跳转并提示无权限。

**为什么**：无状态 JWT 利于演示部署（无需 Session 存储）、契合前后端分离；BCrypt 是 Spring Security 内置、零额外依赖。
**备选**：Session+Cookie——被否，跨域与 CORS 配置更繁琐，演示需会话亲和。
**风险**：JWT 无法主动失效（无服务端黑名单）——MVP 接受短 exp（如 2h）+ 退出仅清前端 token；非 MVP 目标。

### D3 持久层与数据库

- 数据库：**PostgreSQL**（单一数据库，不再用 H2 兜底——用户确认）。
- 持久层：**MyBatis-Plus**（8 张表多为 CRUD，MP 自带通用 CRUD + 分页插件 + 逻辑删除，中文资料最厚）。
- 表结构用 `schema.sql`/`data.sql`（PostgreSQL 方言）管理，启动时建表并写入**种子管理员账号**。

**为什么**：MP 对纯 CRUD 项目边际收益最高；PostgreSQL 单一库让开发/演示/生产一致，免去双 profile 行为漂移。
**备选**：Spring Data JPA——更 Spring 原生，但复杂查询仍要写 Specification/JPQL，对 8 表 CRUD 反而啰嗦。

### D4 Skill 审核状态机

```
              用户创建 Skill
                    │
                    ▼
              ┌─────────┐  管理员通过   ┌───────────┐
              │ PENDING │ ───────────▶ │ PUBLISHED │ ◀── 广场仅取此态
              └─────────┘              └───────────┘
               │       │                  │      │
        拒绝  │   删除 ✕          下架   │      │ 编辑后重交
              ▼                          ▼      │
        ┌─────────┐                ┌─────────┐   │
        │REJECTED │                │ OFFLINE │───┘
        └─────────┘                └─────────┘
```

- `skills.status` 枚举：`PENDING / PUBLISHED / OFFLINE / REJECTED`。
- 广场列表查询**强制** `status=PUBLISHED`；作者「我的 Skill」可见自己全部态；管理员可见全部。
- 作者编辑已 `PUBLISHED` 的 Skill 后状态回 `PENDING` 重审（防内容漂移）。
- 状态迁移收敛于 Service 层单一方法，Controller 仅转发意图。

**为什么**：状态机一处定义，避免第 4 天（用户端）与第 7 天（管理员端）对「何态可见/可改」理解冲突。

### D5 Prompt 变量生成引擎（系统心脏）

- 模板语法：Mustache 风格 `{{varName}}`。
- 变量 schema：`name`（模板内占位名）、`label`（展示名）、`type`（text/textarea/number/select）、`required`（bool）、`default`、`options`（select 的可选项）。
- **双端解析校验**：
  - 作者存盘前：模板中所有 `{{x}}` ⇄ `skill_variables` 表的 `name` 必须**一一对应**（无悬挂变量、无未用变量），否则校验失败。
  - 使用者生成时：前端按 `type` 动态渲染表单并 live preview；提交后**后端再做一次权威校验**（required 填写、类型合法、select 值在 options 内），通过后渲染最终 Prompt、落 `skill_usage_logs`、`skills.usage_count+1`。
- 渲染逻辑用正则匹配 `{{\s*\w+\s*}}` 替换；不引入完整模板引擎（避免注入与依赖膨胀）。

**为什么**：规划明确「Prompt 模板变量匹配校验」「变量缺失」为硬要求；双端校验既保体验又保安全（前端不可信）。这块是项目最能体现「设计」的差异点。
**备选**：完整 Mustache/Thymeleaf 模板引擎——被否，需求仅占位替换，引擎引入转义/分支语义反成负担与注入面。

### D6 前端架构与状态管理

- React Router 做页面与路由守卫；TanStack Query 管服务端状态（天然覆盖加载/错误/空态 + 缓存失效）。
- React Hook Form + Zod 管表单与校验（注册、Skill 创建、动态变量表单）；Zod schema 与后端校验语义对齐。
- Axios 拦截器：请求注入 JWT、响应统一解包 `Result<T>`、非 2xx 弹错误提示。
- 登录态用 React Context（轻量），不引入 Redux/Zustand。

**为什么**：把第 8 阶段「加载/错误/空态/表单校验」的硬要求在第 2 天基础设施里就分摊掉，避免后期返工。
**baseui × Tailwind（已确认）**：`baseui` = Base UI（`@base-ui/react`，base-ui.com 无头/unstyled 库），只提供行为+无障碍，**样式全归 Tailwind**，无 CSS-in-JS 引擎、无 preflight 冲突。子路径导入如 `@base-ui/react/popover`。组件写法为 `<Input className="...">`，所有视觉由 Tailwind class 提供。

### D7 去重与评分统计的数据库兜底

- `favorites`：`UNIQUE(user_id, skill_id)` —— DB 层直接兜住「重复收藏」，Service 层先查后插 + 捕获唯一约束异常双保险。
- `reviews`：`UNIQUE(user_id, skill_id)` —— 一人一 Skill 一条评分；评分统计用 `AVG(rating)` 实时聚合，不维护冗余字段（防漂移）。
- `skill_usage_logs`：除 user/skill 外，**存渲染后的最终 Prompt 与变量值(JSON)**，使「使用记录页」有内容可看。

## Risks / Trade-offs

- **[10 天时间预算偏乐观，第 3/8 天为时间黑洞]** → 第 2 天把统一响应、全局异常、Axios 拦截器、TanStack Query 三态一次到位，提前分摊打磨工作；团队开发可并行拆分（前端 / 后端 / 管理员后台分头推进）。
- **[Base UI 与 Tailwind 协作纪律]** → Base UI 无样式，组件视觉完全依赖 Tailwind class；需约定一套基础样式 class（按钮/输入框/卡片）避免散乱写法，第 2 天建一组「基础样式封装」。
- **[单一 PostgreSQL，无演示兜底]** → 演示需可连 PG 实例；交付 README 写清本地 PG 启动方式（docker compose 或本地安装），避免评审环境跑不起来。
- **[JWT 无主动失效]** → MVP 接受短 exp + 退出仅清前端；记录为已知限制，非目标。
- **[Prompt 模板注入]** → 仅做占位替换不执行逻辑，不引入模板引擎，渲染结果仅用于展示/复制，降低注入面；后端校验 select 值白名单。

## Migration Plan

绿地项目，无既有数据迁移。部署与回滚：
1. 后端：`mvn clean package` 产 jar；`java -jar` 启动（连接 PostgreSQL）；启动时自动建表 + 种子管理员。
2. 前端：`npm run build` 产静态资源；开发期 `npm run dev` + Vite 代理转发 `/api` 到后端，规避 CORS。
3. 回滚：MVP 无灰度需求；出问题直接停服回滚 jar / 静态资源版本即可。

## Open Questions

> OQ1/OQ2 已由用户 2026-06-28 确认。

- **OQ1（已决）**：PostgreSQL 本地环境用 **docker compose** 提供（单 postgres 服务 + 持久化卷 + 健康检查），写进根目录 `docker-compose.yml` 与 README。
- **OQ2（已决）**：**单仓双目录**——根目录 `backend/`（Spring Boot）+ `frontend/`（React/Vite），docker-compose 与 README 放根目录，便于演示与团队协同。
