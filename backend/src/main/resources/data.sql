-- ============================================
-- SkillForge seed data
-- ============================================

-- Seed admin account: admin / admin123
INSERT INTO users (username, password, role, nickname)
SELECT 'admin', '$2a$10$bbX8kl/9sEUHlag4D3L6Fu4Ci7kzhPYs8clxGJEBo/JORLfi3.bSu', 'ADMIN', '管理员'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Seed categories
INSERT INTO skill_categories (name, description, sort_order) VALUES
    ('写作助手', '文案、文章、报告等写作类 Prompt', 1),
    ('编程开发', '代码生成、调试、优化等编程类 Prompt', 2),
    ('数据分析', '数据清洗、分析、可视化类 Prompt', 3),
    ('学习教育', '学习辅助、知识问答、教学类 Prompt', 4),
    ('创意设计', '创意发散、设计灵感类 Prompt', 5),
    ('商务办公', '邮件、报告、会议等办公场景 Prompt', 6)
ON CONFLICT (name) DO NOTHING;

-- Seed demo users: password is admin123
INSERT INTO users (username, password, role, nickname)
SELECT 'demo', '$2a$10$bbX8kl/9sEUHlag4D3L6Fu4Ci7kzhPYs8clxGJEBo/JORLfi3.bSu', 'USER', '演示用户'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'demo');

INSERT INTO users (username, password, role, nickname)
SELECT 'alice', '$2a$10$bbX8kl/9sEUHlag4D3L6Fu4Ci7kzhPYs8clxGJEBo/JORLfi3.bSu', 'USER', 'Alice Chen'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'alice');

INSERT INTO users (username, password, role, nickname)
SELECT 'bob', '$2a$10$bbX8kl/9sEUHlag4D3L6Fu4Ci7kzhPYs8clxGJEBo/JORLfi3.bSu', 'USER', 'Bob Li'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'bob');

-- Repair previously seeded demo accounts that used an invalid sample hash.
UPDATE users
SET password = '$2a$10$bbX8kl/9sEUHlag4D3L6Fu4Ci7kzhPYs8clxGJEBo/JORLfi3.bSu'
WHERE username IN ('admin', 'demo', 'alice', 'bob')
  AND password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

-- Published marketplace skills
INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    '产品发布公告生成器',
    '根据产品特性、目标用户和发布渠道生成结构清晰的中文发布公告。',
    '请为 {{product_name}} 写一篇产品发布公告。目标用户是 {{audience}}，核心卖点包括：{{selling_points}}。语气要求：{{tone}}。发布渠道：{{channel}}。',
    '输出包含：标题、摘要、正文、行动号召、3 个社媒短句。',
    '适合新品上线、版本升级、功能发布前的市场沟通。',
    'GPT',
    (SELECT id FROM skill_categories WHERE name = '写作助手'),
    (SELECT id FROM users WHERE username = 'alice'),
    'PUBLISHED',
    128
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = '产品发布公告生成器');

INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    '代码审查清单助手',
    '把待审代码和上下文转化为结构化审查意见，强调风险、边界条件和测试建议。',
    '你是一名资深代码审查员。请审查以下 {{language}} 代码，业务背景是：{{context}}。重点关注 {{focus_area}}。代码如下：{{code}}',
    '按严重程度输出：问题、影响、建议修改、需要补充的测试。',
    '用于 Pull Request 初审、上线前风险检查和新人代码辅导。',
    'Claude',
    (SELECT id FROM skill_categories WHERE name = '编程开发'),
    (SELECT id FROM users WHERE username = 'bob'),
    'PUBLISHED',
    96
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = '代码审查清单助手');

INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    'SQL 分析需求拆解器',
    '把业务分析问题拆成指标定义、数据口径、SQL 草稿和验证步骤。',
    '请基于业务问题「{{question}}」设计数据分析方案。数据库类型：{{database}}。已知表结构：{{schema}}。期望粒度：{{granularity}}。',
    '输出：指标定义、假设、SQL 示例、校验方法、可能的数据质量风险。',
    '适合运营分析、看板指标设计、临时取数前的需求澄清。',
    'GPT',
    (SELECT id FROM skill_categories WHERE name = '数据分析'),
    (SELECT id FROM users WHERE username = 'alice'),
    'PUBLISHED',
    74
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = 'SQL 分析需求拆解器');

INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    '知识点讲解教练',
    '面向不同基础的学习者，生成循序渐进的讲解、例子和练习题。',
    '请用 {{level}} 能理解的方式讲解「{{topic}}」。请结合 {{scenario}} 举例，并给出 {{exercise_count}} 道练习题。',
    '输出：核心概念、类比示例、常见误区、练习题、答案解析。',
    '适合课程备课、自学复盘、企业内部培训材料初稿。',
    'Gemini',
    (SELECT id FROM skill_categories WHERE name = '学习教育'),
    (SELECT id FROM users WHERE username = 'demo'),
    'PUBLISHED',
    63
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = '知识点讲解教练');

INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    '品牌命名发散器',
    '根据品牌定位和受众生成多方向命名方案，并解释命名理由。',
    '请为一个 {{industry}} 品牌生成命名方案。品牌定位：{{positioning}}。目标受众：{{audience}}。命名风格：{{style}}。',
    '输出 12 个候选名，按风格分组，并说明含义、优点和潜在风险。',
    '适合早期品牌探索、活动主题命名、产品线命名。',
    'Claude',
    (SELECT id FROM skill_categories WHERE name = '创意设计'),
    (SELECT id FROM users WHERE username = 'bob'),
    'PUBLISHED',
    52
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = '品牌命名发散器');

INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    '会议纪要行动项提取器',
    '从会议记录中提取决策、待办、负责人和截止时间。',
    '请整理以下会议记录：{{meeting_notes}}。会议主题：{{topic}}。请特别关注行动项和风险。',
    '输出：会议摘要、关键决策、行动项表格、风险与待确认问题。',
    '适合周会、项目复盘、客户沟通后的纪要整理。',
    '通用',
    (SELECT id FROM skill_categories WHERE name = '商务办公'),
    (SELECT id FROM users WHERE username = 'demo'),
    'PUBLISHED',
    141
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = '会议纪要行动项提取器');

-- Non-published skills for author and admin workflows
INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    '客服回复润色器',
    '把客服草稿改写为专业、克制且有同理心的回复。',
    '请将以下客服回复草稿润色为 {{tone}} 风格。客户问题：{{customer_issue}}。原始回复：{{draft}}',
    '输出润色后回复，并列出修改理由。',
    '适合售后、用户反馈、投诉处理等沟通场景。',
    'GPT',
    (SELECT id FROM skill_categories WHERE name = '商务办公'),
    (SELECT id FROM users WHERE username = 'alice'),
    'PENDING',
    0
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = '客服回复润色器');

INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    '旧版广告语批量生成',
    '已下架的广告语批量生成模板，用于演示离线状态。',
    '请围绕 {{product}} 生成 {{count}} 条广告语。',
    '每条不超过 20 字。',
    '历史模板。',
    '通用',
    (SELECT id FROM skill_categories WHERE name = '写作助手'),
    (SELECT id FROM users WHERE username = 'bob'),
    'OFFLINE',
    18
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = '旧版广告语批量生成');

INSERT INTO skills (title, intro, prompt_template, output_format, usage_examples, model_type, category_id, author_id, status, usage_count)
SELECT
    '过度承诺营销文案',
    '被拒绝的营销文案模板，用于演示审核拒绝状态。',
    '请为 {{product}} 写夸张营销文案。',
    '输出短文案。',
    '不推荐使用。',
    'GPT',
    (SELECT id FROM skill_categories WHERE name = '写作助手'),
    (SELECT id FROM users WHERE username = 'demo'),
    'REJECTED',
    0
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE title = '过度承诺营销文案');

