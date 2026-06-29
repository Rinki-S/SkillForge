package com.skillforge.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.common.BusinessException;
import com.skillforge.common.ErrorCode;
import com.skillforge.common.Result;
import com.skillforge.dto.SkillCreateRequest;
import com.skillforge.entity.Skill;
import com.skillforge.entity.SkillCategory;
import com.skillforge.entity.SkillVariable;
import com.skillforge.mapper.SkillMapper;
import com.skillforge.mapper.SkillVariableMapper;
import com.skillforge.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;
    private final SkillVariableMapper skillVariableMapper;
    private final SkillMapper skillMapper;

    public SkillController(SkillService skillService, SkillVariableMapper skillVariableMapper,
                           SkillMapper skillMapper) {
        this.skillService = skillService;
        this.skillVariableMapper = skillVariableMapper;
        this.skillMapper = skillMapper;
    }

    // ── Public endpoints ──

    @GetMapping("/public/marketplace")
    public Result<Page<Skill>> listPublished(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String modelType,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return Result.success(skillService.listPublishedSkills(keyword, categoryId, modelType, page, size));
    }

    @GetMapping("/public/{id}")
    public Result<Skill> detail(@PathVariable Long id) {
        return Result.success(skillService.getSkillDetail(id));
    }

    @GetMapping("/public/{id}/variables")
    public Result<List<SkillVariable>> variables(@PathVariable Long id) {
        Skill skill = skillMapper.selectById(id);
        if (skill == null || !"PUBLISHED".equals(skill.getStatus())) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        QueryWrapper<SkillVariable> q = new QueryWrapper<>();
        q.eq("skill_id", id).orderByAsc("sort_order");
        return Result.success(skillVariableMapper.selectList(q));
    }

    // ── Authenticated endpoints ──

    @PostMapping
    public Result<Skill> create(@Valid @RequestBody SkillCreateRequest request,
                                Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(skillService.createSkill(request, userId));
    }

    @GetMapping("/{id}")
    public Result<Skill> mySkillDetail(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Skill skill = skillService.getAuthorSkillDetail(id, userId);
        return Result.success(skill);
    }

    @PutMapping("/{id}")
    public Result<Skill> update(@PathVariable Long id,
                                @Valid @RequestBody SkillCreateRequest request,
                                Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(skillService.updateSkill(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        skillService.deleteSkill(id, userId);
        return Result.success();
    }

    @GetMapping("/my")
    public Result<Page<Skill>> mySkills(Authentication auth,
                                        @RequestParam(defaultValue = "1") int page,
                                        @RequestParam(defaultValue = "20") int size) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(skillService.listMySkills(userId, page, size));
    }

    @GetMapping("/categories")
    public Result<List<SkillCategory>> categories() {
        return Result.success(skillService.listCategories());
    }
}
