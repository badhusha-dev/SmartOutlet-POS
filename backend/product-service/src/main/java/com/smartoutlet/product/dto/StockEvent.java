package com.smartoutlet.product.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockEvent {
    
    private String eventId;
    private String eventType; // LOW_STOCK, OUT_OF_STOCK, STOCK_UPDATED
    private Long productId;
    private String productName;
    private String sku;
    private Integer currentStock;
    private Integer minStockLevel;
    private Integer previousStock;
    private String movementType;
    private Integer quantity;
    private BigDecimal price;
    private Long categoryId;
    private String categoryName;
    private String reason;
    private LocalDateTime eventTimestamp;
    private String source = "product-service";
    
    public StockEvent(String eventType, Long productId, String productName, String sku,
                     Integer currentStock, Integer minStockLevel, Integer previousStock) {
        this.eventId = java.util.UUID.randomUUID().toString();
        this.eventType = eventType;
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.currentStock = currentStock;
        this.minStockLevel = minStockLevel;
        this.previousStock = previousStock;
        this.eventTimestamp = LocalDateTime.now();
    }
}