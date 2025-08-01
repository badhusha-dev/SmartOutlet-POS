package com.smartoutlet.common.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffAssignmentResponse {
    
    private Long id;
    private Long userId;
    private String username;
    private String userEmail;
    private String userFullName;
    private Long outletId;
    private String outletName;
    private String role;
    private LocalDateTime assignedAt;
    private Boolean isActive;
}
