package com.smartoutlet.outlet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Outlet information")
public class OutletDto {
    
    @Schema(description = "Unique outlet identifier", example = "1")
    private Long id;
    
    @Schema(description = "Outlet name", example = "Downtown Coffee Shop")
    private String name;
    
    @Schema(description = "Outlet code", example = "DT001")
    private String code;
    
    @Schema(description = "Outlet description", example = "Premium coffee shop in downtown area")
    private String description;
    
    @Schema(description = "Street address", example = "123 Main Street")
    private String address;
    
    @Schema(description = "City", example = "New York")
    private String city;
    
    @Schema(description = "State/Province", example = "NY")
    private String state;
    
    @Schema(description = "ZIP/Postal code", example = "10001")
    private String zipCode;
    
    @Schema(description = "Country", example = "USA")
    private String country;
    
    @Schema(description = "Latitude coordinate", example = "40.7128")
    private BigDecimal latitude;
    
    @Schema(description = "Longitude coordinate", example = "-74.0060")
    private BigDecimal longitude;
    
    @Schema(description = "Phone number", example = "+1-555-0123")
    private String phone;
    
    @Schema(description = "Email address", example = "downtown@smartoutlet.com")
    private String email;
    
    @Schema(description = "Website URL", example = "https://downtown.smartoutlet.com")
    private String website;
    
    @Schema(description = "Manager ID", example = "1")
    private Long managerId;
    
    @Schema(description = "Manager name", example = "John Doe")
    private String managerName;
    
    @Schema(description = "Manager email", example = "john.doe@smartoutlet.com")
    private String managerEmail;
    
    @Schema(description = "Manager phone", example = "+1-555-0124")
    private String managerPhone;
    
    @Schema(description = "Opening hours", example = "9:00 AM - 9:00 PM")
    private String openingHours;
    
    @Schema(description = "Outlet status", example = "ACTIVE", allowableValues = {"ACTIVE", "INACTIVE", "MAINTENANCE", "CLOSED"})
    private String status;
    
    @Schema(description = "Outlet type", example = "COFFEE_SHOP", allowableValues = {"COFFEE_SHOP", "RESTAURANT", "RETAIL", "KIOSK"})
    private String type;
    
    @Schema(description = "Outlet size in square feet", example = "1500")
    private Integer size;
    
    @Schema(description = "Number of employees", example = "15")
    private Integer employeeCount;
    
    @Schema(description = "Maximum capacity", example = "50")
    private Integer capacity;
    
    @Schema(description = "Parking available", example = "true")
    private Boolean parkingAvailable;
    
    @Schema(description = "Wheelchair accessible", example = "true")
    private Boolean wheelchairAccessible;
    
    @Schema(description = "WiFi available", example = "true")
    private Boolean wifiAvailable;
    
    @Schema(description = "Delivery available", example = "true")
    private Boolean deliveryAvailable;
    
    @Schema(description = "Takeaway available", example = "true")
    private Boolean takeawayAvailable;
    
    @Schema(description = "Average rating", example = "4.5")
    private Double averageRating;
    
    @Schema(description = "Number of reviews", example = "125")
    private Integer reviewCount;
    
    @Schema(description = "Monthly revenue", example = "45000.00")
    private BigDecimal monthlyRevenue;
    
    @Schema(description = "Outlet image URL", example = "https://example.com/images/downtown-outlet.jpg")
    private String imageUrl;
    
    @Schema(description = "List of staff members")
    private List<StaffDto> staff;
    
    @Schema(description = "Creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2024-01-15T14:45:00")
    private LocalDateTime updatedAt;
} 