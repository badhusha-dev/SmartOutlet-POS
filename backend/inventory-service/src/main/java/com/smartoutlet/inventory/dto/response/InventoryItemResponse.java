package com.smartoutlet.inventory.dto.response;

import com.smartoutlet.inventory.entity.ExpiryStatus;
import com.smartoutlet.inventory.entity.InventoryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemResponse {
    
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Long outletId;
    private String outletName;
    private String batchNumber;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private BigDecimal unitCost;
    private BigDecimal totalValue;
    private LocalDate expiryDate;
    private LocalDate manufacturedDate;
    private LocalDate receivedDate;
    private String supplierReference;
    private String locationCode;
    private InventoryStatus status;
    private ExpiryStatus expiryStatus;
    private String expiryStatusColor;
    private Integer daysToExpiry;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Helper methods for frontend
    public String getExpiryStatusColor() {
        if (expiryStatus == null) return "#22c55e"; // green
        
        return switch (expiryStatus) {
            case FRESH -> "#22c55e";    // green
            case WARNING -> "#eab308";  // yellow
            case CRITICAL -> "#f97316"; // orange
            case EXPIRED -> "#ef4444";  // red
        };
    }
    
    public String getExpiryStatusIcon() {
        if (expiryStatus == null) return "🟢";
        
        return switch (expiryStatus) {
            case FRESH -> "🟢";
            case WARNING -> "🟡";
            case CRITICAL -> "🟠";
            case EXPIRED -> "🔴";
        };
    }
}