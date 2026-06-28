package com.skillforge.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.common.BusinessException;
import com.skillforge.common.ErrorCode;
import com.skillforge.dto.ReviewRequest;
import com.skillforge.entity.*;
import com.skillforge.mapper.*;
import com.skillforge.service.EngagementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EngagementServiceImpl implements EngagementService {

    private final FavoriteMapper favoriteMapper;
    private final ReviewMapper reviewMapper;
    private final SkillUsageLogMapper usageLogMapper;
    private final SkillMapper skillMapper;
    private final UserMapper userMapper;

    public EngagementServiceImpl(FavoriteMapper favoriteMapper, ReviewMapper reviewMapper,
                                 SkillUsageLogMapper usageLogMapper, SkillMapper skillMapper,
                                 UserMapper userMapper) {
        this.favoriteMapper = favoriteMapper;
        this.reviewMapper = reviewMapper;
        this.usageLogMapper = usageLogMapper;
        this.skillMapper = skillMapper;
        this.userMapper = userMapper;
    }

    @Override
    public void addFavorite(Long userId, Long skillId) {
        QueryWrapper<Favorite> q = new QueryWrapper<>();
        q.eq("user_id", userId).eq("skill_id", skillId);
        if (favoriteMapper.selectCount(q) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_FAVORITE);
        }
        Favorite fav = new Favorite();
        fav.setUserId(userId);
        fav.setSkillId(skillId);
        favoriteMapper.insert(fav);
    }

    @Override
    public void removeFavorite(Long userId, Long skillId) {
        QueryWrapper<Favorite> q = new QueryWrapper<>();
        q.eq("user_id", userId).eq("skill_id", skillId);
        favoriteMapper.delete(q); // Idempotent
    }

    @Override
    public Page<Favorite> listFavorites(Long userId, int page, int size) {
        Page<Favorite> p = new Page<>(page, size);
        QueryWrapper<Favorite> q = new QueryWrapper<>();
        q.eq("user_id", userId).orderByDesc("created_at");
        return favoriteMapper.selectPage(p, q);
    }

    @Override
    @Transactional
    public void addReview(Long userId, Long skillId, ReviewRequest request) {
        // Check duplicate
        QueryWrapper<Review> q = new QueryWrapper<>();
        q.eq("user_id", userId).eq("skill_id", skillId);
        if (reviewMapper.selectCount(q) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_REVIEW);
        }

        // Validate skill exists
        Skill skill = skillMapper.selectById(skillId);
        if (skill == null) {
            throw new BusinessException(ErrorCode.SKILL_NOT_FOUND);
        }

        Review review = new Review();
        review.setUserId(userId);
        review.setSkillId(skillId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewMapper.insert(review);
    }

    @Override
    public Page<Review> listReviews(Long skillId, int page, int size) {
        Page<Review> p = new Page<>(page, size);
        QueryWrapper<Review> q = new QueryWrapper<>();
        q.eq("skill_id", skillId).orderByDesc("created_at");
        Page<Review> result = reviewMapper.selectPage(p, q);
        for (Review r : result.getRecords()) {
            User u = userMapper.selectById(r.getUserId());
            r.setUsername(u != null ? u.getNickname() : "未知");
        }
        return result;
    }

    @Override
    public Page<SkillUsageLog> listUsageLogs(Long userId, int page, int size) {
        Page<SkillUsageLog> p = new Page<>(page, size);
        QueryWrapper<SkillUsageLog> q = new QueryWrapper<>();
        q.eq("user_id", userId).orderByDesc("created_at");
        Page<SkillUsageLog> result = usageLogMapper.selectPage(p, q);
        for (SkillUsageLog log : result.getRecords()) {
            Skill skill = skillMapper.selectById(log.getSkillId());
            log.setSkillTitle(skill != null ? skill.getTitle() : "已删除");
        }
        return result;
    }
}
