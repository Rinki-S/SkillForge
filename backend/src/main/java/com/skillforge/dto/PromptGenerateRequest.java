package com.skillforge.dto;

import java.util.Map;

public class PromptGenerateRequest {

    private Long skillId;
    private Map<String, String> variableValues;

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public Map<String, String> getVariableValues() { return variableValues; }
    public void setVariableValues(Map<String, String> variableValues) { this.variableValues = variableValues; }
}
