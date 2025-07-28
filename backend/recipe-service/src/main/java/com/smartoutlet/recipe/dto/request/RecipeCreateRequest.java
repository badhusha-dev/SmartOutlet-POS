package com.smartoutlet.recipe.dto.request;

import com.smartoutlet.recipe.entity.UnitOfMeasure;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class RecipeCreateRequest {
    
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    @NotBlank(message = "Recipe code is required")
    @Size(max = 100, message = "Recipe code must not exceed 100 characters")
    private String recipeCode;
    
    @NotBlank(message = "Name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Batch size must be greater than 0")
    @Digits(integer = 8, fraction = 3, message = "Batch size must have at most 8 digits and 3 decimal places")
    private BigDecimal batchSize;
    
    private UnitOfMeasure batchUnit;
    
    @DecimalMin(value = "0.0", message = "Yield percentage must be non-negative")
    @DecimalMax(value = "100.0", message = "Yield percentage must not exceed 100")
    @Digits(integer = 3, fraction = 2, message = "Yield percentage must have at most 3 digits and 2 decimal places")
    private BigDecimal yieldPercentage;
    
    @Min(value = 0, message = "Preparation time must be non-negative")
    private Integer preparationTimeMinutes;
    
    @Min(value = 0, message = "Cooking time must be non-negative")
    private Integer cookingTimeMinutes;
    
    @Min(value = 1, message = "Difficulty level must be between 1 and 5")
    @Max(value = 5, message = "Difficulty level must be between 1 and 5")
    private Integer difficultyLevel;
    
    @DecimalMin(value = "0.0", message = "Serving size must be non-negative")
    @Digits(integer = 8, fraction = 3, message = "Serving size must have at most 8 digits and 3 decimal places")
    private BigDecimal servingSize;
    
    private UnitOfMeasure servingUnit;
    
    @Size(max = 1000, message = "Allergen info must not exceed 1000 characters")
    private String allergenInfo;
    
    @Size(max = 2000, message = "Nutritional info must not exceed 2000 characters")
    private String nutritionalInfo;
    
    @Size(max = 500, message = "Dietary restrictions must not exceed 500 characters")
    private String dietaryRestrictions;
    
    @Size(max = 5000, message = "Cooking instructions must not exceed 5000 characters")
    private String cookingInstructions;
    
    @Size(max = 1000, message = "Storage instructions must not exceed 1000 characters")
    private String storageInstructions;
    
    @Min(value = 1, message = "Shelf life must be at least 1 hour")
    private Integer shelfLifeHours;
    
    @Size(max = 100, message = "Temperature requirement must not exceed 100 characters")
    private String temperatureRequirement;
    
    @Digits(integer = 8, fraction = 4, message = "Labor cost must have at most 8 digits and 4 decimal places")
    private BigDecimal laborCostPerBatch;
    
    @Digits(integer = 8, fraction = 4, message = "Overhead cost must have at most 8 digits and 4 decimal places")
    private BigDecimal overheadCostPerBatch;
    
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;
    
    @Size(max = 500, message = "Video URL must not exceed 500 characters")
    private String videoUrl;
    
    @Size(max = 500, message = "Tags must not exceed 500 characters")
    private String tags;
    
    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;
    
    @Valid
    private List<RecipeIngredientRequest> ingredients;
    
    @Valid
    private List<RecipeStepRequest> steps;
    
    @Data
    public static class RecipeIngredientRequest {
        
        @NotNull(message = "Raw material ID is required")
        private Long rawMaterialId;
        
        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Quantity must be greater than 0")
        @Digits(integer = 8, fraction = 4, message = "Quantity must have at most 8 digits and 4 decimal places")
        private BigDecimal quantity;
        
        @NotNull(message = "Unit is required")
        private UnitOfMeasure unit;
        
        @Min(value = 1, message = "Step number must be at least 1")
        private Integer stepNumber;
        
        @Size(max = 500, message = "Preparation method must not exceed 500 characters")
        private String preparationMethod;
        
        @Size(max = 1000, message = "Notes must not exceed 1000 characters")
        private String notes;
        
        private Boolean isOptional;
        
        @Size(max = 500, message = "Substitute ingredients must not exceed 500 characters")
        private String substituteIngredients;
        
        @DecimalMin(value = "0.0", message = "Wastage percentage must be non-negative")
        @DecimalMax(value = "100.0", message = "Wastage percentage must not exceed 100")
        @Digits(integer = 3, fraction = 2, message = "Wastage percentage must have at most 3 digits and 2 decimal places")
        private BigDecimal wastagePercentage;
        
        @Size(max = 1000, message = "Processing instructions must not exceed 1000 characters")
        private String processingInstructions;
        
        @Size(max = 500, message = "Quality standards must not exceed 500 characters")
        private String qualityStandards;
    }
    
    @Data
    public static class RecipeStepRequest {
        
        @NotNull(message = "Step number is required")
        @Min(value = 1, message = "Step number must be at least 1")
        private Integer stepNumber;
        
        @NotBlank(message = "Step title is required")
        @Size(max = 200, message = "Step title must not exceed 200 characters")
        private String title;
        
        @NotBlank(message = "Step description is required")
        @Size(max = 2000, message = "Step description must not exceed 2000 characters")
        private String description;
        
        @Min(value = 0, message = "Duration must be non-negative")
        private Integer durationMinutes;
        
        @Size(max = 100, message = "Temperature must not exceed 100 characters")
        private String temperature;
        
        @Size(max = 500, message = "Equipment must not exceed 500 characters")
        private String equipment;
        
        @Size(max = 1000, message = "Tips must not exceed 1000 characters")
        private String tips;
        
        @Size(max = 500, message = "Image URL must not exceed 500 characters")
        private String imageUrl;
        
        private Boolean isCritical;
    }
}