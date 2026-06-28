package com.skillforge.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.common.BusinessException;
import com.skillforge.common.ErrorCode;
import com.skillforge.entity.*;
import com.skillforge.mapper.*;
import com.skillforge.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserMapper userMapper;
    private final SkillMapper skillMapper;
    private final SkillCategoryMapper categoryMapper;
    private final AuditLogMapper auditLogMapper;

    public AdminServiceImpl(UserMapper userMapper, SkillMapper skillMapper,
                            SkillCategoryMapper categoryMapper, AuditLogMapper auditLogMapper) {
        this.userMapper = userMapper;
        this.skillMapper = skillMapper;
        this.categoryMapper = categoryMapper;
        this.auditLogMapper = auditLogMapper;
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userMapper.selectCount(null));
        stats.put("totalSkills", skillMapper.selectCount(null));

        QueryWrapper<Skill> pendingQ = new QueryWrapper<>();
        pendingQ.eq("status", "PENDING");
        stats.put("pendingAudit", skillMapper.selectCount(pendingQ));

        QueryWrapper<Skill> publishedQ = new QueryWrapper<>();
        publishedQ.eq("status", "PUBLISHED");
        stats.put("publishedSkills", skillMapper.selectCount(publishedQ));

        return stats;
    }

    @Override
    public Page<Skill> listAllSkills(String status, int page, int size) {
        Page<Skill> p = new Page<>(page, size);
        QueryWrapper<Skill> q = new QueryWrapper<>();
        if (status != null && !status.isBlank()) {
            q.eq("status", status);
        }
        q.orderByDesc("created_at");
        return skillMapper.selectPage(p, q);
    }

    @Override
    @Transactional
    public void auditSkill(Long skillId, String action, String reason, Long adminId) {
        Skill skill = skillMapper.selectById(skillId);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }

        switch (action) {
            case "approve" -> {
                if (!"PENDING".equals(skill.getStatus())) {
                    throw new BusinessException(ErrorCode.VALIDATION_ERROR, "只能审核待审核状态的 Skill");
                }
                skill.setStatus("PUBLISHED");
            }
            case "reject" -> {
                if (!"PENDING".equals(skill.getStatus())) {
                    throw new BusinessException(ErrorCode.VALIDATION_ERROR, "只能审核待审核状态的 Skill");
                }
                skill.setStatus("REJECTED");
            }
            case "offline" -> {
                if (!"PUBLISHED".equals(skill.getStatus())) {
                    throw new BusinessException(ErrorCode.VALIDATION_ERROR, "只能下架已发布的 Skill");
                }
                skill.setStatus("OFFLINE");
            }
            case "delete" -> {
                skillMapper.deleteById(skillId);
                // Log audit and return
                AuditLog auditLog = new AuditLog();
                auditLog.setAdminId(adminId);
                auditLog.setTargetType("skill");
                auditLog.setTargetId(skillId);
                auditLog.setAction("delete");
                auditLog.setDetail(reason);
                auditLogMapper.insert(auditLog);
                return;
            }
            default -> throw new BusinessException(ErrorCode.VALIDATION_ERROR, "不支持的操作: " + action);
        }

        skillMapper.updateById(skill);

        // Write audit log
        AuditLog auditLog = new AuditLog();
        auditLog.setAdminId(adminId);
        auditLog.setTargetType("skill");
        auditLog.setTargetId(skillId);
        auditLog.setAction(action);
        auditLog.setDetail(reason);
        auditLogMapper.insert(auditLog);
    }

    @Override
    @Transactional
    public void createCategory(String name, String description) {
        // Check duplicate name
        QueryWrapper<SkillCategory> q = new QueryWrapper<>();
        q.eq("name", name);
        if (categoryMapper.selectCount(q) > 0) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "分类名称已存在");
        }

        SkillCategory cat = new SkillCategory();
        cat.setName(name);
        cat.setDescription(description);
        categoryMapper.insert(cat);
    }

    @Override
    @Transactional
    public void updateCategory(Long id, String name, String description) {
        SkillCategory cat = categoryMapper.selectById(id);
        if (cat == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "分类不存在");
        }
        if (name != null) {
            // Check unique name (exclude self)
            QueryWrapper<SkillCategory> q = new QueryWrapper<>();
            q.eq("name", name).ne("id", id);
            if (categoryMapper.selectCount(q) > 0) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "分类名称已存在");
            }
            cat.setName(name);
        }
        if (description != null) {
            cat.setDescription(description);
        }
        categoryMapper.updateById(cat);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        SkillCategory cat = categoryMapper.selectById(id);
        if (cat == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "分类不存在");
        }

        // Reassign skills in this category to null (prevent orphan)
        QueryWrapper<Skill> skillQ = new QueryWrapper<>();
        skillQ.eq("category_id", id);
        Skill updateSkill = new Skill();
        updateSkill.setCategoryId(null);
        skillMapper.update(updateSkill, skillQ);

        categoryMapper.deleteById(id);
    }

    @Override
    public Page<User> listUsers(int page, int size) {
        Page<User> p = new Page<>(page, size);
        QueryWrapper<User> q = new QueryWrapper<>();
        q.orderByDesc("created_at");
        Page<User> result = userMapper.selectPage(p, q);
        // Mask passwords
        for (User user : result.getRecords()) {
            user.setPassword(null);
        }
        return result;
    }

    @Override
    public Page<AuditLog> listAuditLogs(int page, int size) {
        Page<AuditLog> p = new Page<>(page, size);
        QueryWrapper<AuditLog> q = new QueryWrapper<>();
        q.orderByDesc("created_at");
        Page<AuditLog> result = auditLogMapper.selectPage(p, q);
        for (AuditLog log : result.getRecords()) {
            User admin = userMapper.selectById(log.getAdminId());
            log.setAdminName(admin != null ? admin.getNickname() : "未知");
            if ("skill".equals(log.getTargetType()) && log.getTargetId() != null) {
                Skill skill = skillMapper.selectById(log.getTargetId());
                log.setTargetTitle(skill != null ? skill.getTitle() : "已删除");
            }
        }
        return result;
    }
}
