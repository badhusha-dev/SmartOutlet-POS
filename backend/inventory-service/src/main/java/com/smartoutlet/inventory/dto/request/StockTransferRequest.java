package com.smartoutlet.inventory.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StockTransferRequest {
    
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    @NotNull(message = "Source outlet ID is required")
    private Long sourceOutletId;
    
    @NotNull(message = "Destination outlet ID is required")
    private Long destinationOutletId;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;
    
    // For specific batch transfer
    private String batchNumber;
    
    // Reference information
    @Size(max = 100, message = "Reference ID must not exceed 100 characters")
    private String referenceId;
    
    @Size(max = 50, message = "Reference type must not exceed 50 characters")
    private String referenceType;
}