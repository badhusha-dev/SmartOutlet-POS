package com.smartoutlet.outlet.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffAssignmentRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String username;
    private String userEmail;
    private String userFullName;
    
    @NotNull(message = "Outlet ID is required")
    private Long outletId;
    
    private String role;
}