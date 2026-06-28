package com.skillforge.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.common.Result;
import com.skillforge.dto.AuditActionRequest;
import com.skillforge.entity.*;
import com.skillforge.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public Result<Map<String, Object>> dashboard() {
        return Result.success(adminService.getDashboardStats());
    }

    @GetMapping("/skills")
    public Result<Page<Skill>> listSkills(@RequestParam(required = false) String status,
                                          @RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "20") int size) {
        return Result.success(adminService.listAllSkills(status, page, size));
    }

    @PostMapping("/skills/{skillId}/audit")
    public Result<Void> auditSkill(@PathVariable Long skillId,
                                   @Valid @RequestBody AuditActionRequest request,
                                   Authentication auth) {
        Long adminId = (Long) auth.getPrincipal();
        adminService.auditSkill(skillId, request.getAction(), request.getReason(), adminId);
        return Result.success();
    }

    @PostMapping("/categories")
    public Result<Void> createCategory(@RequestParam String name,
                                       @RequestParam(required = false) String description) {
        adminService.createCategory(name, description);
        return Result.success();
    }

    @PutMapping("/categories/{id}")
    public Result<Void> updateCategory(@PathVariable Long id,
                                       @RequestParam(required = false) String name,
                                       @RequestParam(required = false) String description) {
        adminService.updateCategory(id, name, description);
        return Result.success();
    }

    @DeleteMapping("/categories/{id}")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return Result.success();
    }

    @GetMapping("/users")
    public Result<Page<User>> listUsers(@RequestParam(defaultValue = "1") int page,
                                        @RequestParam(defaultValue = "20") int size) {
        return Result.success(adminService.listUsers(page, size));
    }

    @GetMapping("/audit-logs")
    public Result<Page<AuditLog>> listAuditLogs(@RequestParam(defaultValue = "1") int page,
                                                @RequestParam(defaultValue = "20") int size) {
        return Result.success(adminService.listAuditLogs(page, size));
    }
}
