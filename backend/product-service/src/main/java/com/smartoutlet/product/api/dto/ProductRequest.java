package com.smartoutlet.product.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    
    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name cannot exceed 200 characters")
    private String name;
    
    private String description;
    
    @NotBlank(message = "SKU is required")
    @Size(max = 50, message = "SKU cannot exceed 50 characters")
    private String sku;
    
    private String barcode;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    private BigDecimal costPrice;
    
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity = 0;
    
    private Integer minStockLevel = 5;
    private Integer maxStockLevel = 1000;
    private Long categoryId;
    private String unitOfMeasure = "PIECE";
    private BigDecimal weight;
    private String dimensions;
    private String brand;
    private String supplier;
    private Boolean isActive = true;
    private Boolean isTaxable = true;
    private BigDecimal taxRate = BigDecimal.ZERO;
    private String imageUrl;
    private String tags;
    
    // Convenience method for getting category ID
    public Long getCategory() {
        return this.categoryId;
    }
}