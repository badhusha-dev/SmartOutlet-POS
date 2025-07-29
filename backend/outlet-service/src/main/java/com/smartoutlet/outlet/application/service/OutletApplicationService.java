package com.smartoutlet.outlet.application.service;

import com.smartoutlet.outlet.api.dto.OutletRequest;
import com.smartoutlet.outlet.api.dto.OutletResponse;
import com.smartoutlet.outlet.api.dto.StaffAssignmentRequest;
import com.smartoutlet.outlet.api.dto.StaffAssignmentResponse;

import java.util.List;

public interface OutletApplicationService {
    
    OutletResponse createOutlet(OutletRequest request);
    
    OutletResponse getOutletById(Long id);
    
    List<OutletResponse> getAllOutlets();
    
    OutletResponse updateOutlet(Long id, OutletRequest request);
    
    void deleteOutlet(Long id);
    
    List<OutletResponse> getOutletsByCity(String city);
    
    List<OutletResponse> getActiveOutlets();
    
    StaffAssignmentResponse assignStaffToOutlet(Long outletId, StaffAssignmentRequest request);
    
    void removeStaffFromOutlet(Long outletId, Long userId);
    
    List<StaffAssignmentResponse> getStaffAssignments(Long outletId);
    
    List<OutletResponse> searchOutlets(String query);
} 