package com.smartoutlet.inventory.dto.request;

import com.smartoutlet.inventory.entity.TransactionType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StockAdjustmentRequest {
    
    @NotNull(message = "Inventory item ID is required")
    private Long inventoryItemId;
    
    @NotNull(message = "Adjustment type is required")
    private TransactionType adjustmentType;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    @NotBlank(message = "Reason is required")
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;
    
    // Reference information
    @Size(max = 100, message = "Reference ID must not exceed 100 characters")
    private String referenceId;
    
    @Size(max = 50, message = "Reference type must not exceed 50 characters")
    private String referenceType;
}