-- ============================================
-- SkillForge seed data
-- ============================================

-- Seed admin account: admin / admin123
INSERT INTO users (username, password, role, nickname)
SELECT 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', '管理员'
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
