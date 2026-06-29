# SkillForge

SkillForge 是一个 AI Skills 分享与管理系统 MVP。用户可以创建结构化 Prompt 模板、配置变量、在广场浏览复用 Skill，并生成最终 Prompt；管理员负责审核、分类和平台治理。

## 技术栈

- 后端：Java 17、Spring Boot 3.x、Spring Security、JWT、MyBatis-Plus、PostgreSQL
- 前端：React、Vite、TypeScript、Tailwind CSS、Base UI（`@base-ui/react` 无头组件）、React Router、TanStack Query、React Hook Form、Zod、Axios
- 数据库：PostgreSQL（通过根目录 `docker-compose.yml` 提供）

## 目录结构

```text
backend/        Spring Boot 后端
frontend/       React + Vite 前端
openspec/       OpenSpec 变更、设计与任务
```

## 推荐启动方式：Docker Compose 全栈启动

确保 Docker 已运行后，在项目根目录执行：

```bash
docker compose up --build
```

这会一次性启动：

- `postgres`：PostgreSQL 16
- `backend`：Spring Boot API 服务
- `frontend`：Vite React 开发服务器

访问地址：

- 前端：`http://localhost:5173`
- 后端健康检查：`http://localhost:8080/api/health`
- Swagger UI：`http://localhost:8080/swagger-ui.html`
- PostgreSQL：`localhost:5432`

默认数据库连接参数：

- database: `skillforge`
- username: `skillforge`
- password: `skillforge_dev`

> 注意：在 Docker Compose 网络内部，后端连接数据库使用 `postgres:5432`，不是 `localhost:5432`。`localhost:5432` 只用于宿主机直接连接数据库。

常用 Docker 命令：

```bash
# 后台启动
docker compose up --build -d

# 查看日志
docker compose logs -f backend frontend postgres

# 停止服务（保留数据库卷）
docker compose down

# 停止并删除数据库卷（会清空本地数据库数据，请谨慎）
docker compose down -v
```

## 可选：本机手动启动

如果不希望后端/前端运行在容器中，也可以只用 Docker 启动 PostgreSQL，然后本机运行后端和前端。

### 1. 启动 PostgreSQL

```bash
docker compose up -d postgres
```

### 2. 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端默认运行在 `http://localhost:8080`，启动时会执行 `schema.sql` / `data.sql`，创建表和种子数据。

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`，Vite 的 `/api` 默认代理到 `http://localhost:8080`。在 Compose 中会通过环境变量改为 `http://backend:8080`。

## 演示账号

种子管理员账号：

- 用户名：`admin`
- 密码：`admin123`

普通用户可在前端注册页自行创建。

## 常用检查命令

```bash
# 后端编译/测试
mvn -f backend/pom.xml test

# 前端构建
npm run build --prefix frontend
```

## 功能概览

- 用户注册、登录、退出和前端路由守卫
- Skill 广场、详情、关键词/分类/模型筛选
- Skill 创建、编辑、删除和「我的 Skill」
- Prompt 变量配置、动态表单、实时预览、后端生成、复制结果
- 收藏、评价、使用记录、个人中心
- 管理员仪表盘、Skill 审核、分类管理、用户列表、审核日志

## 已知限制

- MVP 不调用真实 LLM，只负责模板渲染与复制。
- JWT 退出仅清理前端 token，服务端不维护黑名单。
- 管理员分类删除会将关联 Skill 的分类置空。