-- Variables for generated skills
INSERT INTO skill_variables (skill_id, name, label, type, required, default_value, options_json, sort_order) VALUES
    ((SELECT id FROM skills WHERE title = '产品发布公告生成器'), 'product_name', '产品名称', 'text', TRUE, 'SkillForge Console', NULL, 1),
    ((SELECT id FROM skills WHERE title = '产品发布公告生成器'), 'audience', '目标用户', 'text', TRUE, 'AI 应用团队', NULL, 2),
    ((SELECT id FROM skills WHERE title = '产品发布公告生成器'), 'selling_points', '核心卖点', 'textarea', TRUE, '统一管理提示词、审核发布、记录使用历史', NULL, 3),
    ((SELECT id FROM skills WHERE title = '产品发布公告生成器'), 'tone', '语气', 'select', TRUE, '专业可信', '["专业可信","轻松活泼","克制简洁"]', 4),
    ((SELECT id FROM skills WHERE title = '产品发布公告生成器'), 'channel', '发布渠道', 'select', TRUE, '官网博客', '["官网博客","微信公众号","产品更新邮件"]', 5),

    ((SELECT id FROM skills WHERE title = '代码审查清单助手'), 'language', '编程语言', 'select', TRUE, 'TypeScript', '["TypeScript","Java","Python","Go"]', 1),
    ((SELECT id FROM skills WHERE title = '代码审查清单助手'), 'context', '业务背景', 'textarea', TRUE, '用户点击收藏技能后，应同步刷新页面状态。', NULL, 2),
    ((SELECT id FROM skills WHERE title = '代码审查清单助手'), 'focus_area', '关注重点', 'text', TRUE, '状态一致性、错误处理、测试覆盖', NULL, 3),
    ((SELECT id FROM skills WHERE title = '代码审查清单助手'), 'code', '代码片段', 'textarea', TRUE, '', NULL, 4),

    ((SELECT id FROM skills WHERE title = 'SQL 分析需求拆解器'), 'question', '业务问题', 'textarea', TRUE, '过去 30 天哪些技能被使用最多？', NULL, 1),
    ((SELECT id FROM skills WHERE title = 'SQL 分析需求拆解器'), 'database', '数据库类型', 'select', TRUE, 'PostgreSQL', '["PostgreSQL","MySQL","SQLite"]', 2),
    ((SELECT id FROM skills WHERE title = 'SQL 分析需求拆解器'), 'schema', '表结构', 'textarea', TRUE, 'skills, skill_usage_logs, users', NULL, 3),
    ((SELECT id FROM skills WHERE title = 'SQL 分析需求拆解器'), 'granularity', '分析粒度', 'text', TRUE, '按技能和日期', NULL, 4),

    ((SELECT id FROM skills WHERE title = '知识点讲解教练'), 'level', '学习者水平', 'select', TRUE, '初学者', '["初学者","有基础","进阶"]', 1),
    ((SELECT id FROM skills WHERE title = '知识点讲解教练'), 'topic', '知识点', 'text', TRUE, '向量数据库', NULL, 2),
    ((SELECT id FROM skills WHERE title = '知识点讲解教练'), 'scenario', '应用场景', 'text', TRUE, '语义搜索', NULL, 3),
    ((SELECT id FROM skills WHERE title = '知识点讲解教练'), 'exercise_count', '练习题数量', 'number', TRUE, '3', NULL, 4),

    ((SELECT id FROM skills WHERE title = '品牌命名发散器'), 'industry', '行业', 'text', TRUE, 'AI 工具', NULL, 1),
    ((SELECT id FROM skills WHERE title = '品牌命名发散器'), 'positioning', '品牌定位', 'textarea', TRUE, '可靠、清晰、适合团队协作', NULL, 2),
    ((SELECT id FROM skills WHERE title = '品牌命名发散器'), 'audience', '目标受众', 'text', TRUE, '中小型研发团队', NULL, 3),
    ((SELECT id FROM skills WHERE title = '品牌命名发散器'), 'style', '命名风格', 'select', TRUE, '现代简洁', '["现代简洁","中文意象","科技感","温暖亲和"]', 4),

    ((SELECT id FROM skills WHERE title = '会议纪要行动项提取器'), 'meeting_notes', '会议记录', 'textarea', TRUE, '', NULL, 1),
    ((SELECT id FROM skills WHERE title = '会议纪要行动项提取器'), 'topic', '会议主题', 'text', TRUE, '产品迭代评审', NULL, 2),

    ((SELECT id FROM skills WHERE title = '客服回复润色器'), 'tone', '语气', 'select', TRUE, '诚恳专业', '["诚恳专业","简洁直接","温和安抚"]', 1),
    ((SELECT id FROM skills WHERE title = '客服回复润色器'), 'customer_issue', '客户问题', 'textarea', TRUE, '', NULL, 2),
    ((SELECT id FROM skills WHERE title = '客服回复润色器'), 'draft', '原始回复', 'textarea', TRUE, '', NULL, 3)
