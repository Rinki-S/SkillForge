package com.skillforge.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.common.BusinessException;
import com.skillforge.common.ErrorCode;
import com.skillforge.dto.SkillCreateRequest;
import com.skillforge.entity.*;
import com.skillforge.mapper.*;
import com.skillforge.service.SkillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillMapper skillMapper;
    private final SkillVariableMapper skillVariableMapper;
    private final SkillCategoryMapper skillCategoryMapper;
    private final UserMapper userMapper;
    private final ReviewMapper reviewMapper;
    private final FavoriteMapper favoriteMapper;

    public SkillServiceImpl(SkillMapper skillMapper, SkillVariableMapper skillVariableMapper,
                            SkillCategoryMapper skillCategoryMapper, UserMapper userMapper,
                            ReviewMapper reviewMapper, FavoriteMapper favoriteMapper) {
        this.skillMapper = skillMapper;
        this.skillVariableMapper = skillVariableMapper;
        this.skillCategoryMapper = skillCategoryMapper;
        this.userMapper = userMapper;
        this.reviewMapper = reviewMapper;
        this.favoriteMapper = favoriteMapper;
    }

    @Override
    @Transactional
    public Skill createSkill(SkillCreateRequest request, Long authorId) {
        // Validate template variables match
        validateTemplateVariables(request.getPromptTemplate(), request.getVariables());

        Skill skill = new Skill();
        skill.setTitle(request.getTitle());
        skill.setIntro(request.getIntro());
        skill.setPromptTemplate(request.getPromptTemplate());
        skill.setOutputFormat(request.getOutputFormat());
        skill.setUsageExamples(request.getUsageExamples());
        skill.setModelType(request.getModelType());
        skill.setCategoryId(request.getCategoryId());
        skill.setAuthorId(authorId);
        skill.setStatus("PENDING");
        skill.setUsageCount(0);
        skillMapper.insert(skill);

        // Insert variables
        if (request.getVariables() != null) {
            for (int i = 0; i < request.getVariables().size(); i++) {
                SkillCreateRequest.VariableDef def = request.getVariables().get(i);
                SkillVariable var = new SkillVariable();
                var.setSkillId(skill.getId());
                var.setName(def.getName());
                var.setLabel(def.getLabel());
                var.setType(def.getType());
                var.setRequired(def.isRequired());
                var.setDefaultValue(def.getDefaultValue());
                var.setOptionsJson(def.getOptions() != null ?
                        "[" + def.getOptions().stream().map(o -> "\"" + o + "\"").collect(Collectors.joining(",")) + "]" : null);
                var.setSortOrder(def.getSortOrder() != null ? def.getSortOrder() : i);
                skillVariableMapper.insert(var);
            }
        }

        return skill;
    }

    @Override
    @Transactional
    public Skill updateSkill(Long skillId, SkillCreateRequest request, Long userId) {
        Skill skill = skillMapper.selectById(skillId);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        if (!skill.getAuthorId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_SKILL_AUTHOR);
        }

        // Validate template variables
        validateTemplateVariables(request.getPromptTemplate(), request.getVariables());

        skill.setTitle(request.getTitle());
        skill.setIntro(request.getIntro());
        skill.setPromptTemplate(request.getPromptTemplate());
        skill.setOutputFormat(request.getOutputFormat());
        skill.setUsageExamples(request.getUsageExamples());
        skill.setModelType(request.getModelType());
        skill.setCategoryId(request.getCategoryId());

        // If was PUBLISHED, reset to PENDING for re-audit
        if ("PUBLISHED".equals(skill.getStatus())) {
            skill.setStatus("PENDING");
        }

        skillMapper.updateById(skill);

        // Replace variables: delete old, insert new
        QueryWrapper<SkillVariable> delQ = new QueryWrapper<>();
        delQ.eq("skill_id", skillId);
        skillVariableMapper.delete(delQ);

        if (request.getVariables() != null) {
            for (int i = 0; i < request.getVariables().size(); i++) {
                SkillCreateRequest.VariableDef def = request.getVariables().get(i);
                SkillVariable var = new SkillVariable();
                var.setSkillId(skillId);
                var.setName(def.getName());
                var.setLabel(def.getLabel());
                var.setType(def.getType());
                var.setRequired(def.isRequired());
                var.setDefaultValue(def.getDefaultValue());
                var.setOptionsJson(def.getOptions() != null ?
                        "[" + def.getOptions().stream().map(o -> "\"" + o + "\"").collect(Collectors.joining(",")) + "]" : null);
                var.setSortOrder(def.getSortOrder() != null ? def.getSortOrder() : i);
                skillVariableMapper.insert(var);
            }
        }

        return skill;
    }

    @Override
    public void deleteSkill(Long skillId, Long userId) {
        Skill skill = skillMapper.selectById(skillId);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        if (!skill.getAuthorId().equals(userId)) {
            throw new BusinessException(ErrorCode.NOT_SKILL_AUTHOR);
        }
        skillMapper.deleteById(skillId);
    }

    @Override
    public Skill getSkillDetail(Long skillId) {
        Skill skill = skillMapper.selectById(skillId);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        // Public endpoint: only expose PUBLISHED skills
        if (!"PUBLISHED".equals(skill.getStatus())) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }

        // Load author name
        User author = userMapper.selectById(skill.getAuthorId());
        if (author != null) {
            skill.setAuthorName(author.getNickname());
        }

        // Load category name
        if (skill.getCategoryId() != null) {
            SkillCategory cat = skillCategoryMapper.selectById(skill.getCategoryId());
            if (cat != null) {
                skill.setCategoryName(cat.getName());
            }
        }

        // Load avg rating + review count
        List<Review> reviews = reviewMapper.selectList(
                new QueryWrapper<Review>().eq("skill_id", skillId));
        if (!reviews.isEmpty()) {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
            skill.setAvgRating(Math.round(avg * 10.0) / 10.0);
            skill.setReviewCount((long) reviews.size());
        } else {
            skill.setAvgRating(0.0);
            skill.setReviewCount(0L);
        }

        // Load favorite count
        QueryWrapper<Favorite> favQ = new QueryWrapper<>();
        favQ.eq("skill_id", skillId);
        skill.setFavoriteCount(favoriteMapper.selectCount(favQ));

        return skill;
    }

    @Override
    public Page<Skill> listPublishedSkills(String keyword, Long categoryId, String modelType, int page, int size) {
        Page<Skill> p = new Page<>(page, size);
        QueryWrapper<Skill> q = new QueryWrapper<>();
        q.eq("status", "PUBLISHED");

        if (keyword != null && !keyword.isBlank()) {
            q.and(w -> w.like("title", keyword).or().like("intro", keyword));
        }
        if (categoryId != null) {
            q.eq("category_id", categoryId);
        }
        if (modelType != null && !modelType.isBlank()) {
            q.eq("model_type", modelType);
        }

        q.orderByDesc("created_at");

        // Use custom select to attach related data
        Page<Skill> result = skillMapper.selectPage(p, q);
        enrichSkillList(result.getRecords());
        return result;
    }

    @Override
    public Page<Skill> listMySkills(Long userId, int page, int size) {
        Page<Skill> p = new Page<>(page, size);
        QueryWrapper<Skill> q = new QueryWrapper<>();
        q.eq("author_id", userId);
        q.orderByDesc("created_at");
        Page<Skill> result = skillMapper.selectPage(p, q);
        enrichSkillList(result.getRecords());
        return result;
    }

    @Override
    public List<SkillCategory> listCategories() {
        QueryWrapper<SkillCategory> q = new QueryWrapper<>();
        q.orderByAsc("sort_order");
        return skillCategoryMapper.selectList(q);
    }

    private void enrichSkillList(List<Skill> skills) {
        for (Skill skill : skills) {
            User author = userMapper.selectById(skill.getAuthorId());
            skill.setAuthorName(author != null ? author.getNickname() : "未知");

            if (skill.getCategoryId() != null) {
                SkillCategory cat = skillCategoryMapper.selectById(skill.getCategoryId());
                skill.setCategoryName(cat != null ? cat.getName() : null);
            }

            // Avg rating
            List<Review> reviews = reviewMapper.selectList(
                    new QueryWrapper<Review>().eq("skill_id", skill.getId()));
            if (!reviews.isEmpty()) {
                double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
                skill.setAvgRating(Math.round(avg * 10.0) / 10.0);
                skill.setReviewCount((long) reviews.size());
            } else {
                skill.setAvgRating(0.0);
                skill.setReviewCount(0L);
            }

            // Favorite count
            QueryWrapper<Favorite> favQ = new QueryWrapper<>();
            favQ.eq("skill_id", skill.getId());
            skill.setFavoriteCount(favoriteMapper.selectCount(favQ));
        }
    }

    /**
     * Validate that every {{var}} in template matches a defined variable,
     * and every defined variable appears in the template (no unused variables).
     */
    private void validateTemplateVariables(String template, List<SkillCreateRequest.VariableDef> variables) {
        Pattern pattern = Pattern.compile("\\{\\{\\s*(\\w+)\\s*}}");
        java.util.regex.Matcher matcher = pattern.matcher(template);

        java.util.Set<String> templateVars = new java.util.HashSet<>();
        while (matcher.find()) {
            templateVars.add(matcher.group(1));
        }

        java.util.Set<String> definedVars = new java.util.HashSet<>();
        if (variables != null) {
            definedVars = variables.stream().map(SkillCreateRequest.VariableDef::getName).collect(Collectors.toSet());
        }

        // Check dangling placeholders
        for (String tv : templateVars) {
            if (!definedVars.contains(tv)) {
                throw new BusinessException(ErrorCode.VARIABLE_MISMATCH,
                        "模板中存在未定义的变量: {{" + tv + "}}");
            }
        }

        // Check unused variables
        for (String dv : definedVars) {
            if (!templateVars.contains(dv)) {
                throw new BusinessException(ErrorCode.VARIABLE_MISMATCH,
                        "定义的变量 \"" + dv + "\" 未在模板中使用");
            }
        }
    }
}
