package com.skillforge.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.common.Result;
import com.skillforge.dto.ReviewRequest;
import com.skillforge.entity.Favorite;
import com.skillforge.entity.Review;
import com.skillforge.entity.SkillUsageLog;
import com.skillforge.service.EngagementService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EngagementController {

    private final EngagementService engagementService;

    public EngagementController(EngagementService engagementService) {
        this.engagementService = engagementService;
    }

    // ── Favorites ──

    @PostMapping("/favorites/{skillId}")
    public Result<Void> addFavorite(@PathVariable Long skillId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        engagementService.addFavorite(userId, skillId);
        return Result.success();
    }

    @DeleteMapping("/favorites/{skillId}")
    public Result<Void> removeFavorite(@PathVariable Long skillId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        engagementService.removeFavorite(userId, skillId);
        return Result.success();
    }

    @GetMapping("/favorites/my")
    public Result<Page<Favorite>> myFavorites(Authentication auth,
                                              @RequestParam(defaultValue = "1") int page,
                                              @RequestParam(defaultValue = "20") int size) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(engagementService.listFavorites(userId, page, size));
    }

    // ── Reviews ──

    @PostMapping("/reviews/{skillId}")
    public Result<Void> addReview(@PathVariable Long skillId,
                                  @RequestBody ReviewRequest request,
                                  Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        engagementService.addReview(userId, skillId, request);
        return Result.success();
    }

    @GetMapping("/skills/public/{skillId}/reviews")
    public Result<Page<Review>> listReviews(@PathVariable Long skillId,
                                            @RequestParam(defaultValue = "1") int page,
                                            @RequestParam(defaultValue = "20") int size) {
        return Result.success(engagementService.listReviews(skillId, page, size));
    }

    // ── Usage logs ──

    @GetMapping("/usage-logs/my")
    public Result<Page<SkillUsageLog>> myUsageLogs(Authentication auth,
                                                   @RequestParam(defaultValue = "1") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(engagementService.listUsageLogs(userId, page, size));
    }
}
