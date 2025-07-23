package com.smartoutlet.auth.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthEvent {
    private String eventType;
    private Long userId;
    private String username;
    private String email;
    private String action;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime timestamp;
    private Boolean success;
    private String errorMessage;
    private String sessionId;
} 