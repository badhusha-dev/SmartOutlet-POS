package com.smartoutlet.outlet.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutletRequest {
    
    @NotBlank(message = "Outlet name is required")
    @Size(max = 100, message = "Outlet name cannot exceed 100 characters")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String phoneNumber;
    private String email;
    private Long managerId;
    private String managerName;
    private String openingHours;
    private Boolean isActive = true;
}