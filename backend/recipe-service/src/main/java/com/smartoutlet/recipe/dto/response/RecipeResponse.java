package com.smartoutlet.recipe.dto.response;

import com.smartoutlet.recipe.entity.RecipeStatus;
import com.smartoutlet.recipe.entity.UnitOfMeasure;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeResponse {
    
    private Long id;
    private Long productId;
    private String productName;
    private String recipeCode;
    private String name;
    private String description;
    private Integer version;
    private BigDecimal batchSize;
    private UnitOfMeasure batchUnit;
    private BigDecimal yieldPercentage;
    private Integer preparationTimeMinutes;
    private Integer cookingTimeMinutes;
    private Integer totalTimeMinutes;
    private Integer difficultyLevel;
    private BigDecimal servingSize;
    private UnitOfMeasure servingUnit;
    private String allergenInfo;
    private String nutritionalInfo;
    private String dietaryRestrictions;
    private String cookingInstructions;
    private String storageInstructions;
    private Integer shelfLifeHours;
    private String temperatureRequirement;
    private RecipeStatus status;
    private BigDecimal costPerBatch;
    private BigDecimal costPerServing;
    private BigDecimal laborCostPerBatch;
    private BigDecimal overheadCostPerBatch;
    private BigDecimal totalCostPerBatch;
    private String imageUrl;
    private String videoUrl;
    private String tags;
    private String notes;
    private List<RecipeIngredientResponse> ingredients;
    private List<RecipeStepResponse> steps;
    private UserSummary createdBy;
    private UserSummary approvedBy;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Calculated fields
    private BigDecimal materialCost;
    private BigDecimal costPerUnit;
    private String statusColor;
    private Boolean isActive;
    private Boolean isApproved;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecipeIngredientResponse {
        private Long id;
        private RawMaterialSummary rawMaterial;
        private BigDecimal quantity;
        private UnitOfMeasure unit;
        private Integer stepNumber;
        private String preparationMethod;
        private String notes;
        private Boolean isOptional;
        private String substituteIngredients;
        private BigDecimal unitCost;
        private BigDecimal totalCost;
        private BigDecimal wastagePercentage;
        private BigDecimal effectiveQuantity;
        private String allergenContribution;
        private String processingInstructions;
        private String qualityStandards;
        private BigDecimal costPercentageOfRecipe;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecipeStepResponse {
        private Long id;
        private Integer stepNumber;
        private String title;
        private String description;
        private Integer durationMinutes;
        private String temperature;
        private String equipment;
        private String tips;
        private String imageUrl;
        private Boolean isCritical;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RawMaterialSummary {
        private Long id;
        private String materialCode;
        private String name;
        private String category;
        private UnitOfMeasure unitOfMeasure;
        private BigDecimal baseUnitCost;
        private BigDecimal currentStock;
        private String imageUrl;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String username;
        private String firstName;
        private String lastName;
        private String email;
    }
    
    // Helper methods for frontend
    public String getStatusColor() {
        if (status == null) return "#6b7280"; // gray
        
        return switch (status) {
            case DRAFT -> "#6b7280";           // gray
            case PENDING_APPROVAL -> "#eab308"; // yellow
            case APPROVED -> "#22c55e";        // green
            case ACTIVE -> "#22c55e";          // green
            case INACTIVE -> "#f97316";        // orange
            case ARCHIVED -> "#64748b";        // slate
            case REJECTED -> "#ef4444";        // red
        };
    }
    
    public String getStatusLabel() {
        if (status == null) return "Unknown";
        
        return switch (status) {
            case DRAFT -> "Draft";
            case PENDING_APPROVAL -> "Pending Approval";
            case APPROVED -> "Approved";
            case ACTIVE -> "Active";
            case INACTIVE -> "Inactive";
            case ARCHIVED -> "Archived";
            case REJECTED -> "Rejected";
        };
    }
    
    public String getDifficultyLabel() {
        if (difficultyLevel == null) return "Unknown";
        
        return switch (difficultyLevel) {
            case 1 -> "Very Easy";
            case 2 -> "Easy";
            case 3 -> "Medium";
            case 4 -> "Hard";
            case 5 -> "Very Hard";
            default -> "Unknown";
        };
    }
    
    public String getBatchUnitSymbol() {
        return batchUnit != null ? batchUnit.getSymbol() : "";
    }
    
    public String getServingUnitSymbol() {
        return servingUnit != null ? servingUnit.getSymbol() : "";
    }
    
    public Integer getTotalIngredientsCount() {
        return ingredients != null ? ingredients.size() : 0;
    }
    
    public Integer getTotalStepsCount() {
        return steps != null ? steps.size() : 0;
    }
    
    public String getFormattedTotalTime() {
        if (totalTimeMinutes == null) return "N/A";
        
        int hours = totalTimeMinutes / 60;
        int minutes = totalTimeMinutes % 60;
        
        if (hours > 0) {
            return String.format("%dh %dm", hours, minutes);
        } else {
            return String.format("%dm", minutes);
        }
    }
}