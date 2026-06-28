package com.skillforge.dto;

import jakarta.validation.constraints.NotBlank;

public class AuditActionRequest {

    @NotBlank(message = "操作类型不能为空")
    private String action; // approve, reject, offline, delete

    private String reason;

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
