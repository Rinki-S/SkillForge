package com.skillforge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class SkillCreateRequest {

    @NotBlank(message = "标题不能为空")
    private String title;

    @NotBlank(message = "简介不能为空")
    private String intro;

    @NotBlank(message = "Prompt 模板不能为空")
    private String promptTemplate;

    private String outputFormat;

    private String usageExamples;

    private String modelType;

    private Long categoryId;

    private List<VariableDef> variables;

    public static class VariableDef {
        private String name;
        private String label;
        private String type;
        private boolean required;
        private String defaultValue;
        private List<String> options;
        private Integer sortOrder;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public boolean isRequired() { return required; }
        public void setRequired(boolean required) { this.required = required; }
        public String getDefaultValue() { return defaultValue; }
        public void setDefaultValue(String defaultValue) { this.defaultValue = defaultValue; }
        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }
        public Integer getSortOrder() { return sortOrder; }
        public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getIntro() { return intro; }
    public void setIntro(String intro) { this.intro = intro; }
    public String getPromptTemplate() { return promptTemplate; }
    public void setPromptTemplate(String promptTemplate) { this.promptTemplate = promptTemplate; }
    public String getOutputFormat() { return outputFormat; }
    public void setOutputFormat(String outputFormat) { this.outputFormat = outputFormat; }
    public String getUsageExamples() { return usageExamples; }
    public void setUsageExamples(String usageExamples) { this.usageExamples = usageExamples; }
    public String getModelType() { return modelType; }
    public void setModelType(String modelType) { this.modelType = modelType; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public List<VariableDef> getVariables() { return variables; }
    public void setVariables(List<VariableDef> variables) { this.variables = variables; }
}
