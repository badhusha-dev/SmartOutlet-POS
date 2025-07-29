package com.smartoutlet.outlet.application.service;

import com.smartoutlet.outlet.api.dto.StaffAssignmentRequest;
import com.smartoutlet.outlet.api.dto.StaffAssignmentResponse;

import java.util.List;

public interface StaffAssignmentService {
    
    /**
     * Assign staff to an outlet
     */
    StaffAssignmentResponse assignStaff(StaffAssignmentRequest request);
    
    /**
     * Get all staff assigned to an outlet
     */
    List<StaffAssignmentResponse> getStaffByOutlet(Long outletId);
    
    /**
     * Get all outlets assigned to a user
     */
    List<StaffAssignmentResponse> getOutletsByUser(Long userId);
    
    /**
     * Update staff assignment
     */
    StaffAssignmentResponse updateAssignment(Long assignmentId, StaffAssignmentRequest request);
    
    /**
     * Remove staff assignment (mark as inactive)
     */
    void removeAssignment(Long assignmentId);
    
    /**
     * Get assignment by ID
     */
    StaffAssignmentResponse getAssignmentById(Long assignmentId);
} 