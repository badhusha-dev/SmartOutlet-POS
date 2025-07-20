package com.smartoutlet.outlet.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffAssignmentEvent {
    private String eventType;
    private Long assignmentId;
    private Long outletId;
    private String outletName;
    private Long userId;
    private String username;
    private String userEmail;
    private String userFullName;
    private String role;
    private Boolean isActive;
    private LocalDateTime assignedAt;
    private LocalDateTime timestamp;
    private String action;
    private String performedBy;
} 