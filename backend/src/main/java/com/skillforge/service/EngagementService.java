package com.skillforge.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.dto.ReviewRequest;
import com.skillforge.entity.Favorite;
import com.skillforge.entity.Review;
import com.skillforge.entity.SkillUsageLog;

public interface EngagementService {
    void addFavorite(Long userId, Long skillId);
    void removeFavorite(Long userId, Long skillId);
    Page<Favorite> listFavorites(Long userId, int page, int size);
    void addReview(Long userId, Long skillId, ReviewRequest request);
    Page<Review> listReviews(Long skillId, int page, int size);
    Page<SkillUsageLog> listUsageLogs(Long userId, int page, int size);
}
