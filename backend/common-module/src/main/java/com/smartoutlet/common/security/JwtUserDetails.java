package com.smartoutlet.common.security;

public class JwtUserDetails {
    private final String username;
    private final String role;
    private final Long userId;

    public JwtUserDetails(String username, String role, Long userId) {
        this.username = username;
        this.role = role;
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public Long getUserId() {
        return userId;
    }
} 