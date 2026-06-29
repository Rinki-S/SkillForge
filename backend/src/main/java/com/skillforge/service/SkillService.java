package com.skillforge.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.dto.SkillCreateRequest;
import com.skillforge.entity.Skill;
import com.skillforge.entity.SkillCategory;

import java.util.List;

public interface SkillService {
    Skill createSkill(SkillCreateRequest request, Long authorId);
    Skill updateSkill(Long skillId, SkillCreateRequest request, Long userId);
    void deleteSkill(Long skillId, Long userId);
    Skill getSkillDetail(Long skillId);
    Skill getAuthorSkillDetail(Long skillId, Long userId);
    Page<Skill> listPublishedSkills(String keyword, Long categoryId, String modelType, int page, int size);
    Page<Skill> listMySkills(Long userId, int page, int size);
    List<SkillCategory> listCategories();
}
