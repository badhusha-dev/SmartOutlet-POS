package com.smartoutlet.product.api.dto;

import com.smartoutlet.product.entity.MovementType;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockUpdateRequest {
    
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    @NotNull(message = "Movement type is required")
    private MovementType movementType;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    private String reason;
    private String referenceId;
    private String referenceType;
    private Long outletId;
    private Long userId;
    
    // Convenience method for getting new stock quantity
    public Integer getNewStockQuantity() {
        return this.quantity;
    }
}