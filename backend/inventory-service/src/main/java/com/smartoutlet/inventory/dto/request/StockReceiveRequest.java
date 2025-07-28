package com.smartoutlet.inventory.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StockReceiveRequest {
    
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    @NotNull(message = "Outlet ID is required")
    private Long outletId;
    
    @NotBlank(message = "Batch number is required")
    @Size(max = 100, message = "Batch number must not exceed 100 characters")
    private String batchNumber;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Unit cost must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Unit cost must have at most 8 digits and 2 decimal places")
    private BigDecimal unitCost;
    
    private LocalDate expiryDate;
    
    private LocalDate manufacturedDate;
    
    @NotNull(message = "Received date is required")
    private LocalDate receivedDate;
    
    @Size(max = 100, message = "Supplier reference must not exceed 100 characters")
    private String supplierReference;
    
    @Size(max = 50, message = "Location code must not exceed 50 characters")
    private String locationCode;
    
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;
}