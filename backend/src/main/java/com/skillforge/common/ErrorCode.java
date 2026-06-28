package com.skillforge.common;

public enum ErrorCode {

    // 401x — Authentication
    UNAUTHORIZED(4010, "未登录，请先登录"),
    TOKEN_EXPIRED(4011, "登录已过期，请重新登录"),
    TOKEN_INVALID(4012, "登录令牌无效"),

    // 403x — Authorization
    FORBIDDEN(4030, "无权限执行此操作"),
    NOT_SKILL_AUTHOR(4031, "仅作者可编辑或删除此 Skill"),

    // 404x — Not Found
    NOT_FOUND(4040, "数据不存在"),
    USER_NOT_FOUND(4041, "用户不存在"),
    SKILL_NOT_FOUND(4042, "Skill 不存在"),

    // 409x — Conflict
    DUPLICATE_FAVORITE(4091, "已收藏"),
    DUPLICATE_REVIEW(4092, "已评价"),
    DUPLICATE_USERNAME(4093, "用户名已存在"),

    // 422x — Validation
    VALIDATION_ERROR(4220, "请求参数校验失败"),
    VARIABLE_MISMATCH(4221, "模板变量与配置不匹配"),
    MISSING_REQUIRED_VARIABLE(4222, "变量缺失"),
    INVALID_SELECT_VALUE(4223, "选项值不合法"),

    // 500x — Server
    INTERNAL_ERROR(5000, "服务器内部错误");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
}
