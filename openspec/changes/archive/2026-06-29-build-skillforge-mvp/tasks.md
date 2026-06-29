# Tasks — build-skillforge-mvp

任务组对齐规划文档的阶段 2–9（阶段 1「需求与系统设计」即本 proposal/design/specs）。每个任务可独立验收；依赖靠分组顺序保证。开工前必须先完成第 1 组（落定 Open Decisions），否则第 2 组的工程初始化无定向。

## 1. 开工前置：技术栈定稿与配置（已落定）

> Open Decisions 已由用户 2026-06-28 确认：Base UI(`@base-ui/react`) / Java 17 / Maven / MyBatis-Plus / PostgreSQL / 团队开发。本组为落地与固化，非再决策。

- [x] 1.1 已确认 `baseui` = Base UI（`@base-ui/react`，无头/unstyled，样式全归 Tailwind，无 preflight 冲突）
- [x] 1.2 已确认 Java 17 + Maven + MyBatis-Plus
- [x] 1.3 已确认团队开发 + 单一 PostgreSQL（不接 H2）
- [x] 1.4 已在 `openspec/config.yaml` 的 `context` 填入最终技术栈约定
- [x] 1.5 约定 Base UI × Tailwind 协作规范：建一组「基础样式封装」（按钮/输入框/卡片），避免散乱写 Tailwind class
- [x] 1.6 已确定 PostgreSQL 本地提供方式：**docker compose**（单服务，含持久化卷）
- [x] 1.7 已确定仓库结构：**单仓双目录**（`backend/` + `frontend/`，根目录放 docker-compose 与 README）

## 2. 项目初始化与基础架构（规划阶段 2）

- [x] 2.1 初始化后端 Spring Boot 工程：pom + starter 依赖、目录结构（Java 17），位于 `backend/`
- [x] 2.2 配置 PostgreSQL 数据库连接 + MyBatis-Plus（读 docker-compose 提供的连接参数）
- [x] 2.3 根目录 `docker-compose.yml`：postgres 服务 + 持久化卷 + 健康检查（实现 1.6）
- [x] 2.3 实现统一 `Result<T>` 响应格式（code/message/data）
- [x] 2.4 实现全局异常：`@RestControllerAdvice` + `BusinessException` + 错误码常量（4010/4030/4040/4091…）
- [x] 2.5 配置 CORS 跨域
- [x] 2.6 初始化前端 React + Vite + Tailwind CSS + baseui 工程
- [x] 2.7 前端集成 React Router、TanStack Query、React Hook Form + Zod、Axios
- [x] 2.8 前端 Axios 拦截器：注入 JWT、统一解包 `Result<T>`、非 2xx 错误提示
- [x] 2.9 前端 TanStack Query 加载/错误/空三态基线组件
- [x] 2.10 健康检查端点 + 前后端联调基线（`/api` 代理转发通）

## 3. 用户认证与权限（规划阶段 3，spec: user-auth）

- [x] 3.1 `users` 表 DDL + 实体 + Repository（含 role 字段 USER/ADMIN）
- [x] 3.2 注册接口：BCrypt 密码加密、唯一用户名校验、role=USER
- [x] 3.3 登录接口：校验凭证、签发 JWT（userId/role/exp）、登录失败统一提示
- [x] 3.4 `JwtAuthenticationFilter`：解析 token、填充 SecurityContext
- [x] 3.5 接口权限校验：`@PreAuthorize("hasRole('ADMIN')")` 或自定义注解守管理员端点
- [x] 3.6 种子管理员账号初始化（启动建表时写入）
- [x] 3.7 前端注册/登录页 + RHF+Zod 表单校验
- [x] 3.8 前端 auth Context + 路由守卫：未登录跳登录、USER 访问 `/admin/*` 拦截

## 4. AI Skill 核心功能（规划阶段 4，spec: skill-management）

