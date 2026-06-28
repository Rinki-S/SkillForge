package com.skillforge.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.skillforge.entity.*;

import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboardStats();
    Page<Skill> listAllSkills(String status, int page, int size);
    void auditSkill(Long skillId, String action, String reason, Long adminId);
    void createCategory(String name, String description);
    void updateCategory(Long id, String name, String description);
    void deleteCategory(Long id);
    Page<User> listUsers(int page, int size);
    Page<AuditLog> listAuditLogs(int page, int size);
}
