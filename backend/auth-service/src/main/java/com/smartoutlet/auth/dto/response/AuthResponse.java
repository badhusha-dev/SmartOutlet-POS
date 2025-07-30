package com.smartoutlet.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles;
    private Set<String> permissions;
    private LocalDateTime expiresAt;
    private LocalDateTime issuedAt;
    private String refreshToken;
}