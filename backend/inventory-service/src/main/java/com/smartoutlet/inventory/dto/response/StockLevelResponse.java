package com.smartoutlet.inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockLevelResponse {
    
    private Long productId;
    private String productName;
    private String productSku;
    private String category;
    private Long outletId;
    private String outletName;
    private Integer totalQuantity;
    private Integer availableQuantity;
    private Integer reservedQuantity;
    private Integer minStockLevel;
    private Integer maxStockLevel;
    private BigDecimal averageUnitCost;
    private BigDecimal totalValue;
    private Integer batchCount;
    private Boolean isLowStock;
    private Boolean isOutOfStock;
    private Boolean hasExpiringItems;
    private Integer expiringItemsCount;
    private Integer expiredItemsCount;
    private String stockStatus;
    private String stockStatusColor;
    private List<InventoryItemResponse> batches;
    
    // Helper methods
    public String getStockStatus() {
        if (isOutOfStock != null && isOutOfStock) {
            return "OUT_OF_STOCK";
        } else if (isLowStock != null && isLowStock) {
            return "LOW_STOCK";
        } else if (hasExpiringItems != null && hasExpiringItems) {
            return "EXPIRING_ITEMS";
        } else {
            return "ADEQUATE";
        }
    }
    
    public String getStockStatusColor() {
        String status = getStockStatus();
        return switch (status) {
            case "OUT_OF_STOCK" -> "#ef4444";     // red
            case "LOW_STOCK" -> "#f97316";        // orange
            case "EXPIRING_ITEMS" -> "#eab308";   // yellow
            case "ADEQUATE" -> "#22c55e";         // green
            default -> "#6b7280";                 // gray
        };
    }
    
    public Double getStockLevel() {
        if (maxStockLevel == null || maxStockLevel == 0) {
            return 0.0;
        }
        return (double) (availableQuantity != null ? availableQuantity : 0) / maxStockLevel * 100;
    }
}