package com.smartoutlet.recipe.dto.request;

import com.smartoutlet.recipe.entity.UnitOfMeasure;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RawMaterialCreateRequest {
    
    @NotBlank(message = "Material code is required")
    @Size(max = 100, message = "Material code must not exceed 100 characters")
    private String materialCode;
    
    @NotBlank(message = "Name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;
    
    @Size(max = 100, message = "Subcategory must not exceed 100 characters")
    private String subcategory;
    
    @NotNull(message = "Unit of measure is required")
    private UnitOfMeasure unitOfMeasure;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Base unit cost must be greater than 0")
    @Digits(integer = 8, fraction = 4, message = "Base unit cost must have at most 8 digits and 4 decimal places")
    private BigDecimal baseUnitCost;
    
    @DecimalMin(value = "0.0", message = "Minimum stock level must be non-negative")
    @Digits(integer = 8, fraction = 3, message = "Stock level must have at most 8 digits and 3 decimal places")
    private BigDecimal minStockLevel;
    
    @DecimalMin(value = "0.0", message = "Maximum stock level must be non-negative")
    @Digits(integer = 8, fraction = 3, message = "Stock level must have at most 8 digits and 3 decimal places")
    private BigDecimal maxStockLevel;
    
    @DecimalMin(value = "0.0", message = "Reorder point must be non-negative")
    @Digits(integer = 8, fraction = 3, message = "Reorder point must have at most 8 digits and 3 decimal places")
    private BigDecimal reorderPoint;
    
    @DecimalMin(value = "0.0", message = "Reorder quantity must be non-negative")
    @Digits(integer = 8, fraction = 3, message = "Reorder quantity must have at most 8 digits and 3 decimal places")
    private BigDecimal reorderQuantity;
    
    @Min(value = 1, message = "Lead time must be at least 1 day")
    private Integer leadTimeDays;
    
    @Min(value = 1, message = "Shelf life must be at least 1 day")
    private Integer shelfLifeDays;
    
    @Digits(integer = 3, fraction = 2, message = "Storage temperature must have at most 3 digits and 2 decimal places")
    private BigDecimal storageTemperatureMin;
    
    @Digits(integer = 3, fraction = 2, message = "Storage temperature must have at most 3 digits and 2 decimal places")
    private BigDecimal storageTemperatureMax;
    
    @Size(max = 500, message = "Storage conditions must not exceed 500 characters")
    private String storageConditions;
    
    private Long primaryVendorId;
    
    @Size(max = 500, message = "Allergen info must not exceed 500 characters")
    private String allergenInfo;
    
    @Size(max = 1000, message = "Nutritional info must not exceed 1000 characters")
    private String nutritionalInfo;
    
    @Size(max = 100, message = "Origin country must not exceed 100 characters")
    private String originCountry;
    
    @Size(max = 500, message = "Certifications must not exceed 500 characters")
    private String certifications;
    
    @DecimalMin(value = "0.0", message = "Wastage percentage must be non-negative")
    @DecimalMax(value = "100.0", message = "Wastage percentage must not exceed 100")
    @Digits(integer = 3, fraction = 2, message = "Wastage percentage must have at most 3 digits and 2 decimal places")
    private BigDecimal wastagePercentage;
    
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;
    
    @Size(max = 100, message = "Barcode must not exceed 100 characters")
    private String barcode;
    
    @Size(max = 1000, message = "Internal notes must not exceed 1000 characters")
    private String internalNotes;
}