ON CONFLICT (skill_id, name) DO NOTHING;

-- Favorites and reviews
INSERT INTO favorites (user_id, skill_id, created_at) VALUES
    ((SELECT id FROM users WHERE username = 'demo'), (SELECT id FROM skills WHERE title = '产品发布公告生成器'), NOW() - INTERVAL '5 days'),
    ((SELECT id FROM users WHERE username = 'demo'), (SELECT id FROM skills WHERE title = '代码审查清单助手'), NOW() - INTERVAL '3 days'),
    ((SELECT id FROM users WHERE username = 'demo'), (SELECT id FROM skills WHERE title = '会议纪要行动项提取器'), NOW() - INTERVAL '1 day'),
    ((SELECT id FROM users WHERE username = 'alice'), (SELECT id FROM skills WHERE title = 'SQL 分析需求拆解器'), NOW() - INTERVAL '4 days'),
    ((SELECT id FROM users WHERE username = 'alice'), (SELECT id FROM skills WHERE title = '品牌命名发散器'), NOW() - INTERVAL '2 days'),
    ((SELECT id FROM users WHERE username = 'bob'), (SELECT id FROM skills WHERE title = '知识点讲解教练'), NOW() - INTERVAL '6 days'),
    ((SELECT id FROM users WHERE username = 'bob'), (SELECT id FROM skills WHERE title = '产品发布公告生成器'), NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, skill_id) DO NOTHING;

