package com.skillforge.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

@TableName("skill_usage_logs")
public class SkillUsageLog {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long skillId;

    private String renderedPrompt;

    private String variableValuesJson;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(exist = false)
    private String skillTitle;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public String getRenderedPrompt() { return renderedPrompt; }
    public void setRenderedPrompt(String renderedPrompt) { this.renderedPrompt = renderedPrompt; }
    public String getVariableValuesJson() { return variableValuesJson; }
    public void setVariableValuesJson(String variableValuesJson) { this.variableValuesJson = variableValuesJson; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getSkillTitle() { return skillTitle; }
    public void setSkillTitle(String skillTitle) { this.skillTitle = skillTitle; }
}
