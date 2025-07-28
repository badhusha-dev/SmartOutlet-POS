package com.smartoutlet.product.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Stock movement information")
public class StockMovementDto {
    
    @Schema(description = "Unique movement identifier", example = "1")
    private Long id;
    
    @Schema(description = "Product ID", example = "1")
    private Long productId;
    
    @Schema(description = "Product name", example = "Premium Coffee Beans")
    private String productName;
    
    @Schema(description = "Movement type", example = "IN", allowableValues = {"IN", "OUT", "ADJUSTMENT", "TRANSFER"})
    private String movementType;
    
    @Schema(description = "Quantity moved", example = "50")
    private Integer quantity;
    
    @Schema(description = "Previous stock level", example = "100")
    private Integer previousStock;
    
    @Schema(description = "New stock level after movement", example = "150")
    private Integer newStock;
    
    @Schema(description = "Reason for movement", example = "Stock replenishment")
    private String reason;
    
    @Schema(description = "Reference ID (e.g., purchase order, sales order)", example = "PO-2024-001")
    private String referenceId;
    
    @Schema(description = "Reference type", example = "PURCHASE_ORDER", allowableValues = {"PURCHASE_ORDER", "SALES_ORDER", "ADJUSTMENT", "TRANSFER"})
    private String referenceType;
    
    @Schema(description = "Outlet ID where movement occurred", example = "1")
    private Long outletId;
    
    @Schema(description = "Outlet name", example = "Downtown Store")
    private String outletName;
    
    @Schema(description = "User ID who performed the movement", example = "1")
    private Long userId;
    
    @Schema(description = "User name", example = "John Doe")
    private String userName;
    
    @Schema(description = "Movement timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Additional notes", example = "Emergency stock replenishment due to high demand")
    private String notes;
    
    @Schema(description = "Unit cost at time of movement", example = "10.50")
    private Double unitCost;
    
    @Schema(description = "Total value of movement", example = "525.00")
    private Double totalValue;
} 