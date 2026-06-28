package com.skillforge.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillforge.common.BusinessException;
import com.skillforge.common.ErrorCode;
import com.skillforge.entity.Skill;
import com.skillforge.entity.SkillUsageLog;
import com.skillforge.entity.SkillVariable;
import com.skillforge.mapper.SkillMapper;
import com.skillforge.mapper.SkillUsageLogMapper;
import com.skillforge.mapper.SkillVariableMapper;
import com.skillforge.service.PromptService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class PromptServiceImpl implements PromptService {

    private final SkillMapper skillMapper;
    private final SkillVariableMapper skillVariableMapper;
    private final SkillUsageLogMapper usageLogMapper;
    private final ObjectMapper objectMapper;

    private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\{\\{\\s*(\\w+)\\s*}}");

    public PromptServiceImpl(SkillMapper skillMapper, SkillVariableMapper skillVariableMapper,
                             SkillUsageLogMapper usageLogMapper, ObjectMapper objectMapper) {
        this.skillMapper = skillMapper;
        this.skillVariableMapper = skillVariableMapper;
        this.usageLogMapper = usageLogMapper;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public String generatePrompt(Long skillId, Map<String, String> variableValues, Long userId) {
        Skill skill = skillMapper.selectById(skillId);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }
        if (!"PUBLISHED".equals(skill.getStatus())) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "该 Skill 尚未发布");
        }

        // Load variables
        QueryWrapper<SkillVariable> q = new QueryWrapper<>();
        q.eq("skill_id", skillId).orderByAsc("sort_order");
        List<SkillVariable> variables = skillVariableMapper.selectList(q);

        // Backend authoritative validation
        for (SkillVariable var : variables) {
            String submittedValue = variableValues != null ? variableValues.get(var.getName()) : null;

            // Check required
            if (var.getRequired() && (submittedValue == null || submittedValue.isBlank())) {
                throw new BusinessException(ErrorCode.MISSING_REQUIRED_VARIABLE,
                        "缺少必填变量: " + var.getLabel());
            }

            if (submittedValue != null && !submittedValue.isBlank()) {
                // Validate select options
                if ("select".equals(var.getType()) && var.getOptionsJson() != null) {
                    List<String> options = parseJsonArray(var.getOptionsJson());
                    if (!options.contains(submittedValue)) {
                        throw new BusinessException(ErrorCode.INVALID_SELECT_VALUE,
                                var.getLabel() + " 的值不在可选范围内");
                    }
                }

                // Validate number type
                if ("number".equals(var.getType())) {
                    try {
                        Double.parseDouble(submittedValue);
                    } catch (NumberFormatException e) {
                        throw new BusinessException(ErrorCode.VALIDATION_ERROR,
                                var.getLabel() + " 必须是数字");
                    }
                }
            }
        }

        // Render prompt: replace {{varName}} with submitted values
        String template = skill.getPromptTemplate();
        String rendered = VARIABLE_PATTERN.matcher(template).replaceAll(match -> {
            String varName = match.group(1);
            String value = variableValues != null ? variableValues.get(varName) : null;
            if (value != null) {
                return value;
            }
            // Fall back to default
            for (SkillVariable v : variables) {
                if (v.getName().equals(varName) && v.getDefaultValue() != null) {
                    return v.getDefaultValue();
                }
            }
            return "";
        });

        // Log usage
        SkillUsageLog log = new SkillUsageLog();
        log.setUserId(userId);
        log.setSkillId(skillId);
        log.setRenderedPrompt(rendered);
        try {
            log.setVariableValuesJson(objectMapper.writeValueAsString(variableValues));
        } catch (JsonProcessingException e) {
            log.setVariableValuesJson("{}");
        }
        usageLogMapper.insert(log);

        // Increment usage count
        skill.setUsageCount(skill.getUsageCount() == null ? 1 : skill.getUsageCount() + 1);
        skillMapper.updateById(skill);

        return rendered;
    }

    private List<String> parseJsonArray(String json) {
        try {
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (Exception e) {
            return List.of();
        }
    }
}
