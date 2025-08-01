
package com.smartoutlet.common.dto;

import java.time.LocalDateTime;

public class StaffAssignmentResponse {
    private Long id;
    private Long userId;
    private Long outletId;
    private String role;
    private LocalDateTime assignedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;
    
    // Default constructor
    public StaffAssignmentResponse() {}
    
    // Constructor with all fields
    public StaffAssignmentResponse(Long id, Long userId, Long outletId, String role, 
                                 LocalDateTime assignedAt, LocalDateTime createdAt, 
                                 LocalDateTime updatedAt, String status) {
        this.id = id;
        this.userId = userId;
        this.outletId = outletId;
        this.role = role;
        this.assignedAt = assignedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getOutletId() {
        return outletId;
    }
    
    public void setOutletId(Long outletId) {
        this.outletId = outletId;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
    
    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
