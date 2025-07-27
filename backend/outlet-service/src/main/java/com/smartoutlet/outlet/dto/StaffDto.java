package com.smartoutlet.outlet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Staff member information")
public class StaffDto {
    
    @Schema(description = "Unique staff identifier", example = "1")
    private Long id;
    
    @Schema(description = "Staff member name", example = "Jane Smith")
    private String name;
    
    @Schema(description = "Staff member email", example = "jane.smith@smartoutlet.com")
    private String email;
    
    @Schema(description = "Staff member phone", example = "+1-555-0125")
    private String phone;
    
    @Schema(description = "Staff member position", example = "Barista", allowableValues = {"MANAGER", "BARISTA", "CASHIER", "KITCHEN_STAFF", "CLEANER"})
    private String position;
    
    @Schema(description = "Staff member role", example = "STAFF", allowableValues = {"ADMIN", "MANAGER", "STAFF"})
    private String role;
    
    @Schema(description = "Hourly wage", example = "15.50")
    private BigDecimal hourlyWage;
    
    @Schema(description = "Employment start date", example = "2024-01-15")
    private LocalDateTime startDate;
    
    @Schema(description = "Employment end date (if applicable)", example = "2024-12-31")
    private LocalDateTime endDate;
    
    @Schema(description = "Staff member status", example = "ACTIVE", allowableValues = {"ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"})
    private String status;
    
    @Schema(description = "Outlet ID where staff works", example = "1")
    private Long outletId;
    
    @Schema(description = "Outlet name", example = "Downtown Coffee Shop")
    private String outletName;
    
    @Schema(description = "Staff member address", example = "456 Oak Street, New York, NY 10002")
    private String address;
    
    @Schema(description = "Emergency contact name", example = "John Smith")
    private String emergencyContactName;
    
    @Schema(description = "Emergency contact phone", example = "+1-555-0126")
    private String emergencyContactPhone;
    
    @Schema(description = "Staff member image URL", example = "https://example.com/images/jane-smith.jpg")
    private String imageUrl;
    
    @Schema(description = "Staff member bio", example = "Experienced barista with 3 years in specialty coffee")
    private String bio;
    
    @Schema(description = "Skills and certifications", example = "Barista certification, Food safety training")
    private String skills;
    
    @Schema(description = "Preferred working hours", example = "Morning shifts (6 AM - 2 PM)")
    private String preferredHours;
    
    @Schema(description = "Creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2024-01-15T14:45:00")
    private LocalDateTime updatedAt;
} 