package com.smartoutlet.product.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    
    private Long id;
    private String name;
    private String description;
    private String sku;
    private String barcode;
    private BigDecimal price;
    private BigDecimal costPrice;
    private Integer stockQuantity;
    private Integer minStockLevel;
    private Integer maxStockLevel;
    private Long categoryId;
    private String categoryName;
    private String unitOfMeasure;
    private BigDecimal weight;
    private String dimensions;
    private String brand;
    private String supplier;
    private Boolean isActive;
    private Boolean isTaxable;
    private BigDecimal taxRate;
    private String imageUrl;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Calculated fields
    private Boolean isLowStock;
    private Boolean isOutOfStock;
    private BigDecimal profitMargin;
    private String stockStatus;
    
    public String getStockStatus() {
        if (stockQuantity == null || stockQuantity <= 0) {
            return "OUT_OF_STOCK";
        } else if (minStockLevel != null && stockQuantity <= minStockLevel) {
            return "LOW_STOCK";
        } else {
            return "IN_STOCK";
        }
    }
}