- [x] 4.1 `skills` / `skill_categories` 表 DDL + 实体 + Repository（status 枚举、usage_count、model_type）
- [x] 4.2 Skill 创建接口：必填校验、作者=当前用户、status=PENDING
- [x] 4.3 Skill 编辑/删除接口：作者归属校验（4030 越权拦截）、已发布编辑回 PENDING
- [x] 4.4 Skill 详情接口：返回完整模板/变量/输出格式/示例，不存在返回 4040
- [x] 4.5 广场列表接口：强制 status=PUBLISHED、卡片字段、分页
- [x] 4.6 关键词/分类/模型类型筛选搜索接口
- [x] 4.7 「我的 Skill」列表接口：返回当前用户全部态
- [x] 4.8 分类列表接口（供筛选与创建下拉）
- [x] 4.9 前端广场页（卡片列表）+ 详情页
- [x] 4.10 前端创建/编辑 Skill 页 +「我的 Skill」页

## 5. Prompt 变量生成（规划阶段 5，spec: prompt-generation）

- [x] 5.1 `skill_variables` 表 DDL + 实体 + Repository（name/label/type/required/default/options）
- [x] 5.2 模板 `{{var}}` 解析工具：正则匹配 `{{\s*\w+\s*}}`
- [x] 5.3 存盘时变量匹配校验：占位 ⇄ 变量一一对应（悬挂占位 / 未用变量均拒）
- [x] 5.4 Prompt 生成接口：后端权威校验（required/type/select options 白名单）+ 模板渲染
- [x] 5.5 成功生成落 `skill_usage_logs`（含渲染后 Prompt + 变量值 JSON）+ `usage_count` +1
- [x] 5.6 前端变量配置 UI（创建/编辑 Skill 时）
- [x] 5.7 前端 Prompt 生成页：按 type 动态渲染表单 + live preview
- [x] 5.8 前端一键复制生成结果 Prompt

## 6. 收藏、评价与用户中心（规划阶段 6，spec: user-engagement）

- [x] 6.1 `favorites` 表 DDL（UNIQUE(user_id,skill_id)）+ 实体 + Repository
- [x] 6.2 收藏/取消收藏接口：去重（捕获唯一约束）+ 取消幂等
- [x] 6.3 「我的收藏」列表接口 + 前端页（含空态）—— 接口已实现，前端待实现
- [x] 6.4 `reviews` 表 DDL（UNIQUE(user_id,skill_id)）+ 实体 + Repository
- [x] 6.5 评价接口：一人一条（重复拒）+ 评分聚合 AVG(rating) 实时计算
- [x] 6.6 使用记录列表接口 + 前端页（含空态）—— 接口已实现，前端待实现
- [x] 6.7 个人中心页：profile + 我的 Skill/收藏/使用记录入口—— 接口已实现，前端待实现

## 7. 管理员后台（规划阶段 7，spec: admin-moderation）

- [x] 7.1 `audit_logs` 表 DDL + 实体 + Repository
- [x] 7.2 管理员首页统计接口（用户数/Skill 数/待审核数/已发布数）
- [x] 7.3 审核列表接口（PENDING + 全态）
- [x] 7.4 审核 action 接口：通过/拒绝/下架/删除，驱动状态机 + 写 audit_logs
- [x] 7.5 分类 CRUD 接口—— 后端接口已实现，前端页待实现
- [x] 7.6 用户管理接口—— 后端接口已实现，前端页待实现
- [x] 7.7 审核日志查看接口—— 后端接口已实现，前端页待实现
- [x] 7.8 前端管理员首页 + 审核页（动作按钮 + 确认）

## 8. 异常处理与界面优化（规划阶段 8）

- [x] 8.1 表单校验完善：RHF+Zod schema 与后端语义对齐
- [x] 8.2 空/错/加载三态统一：TanStack Query 复用基线组件
- [x] 8.3 统一拦截提示：未登录 / 越权 / 重复收藏 / 数据不存在 / 变量缺失
- [x] 8.4 统一 UI 风格：按钮/表单/卡片样式一致（baseui + Tailwind，按 1.5 共存策略）
- [x] 8.5 页面布局优化 + 修复主要交互问题

## 9. 测试、部署与文档（规划阶段 9）

- [x] 9.1 测试注册登录流程（含失败用例）
- [x] 9.2 测试 Skill 发布与审核流程（状态机全链路）
- [x] 9.3 测试 Prompt 生成流程（含双端校验用例）
- [x] 9.4 测试收藏/评价/使用记录功能
- [x] 9.5 修复测试中发现 Bug
- [x] 9.6 编写 README：启动方式、profile/数据库切换、演示账号、目录说明
- [x] 9.7 整理项目截图 + 准备演示视频脚本
