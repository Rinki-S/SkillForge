-- ============================================
-- SkillForge DDL - PostgreSQL
-- ============================================

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    nickname VARCHAR(100),
    avatar VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted INT NOT NULL DEFAULT 0
);

-- 2. Skill categories
CREATE TABLE IF NOT EXISTS skill_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted INT NOT NULL DEFAULT 0
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    intro VARCHAR(500) NOT NULL,
    prompt_template TEXT NOT NULL,
    output_format TEXT,
    usage_examples TEXT,
    model_type VARCHAR(100),
    category_id BIGINT REFERENCES skill_categories(id),
    author_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PUBLISHED', 'OFFLINE', 'REJECTED')),
    usage_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted INT NOT NULL DEFAULT 0
);

-- 4. Skill variables (for Prompt {{var}} engine)
CREATE TABLE IF NOT EXISTS skill_variables (
    id BIGSERIAL PRIMARY KEY,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    label VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'textarea', 'number', 'select')),
    required BOOLEAN NOT NULL DEFAULT FALSE,
    default_value VARCHAR(500),
    options_json TEXT, -- JSON array for select type, e.g. ["中文","英文"]
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (skill_id, name)
);

-- 5. Favorites
CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    skill_id BIGINT NOT NULL REFERENCES skills(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, skill_id)
);

-- 6. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    skill_id BIGINT NOT NULL REFERENCES skills(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, skill_id)
);

-- 7. Skill usage logs
CREATE TABLE IF NOT EXISTS skill_usage_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    skill_id BIGINT NOT NULL REFERENCES skills(id),
    rendered_prompt TEXT NOT NULL,
    variable_values_json TEXT, -- JSON object of submitted values
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT NOT NULL REFERENCES users(id),
    target_type VARCHAR(50) NOT NULL, -- 'skill', 'category', 'user'
    target_id BIGINT,
    action VARCHAR(50) NOT NULL, -- 'approve', 'reject', 'offline', 'delete', 'create_category', etc.
    detail TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_skills_status ON skills(status);
CREATE INDEX IF NOT EXISTS idx_skills_author ON skills(author_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_skill ON reviews(skill_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON skill_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_skill ON skill_usage_logs(skill_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_id);
