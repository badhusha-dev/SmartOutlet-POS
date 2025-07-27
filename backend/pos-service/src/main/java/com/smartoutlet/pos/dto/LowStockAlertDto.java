package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Schema(description = "Low stock alert information for POS dashboard")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LowStockAlertDto extends BaseDto {
    
    @Schema(description = "Product ID", example = "101")
    private Long productId;
    
    @Schema(description = "Product name", example = "Coffee Mug")
    private String productName;
    
    @Schema(description = "Product SKU", example = "CM-001")
    private String sku;
    
    @Schema(description = "Current stock level", example = "5")
    private Integer currentStock;
    
    @Schema(description = "Minimum stock threshold", example = "10")
    private Integer minimumStock;
    
    @Schema(description = "Stock status", example = "LOW_STOCK", allowableValues = {"LOW_STOCK", "CRITICAL", "OUT_OF_STOCK"})
    private String stockStatus;
    
    @Schema(description = "Category", example = "Kitchenware")
    private String category;
    
    @Schema(description = "Supplier name", example = "ABC Supplies")
    private String supplier;
    
    @Schema(description = "Days until out of stock (estimated)", example = "3")
    private Integer daysUntilOutOfStock;
    
    @Schema(description = "Last restock date", example = "2024-01-15")
    private String lastRestockDate;
    
    @Schema(description = "Recommended reorder quantity", example = "50")
    private Integer recommendedReorderQuantity;
} 