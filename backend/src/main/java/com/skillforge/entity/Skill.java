package com.skillforge.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

@TableName("skills")
public class Skill {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String intro;

    private String promptTemplate;

    private String outputFormat;

    private String usageExamples;

    private String modelType;

    private Long categoryId;

    private Long authorId;

    private String status;

    private Integer usageCount;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;

    // Transient fields (not in DB)
    @TableField(exist = false)
    private String authorName;

    @TableField(exist = false)
    private String categoryName;

    @TableField(exist = false)
    private Double avgRating;

    @TableField(exist = false)
    private Long favoriteCount;

    @TableField(exist = false)
    private Long reviewCount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getUsageCount() { return usageCount; }
    public void setUsageCount(Integer usageCount) { this.usageCount = usageCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Integer getDeleted() { return deleted; }
    public void setDeleted(Integer deleted) { this.deleted = deleted; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
    public Long getFavoriteCount() { return favoriteCount; }
    public void setFavoriteCount(Long favoriteCount) { this.favoriteCount = favoriteCount; }
    public Long getReviewCount() { return reviewCount; }
    public void setReviewCount(Long reviewCount) { this.reviewCount = reviewCount; }
}
