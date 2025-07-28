package com.smartoutlet.recipe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "recipes", indexes = {
    @Index(name = "idx_product_id", columnList = "product_id"),
    @Index(name = "idx_recipe_code", columnList = "recipe_code"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_version", columnList = "product_id, version")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "recipe_code", nullable = false, unique = true, length = 100)
    private String recipeCode;
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "version", nullable = false)
    @Builder.Default
    private Integer version = 1;
    
    @Column(name = "batch_size", precision = 10, scale = 3)
    private BigDecimal batchSize;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "batch_unit", length = 20)
    private UnitOfMeasure batchUnit;
    
    @Column(name = "yield_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal yieldPercentage = BigDecimal.valueOf(100.0);
    
    @Column(name = "preparation_time_minutes")
    private Integer preparationTimeMinutes;
    
    @Column(name = "cooking_time_minutes")
    private Integer cookingTimeMinutes;
    
    @Column(name = "total_time_minutes")
    private Integer totalTimeMinutes;
    
    @Column(name = "difficulty_level")
    @Builder.Default
    private Integer difficultyLevel = 1; // 1-5 scale
    
    @Column(name = "serving_size", precision = 10, scale = 3)
    private BigDecimal servingSize;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "serving_unit", length = 20)
    private UnitOfMeasure servingUnit;
    
    @Column(name = "allergen_info", length = 1000)
    private String allergenInfo;
    
    @Column(name = "nutritional_info", length = 2000)
    private String nutritionalInfo;
    
    @Column(name = "dietary_restrictions", length = 500)
    private String dietaryRestrictions;
    
    @Column(name = "cooking_instructions", length = 5000)
    private String cookingInstructions;
    
    @Column(name = "storage_instructions", length = 1000)
    private String storageInstructions;
    
    @Column(name = "shelf_life_hours")
    private Integer shelfLifeHours;
    
    @Column(name = "temperature_requirement", length = 100)
    private String temperatureRequirement;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private RecipeStatus status = RecipeStatus.DRAFT;
    
    @Column(name = "cost_per_batch", precision = 10, scale = 4)
    private BigDecimal costPerBatch;
    
    @Column(name = "cost_per_serving", precision = 10, scale = 4)
    private BigDecimal costPerServing;
    
    @Column(name = "labor_cost_per_batch", precision = 10, scale = 4)
    private BigDecimal laborCostPerBatch;
    
    @Column(name = "overhead_cost_per_batch", precision = 10, scale = 4)
    private BigDecimal overheadCostPerBatch;
    
    @Column(name = "total_cost_per_batch", precision = 10, scale = 4)
    private BigDecimal totalCostPerBatch;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "approved_by")
    private Long approvedBy;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "video_url", length = 500)
    private String videoUrl;
    
    @Column(name = "tags", length = 500)
    private String tags;
    
    @Column(name = "notes", length = 2000)
    private String notes;
    
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RecipeIngredient> ingredients;
    
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RecipeStep> steps;
    
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductionBatch> productionBatches;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Business logic methods
    public BigDecimal calculateMaterialCost() {
        if (ingredients == null || ingredients.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        return ingredients.stream()
                .map(RecipeIngredient::getTotalCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public BigDecimal calculateTotalCost() {
        BigDecimal materialCost = calculateMaterialCost();
        BigDecimal labor = laborCostPerBatch != null ? laborCostPerBatch : BigDecimal.ZERO;
        BigDecimal overhead = overheadCostPerBatch != null ? overheadCostPerBatch : BigDecimal.ZERO;
        
        return materialCost.add(labor).add(overhead);
    }
    
    public BigDecimal getCostPerUnit() {
        if (batchSize == null || batchSize.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return calculateTotalCost().divide(batchSize, 4, java.math.RoundingMode.HALF_UP);
    }
    
    public boolean isActive() {
        return status == RecipeStatus.ACTIVE;
    }
    
    public boolean isApproved() {
        return status == RecipeStatus.ACTIVE || status == RecipeStatus.APPROVED;
    }
    
    public int getTotalTimeRequired() {
        int prep = preparationTimeMinutes != null ? preparationTimeMinutes : 0;
        int cook = cookingTimeMinutes != null ? cookingTimeMinutes : 0;
        return prep + cook;
    }
    
    public BigDecimal getEffectiveYield() {
        if (yieldPercentage == null) return BigDecimal.valueOf(100);
        return yieldPercentage.divide(BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP);
    }
}