INSERT INTO reviews (user_id, skill_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE username = 'demo'), (SELECT id FROM skills WHERE title = '产品发布公告生成器'), 5, '结构清楚，适合直接改成发布稿。', NOW() - INTERVAL '4 days'),
    ((SELECT id FROM users WHERE username = 'bob'), (SELECT id FROM skills WHERE title = '产品发布公告生成器'), 4, '社媒短句很有用，希望增加英文版本。', NOW() - INTERVAL '2 days'),
    ((SELECT id FROM users WHERE username = 'alice'), (SELECT id FROM skills WHERE title = '代码审查清单助手'), 5, '审查维度完整，对风险排序很有帮助。', NOW() - INTERVAL '3 days'),
    ((SELECT id FROM users WHERE username = 'demo'), (SELECT id FROM skills WHERE title = 'SQL 分析需求拆解器'), 4, '适合需求澄清，SQL 还需要按实际表结构微调。', NOW() - INTERVAL '2 days'),
    ((SELECT id FROM users WHERE username = 'alice'), (SELECT id FROM skills WHERE title = '会议纪要行动项提取器'), 5, '行动项表格很实用。', NOW() - INTERVAL '1 day'),
    ((SELECT id FROM users WHERE username = 'bob'), (SELECT id FROM skills WHERE title = '品牌命名发散器'), 4, '候选方向丰富，适合头脑风暴。', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Usage logs are guarded manually because the table has no natural unique key.
INSERT INTO skill_usage_logs (user_id, skill_id, rendered_prompt, variable_values_json, created_at)
SELECT
    (SELECT id FROM users WHERE username = 'demo'),
    (SELECT id FROM skills WHERE title = '产品发布公告生成器'),
    '请为 SkillForge Console 写一篇产品发布公告。目标用户是 AI 应用团队，核心卖点包括：统一管理提示词、审核发布、记录使用历史。语气要求：专业可信。发布渠道：官网博客。',
    '{"product_name":"SkillForge Console","audience":"AI 应用团队","tone":"专业可信","channel":"官网博客"}',
    NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (
    SELECT 1 FROM skill_usage_logs
    WHERE user_id = (SELECT id FROM users WHERE username = 'demo')
      AND skill_id = (SELECT id FROM skills WHERE title = '产品发布公告生成器')
      AND rendered_prompt LIKE '请为 SkillForge Console 写一篇产品发布公告%'
);

INSERT INTO skill_usage_logs (user_id, skill_id, rendered_prompt, variable_values_json, created_at)
SELECT
    (SELECT id FROM users WHERE username = 'alice'),
    (SELECT id FROM skills WHERE title = 'SQL 分析需求拆解器'),
    '请基于业务问题「过去 30 天哪些技能被使用最多？」设计数据分析方案。数据库类型：PostgreSQL。已知表结构：skills, skill_usage_logs, users。期望粒度：按技能和日期。',
    '{"question":"过去 30 天哪些技能被使用最多？","database":"PostgreSQL","granularity":"按技能和日期"}',
    NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (
    SELECT 1 FROM skill_usage_logs
    WHERE user_id = (SELECT id FROM users WHERE username = 'alice')
      AND skill_id = (SELECT id FROM skills WHERE title = 'SQL 分析需求拆解器')
      AND rendered_prompt LIKE '请基于业务问题「过去 30 天哪些技能被使用最多？」%'
);

INSERT INTO skill_usage_logs (user_id, skill_id, rendered_prompt, variable_values_json, created_at)
SELECT
    (SELECT id FROM users WHERE username = 'bob'),
    (SELECT id FROM skills WHERE title = '代码审查清单助手'),
    '你是一名资深代码审查员。请审查以下 TypeScript 代码，业务背景是：收藏按钮状态不同步。重点关注 状态一致性、错误处理、测试覆盖。',
    '{"language":"TypeScript","context":"收藏按钮状态不同步","focus_area":"状态一致性、错误处理、测试覆盖"}',
    NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (
    SELECT 1 FROM skill_usage_logs
    WHERE user_id = (SELECT id FROM users WHERE username = 'bob')
      AND skill_id = (SELECT id FROM skills WHERE title = '代码审查清单助手')
      AND rendered_prompt LIKE '你是一名资深代码审查员。请审查以下 TypeScript 代码%'
);

-- Audit logs
INSERT INTO audit_logs (admin_id, target_type, target_id, action, detail, created_at)
SELECT
    (SELECT id FROM users WHERE username = 'admin'),
    'skill',
    (SELECT id FROM skills WHERE title = '产品发布公告生成器'),
    'approve',
    '内容完整，符合发布规范。',
    NOW() - INTERVAL '8 days'
WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs
    WHERE target_id = (SELECT id FROM skills WHERE title = '产品发布公告生成器')
      AND target_type = 'skill'
      AND action = 'approve'
);

INSERT INTO audit_logs (admin_id, target_type, target_id, action, detail, created_at)
SELECT
    (SELECT id FROM users WHERE username = 'admin'),
    'category',
    (SELECT id FROM skill_categories WHERE name = '商务办公'),
    'create_category',
    '初始化商务办公分类。',
    NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs
    WHERE target_id = (SELECT id FROM skill_categories WHERE name = '商务办公')
      AND target_type = 'category'
      AND action = 'create_category'
);

INSERT INTO audit_logs (admin_id, target_type, target_id, action, detail, created_at)
SELECT
    (SELECT id FROM users WHERE username = 'admin'),
    'skill',
    (SELECT id FROM skills WHERE title = '旧版广告语批量生成'),
    'offline',
    '模板质量低，已由新版写作模板替代。',
    NOW() - INTERVAL '6 days'
WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs
    WHERE target_id = (SELECT id FROM skills WHERE title = '旧版广告语批量生成')
      AND target_type = 'skill'
      AND action = 'offline'
);

INSERT INTO audit_logs (admin_id, target_type, target_id, action, detail, created_at)
SELECT
    (SELECT id FROM users WHERE username = 'admin'),
    'skill',
    (SELECT id FROM skills WHERE title = '过度承诺营销文案'),
    'reject',
    '存在夸大宣传风险，拒绝发布。',
    NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs
    WHERE target_id = (SELECT id FROM skills WHERE title = '过度承诺营销文案')
      AND target_type = 'skill'
      AND action = 'reject'
);
