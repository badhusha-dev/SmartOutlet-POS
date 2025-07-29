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

@Entity
@Table(name = "recipe_ingredients", indexes = {
    @Index(name = "idx_recipe_id", columnList = "recipe_id"),
    @Index(name = "idx_raw_material_id", columnList = "raw_material_id"),
    @Index(name = "idx_step_number", columnList = "recipe_id, step_number")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeIngredient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    private RawMaterial rawMaterial;
    
    @Column(name = "quantity", nullable = false, precision = 10, scale = 4)
    private BigDecimal quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false, length = 20)
    private UnitOfMeasure unit;
    
    @Column(name = "step_number")
    @Builder.Default
    private Integer stepNumber = 1;
    
    @Column(name = "preparation_method", length = 500)
    private String preparationMethod;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @Column(name = "is_optional")
    @Builder.Default
    private Boolean isOptional = false;
    
    @Column(name = "substitute_ingredients", length = 500)
    private String substituteIngredients;
    
    @Column(name = "unit_cost", precision = 10, scale = 4)
    private BigDecimal unitCost;
    
    @Column(name = "total_cost", precision = 10, scale = 4)
    private BigDecimal totalCost;
    
    @Column(name = "wastage_percentage", precision = 5, scale = 2)
    private BigDecimal wastagePercentage;
    
    @Column(name = "effective_quantity", precision = 10, scale = 4)
    private BigDecimal effectiveQuantity;
    
    @Column(name = "allergen_contribution", length = 500)
    private String allergenContribution;
    
    @Column(name = "nutritional_contribution", length = 1000)
    private String nutritionalContribution;
    
    @Column(name = "processing_instructions", length = 1000)
    private String processingInstructions;
    
    @Column(name = "quality_standards", length = 500)
    private String qualityStandards;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Business logic methods
    public BigDecimal calculateTotalCost() {
        if (unitCost == null || quantity == null) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal baseCost = unitCost.multiply(quantity);
        
        // Apply wastage if specified
        if (wastagePercentage != null && wastagePercentage.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal wastageMultiplier = BigDecimal.ONE.add(
                wastagePercentage.divide(BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP)
            );
            baseCost = baseCost.multiply(wastageMultiplier);
        }
        
        return baseCost;
    }
    
    public BigDecimal getEffectiveQuantity() {
        if (effectiveQuantity != null) {
            return effectiveQuantity;
        }
        
        if (wastagePercentage != null && wastagePercentage.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal wastageMultiplier = BigDecimal.ONE.add(
                wastagePercentage.divide(BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP)
            );
            return quantity.multiply(wastageMultiplier);
        }
        
        return quantity;
    }
    
    public boolean isSubstitutable() {
        return substituteIngredients != null && !substituteIngredients.trim().isEmpty();
    }
    
    public BigDecimal getCostPercentageOfRecipe() {
        if (recipe == null || totalCost == null) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal recipeTotalCost = recipe.calculateMaterialCost();
        if (recipeTotalCost.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return totalCost.divide(recipeTotalCost, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
    
    // Update calculated fields
    @PrePersist
    @PreUpdate
    private void updateCalculatedFields() {
        this.totalCost = calculateTotalCost();
        this.effectiveQuantity = getEffectiveQuantity();
        
        // Copy unit cost from raw material if not specified
        if (this.unitCost == null && this.rawMaterial != null) {
            this.unitCost = this.rawMaterial.getAverageCost() != null ? 
                          this.rawMaterial.getAverageCost() : 
                          this.rawMaterial.getBaseUnitCost();
        }
        
        // Copy wastage percentage from raw material if not specified
        if (this.wastagePercentage == null && this.rawMaterial != null) {
            this.wastagePercentage = this.rawMaterial.getWastagePercentage();
        }
    }
}