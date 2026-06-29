# SkillForge 演示视频脚本

## 演示前准备

1. 启动数据库：`docker compose up -d`
2. 启动后端：`mvn -f backend/pom.xml spring-boot:run`
3. 启动前端：`npm run dev --prefix frontend`
4. 打开 `http://localhost:5173`

## 推荐截图清单

- `01-marketplace.png`：Skill 广场首页，展示搜索筛选与卡片列表
- `02-login.png`：登录页，展示 RHF + Zod 表单校验
- `03-create-skill.png`：创建 Skill 页面，展示变量配置 UI
- `04-skill-detail.png`：Skill 详情页，展示模板、变量表单、实时预览
- `05-generated-prompt.png`：生成结果和一键复制按钮
- `06-my-skills.png`：我的 Skill 页面，展示状态标签
- `07-profile.png`：个人中心入口页
- `08-admin-dashboard.png`：管理员后台统计卡片
- `09-admin-audit.png`：管理员审核动作按钮
- `10-usage-logs.png`：使用记录页面空态或列表态

> 截图建议放到 `docs/screenshots/`，按上述文件名保存，便于 README 或答辩 PPT 引用。

## 3–5 分钟演示脚本

### 1. 项目定位（约 20 秒）

“SkillForge 是一个 AI Skills 分享与管理系统。Skill 指可复用的 Prompt 模板，包含变量、输出格式和示例。MVP 覆盖用户认证、Skill 创建审核、广场复用、Prompt 生成、收藏评价和管理员治理。”

### 2. 用户注册/登录（约 30 秒）

- 打开登录页。
- 展示空表单提交时的字段级校验。
- 使用普通账号登录；也可快速展示注册页。
- 说明前端会保存 JWT，Axios 自动注入 `Authorization`，路由守卫保护个人页面。

### 3. Skill 创建与变量配置（约 60 秒）

- 进入“创建 Skill”。
- 填写标题、简介、分类、模型类型。
- 在 Prompt 模板输入：`请把 {{text}} 翻译成 {{lang}}`。
- 添加变量：
  - `text` / 原文 / textarea / 必填
  - `lang` / 目标语言 / select / 必填 / 选项“中文、英文”
- 说明前端实时校验模板占位符和变量配置一一对应，后端保存时也会权威校验。
- 保存后进入“我的 Skill”，状态为“待审核”。

### 4. 管理员审核（约 45 秒）

- 退出或新窗口登录管理员账号：`admin / admin123`。
- 进入管理员后台。
- 展示统计卡片：用户数、Skill 数、待审核、已发布。
- 在审核列表点击“通过”，说明状态机从 `PENDING` 变为 `PUBLISHED`，并写入审核日志。

### 5. 广场复用与 Prompt 生成（约 60 秒）

- 回到广场，使用关键词/分类/模型筛选找到刚发布的 Skill。
- 打开详情页。
- 展示完整 Prompt 模板、变量说明、输出格式和示例。
- 输入变量，观察实时预览。
- 点击“生成 Prompt”，说明后端校验 required/type/select 白名单，渲染结果并写入使用记录、`usage_count + 1`。
- 点击“复制”，展示复制反馈。

### 6. 用户互动与个人中心（约 40 秒）

- 在详情页点击收藏和提交评分。
- 打开“我的收藏”，展示收藏空/列表态。
- 打开“使用记录”，展示生成过的 Prompt。
- 打开“个人中心”，说明入口聚合。

### 7. 收尾（约 20 秒）

“本项目采用前后端分离：Spring Boot 统一 Result 响应和异常处理，React 端用 TanStack Query 统一加载/错误/空态，RHF+Zod 对齐后端校验。MVP 不调用真实 LLM，只聚焦 Prompt 模板资产管理和复用流程。”
