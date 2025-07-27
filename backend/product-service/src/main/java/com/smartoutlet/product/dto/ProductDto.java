package com.smartoutlet.product.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Product information")
public class ProductDto {
    
    @Schema(description = "Unique product identifier", example = "1")
    private Long id;
    
    @Schema(description = "Product name", example = "Premium Coffee Beans")
    private String name;
    
    @Schema(description = "Product description", example = "High-quality Arabica coffee beans sourced from Colombia")
    private String description;
    
    @Schema(description = "Stock Keeping Unit", example = "COFFEE-001")
    private String sku;
    
    @Schema(description = "Product barcode", example = "1234567890123")
    private String barcode;
    
    @Schema(description = "Selling price", example = "15.99")
    private BigDecimal price;
    
    @Schema(description = "Cost price", example = "10.50")
    private BigDecimal costPrice;
    
    @Schema(description = "Current stock quantity", example = "100")
    private Integer stockQuantity;
    
    @Schema(description = "Minimum stock level for reorder", example = "20")
    private Integer minStockLevel;
    
    @Schema(description = "Maximum stock level", example = "1000")
    private Integer maxStockLevel;
    
    @Schema(description = "Product category ID", example = "1")
    private Long categoryId;
    
    @Schema(description = "Product category name", example = "Beverages")
    private String categoryName;
    
    @Schema(description = "Unit of measure", example = "KG", allowableValues = {"PIECE", "KG", "GRAM", "LITER", "METER"})
    private String unitOfMeasure;
    
    @Schema(description = "Product status", example = "ACTIVE", allowableValues = {"ACTIVE", "INACTIVE", "DISCONTINUED"})
    private String status;
    
    @Schema(description = "Product image URL", example = "https://example.com/images/coffee-beans.jpg")
    private String imageUrl;
    
    @Schema(description = "Product weight in grams", example = "500")
    private Double weight;
    
    @Schema(description = "Product dimensions", example = "10x5x3 cm")
    private String dimensions;
    
    @Schema(description = "Brand name", example = "Colombian Coffee Co.")
    private String brand;
    
    @Schema(description = "Country of origin", example = "Colombia")
    private String origin;
    
    @Schema(description = "Expiry date", example = "2025-12-31")
    private LocalDateTime expiryDate;
    
    @Schema(description = "Creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2024-01-15T14:45:00")
    private LocalDateTime updatedAt;
} 