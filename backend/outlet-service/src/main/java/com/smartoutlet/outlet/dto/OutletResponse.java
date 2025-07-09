package com.smartoutlet.outlet.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutletResponse {
    
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String phoneNumber;
    private String email;
    private Long managerId;
    private String managerName;
    private Boolean isActive;
    private String openingHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<StaffAssignmentResponse> staffAssignments;
}