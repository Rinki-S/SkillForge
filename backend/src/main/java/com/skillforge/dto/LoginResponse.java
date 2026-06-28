package com.skillforge.dto;

public class LoginResponse {

    private String token;
    private Long userId;
    private String username;
    private String role;
    private String nickname;

    public LoginResponse(String token, Long userId, String username, String role, String nickname) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.nickname = nickname;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}
