package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Schema(description = "Popular item information for POS dashboard")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PopularItemDto extends BaseDto {
    
    @Schema(description = "Product ID", example = "101")
    private Long productId;
    
    @Schema(description = "Product name", example = "Coffee Mug")
    private String productName;
    
    @Schema(description = "Product category", example = "Kitchenware")
    private String category;
    
    @Schema(description = "Quantity sold today", example = "25")
    private Integer quantitySold;
    
    @Schema(description = "Total revenue from this item today", example = "324.75")
    private Double totalRevenue;
    
    @Schema(description = "Unit price", example = "12.99")
    private Double unitPrice;
    
    @Schema(description = "Current stock level", example = "15")
    private Integer currentStock;
    
    @Schema(description = "Stock status", example = "IN_STOCK", allowableValues = {"IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"})
    private String stockStatus;
    
    @Schema(description = "Product image URL", example = "https://example.com/images/coffee-mug.jpg")
    private String imageUrl;
    
    @Schema(description = "Product SKU", example = "CM-001")
    private String sku;
} 