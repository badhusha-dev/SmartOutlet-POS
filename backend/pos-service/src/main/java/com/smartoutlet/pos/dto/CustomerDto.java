package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Schema(description = "Customer information for POS transactions")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CustomerDto extends BaseDto {
    
    @Schema(description = "Customer's first name", example = "John")
    private String firstName;
    
    @Schema(description = "Customer's last name", example = "Doe")
    private String lastName;
    
    @Schema(description = "Customer's email address", example = "john.doe@example.com")
    private String email;
    
    @Schema(description = "Customer's phone number", example = "+1-555-123-4567")
    private String phone;
    
    @Schema(description = "Customer's address", example = "123 Main Street")
    private String address;
    
    @Schema(description = "Customer's city", example = "New York")
    private String city;
    
    @Schema(description = "Customer's state", example = "NY")
    private String state;
    
    @Schema(description = "Customer's zip code", example = "10001")
    private String zipCode;
    
    @Schema(description = "Customer's country", example = "USA")
    private String country;
    
    @Schema(description = "Customer's loyalty points", example = "150")
    private Integer loyaltyPoints;
    
    @Schema(description = "Total amount spent by customer", example = "1250.75")
    private Double totalSpent;
    
    @Schema(description = "Number of visits by customer", example = "12")
    private Integer visitCount;
    
    @Schema(description = "Whether customer is active", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Customer type", example = "VIP", allowableValues = {"REGULAR", "VIP", "PREMIUM", "WHOLESALE"})
    private String customerType;
    
    @Schema(description = "Customer's full name", example = "John Doe")
    private String fullName;
    
    @Schema(description = "Date when customer was created", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Date when customer was last updated", example = "2024-01-20T14:45:00")
    private LocalDateTime updatedAt;
} 