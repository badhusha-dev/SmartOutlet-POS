package com.smartoutlet.recipe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "raw_materials", indexes = {
    @Index(name = "idx_material_code", columnList = "material_code"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_vendor", columnList = "primary_vendor_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterial {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "material_code", nullable = false, unique = true, length = 100)
    private String materialCode;
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "category", nullable = false, length = 100)
    private String category;
    
    @Column(name = "subcategory", length = 100)
    private String subcategory;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "unit_of_measure", nullable = false, length = 20)
    private UnitOfMeasure unitOfMeasure;
    
    @Column(name = "base_unit_cost", precision = 10, scale = 4)
    private BigDecimal baseUnitCost;
    
    @Column(name = "current_stock", precision = 10, scale = 3)
    @Builder.Default
    private BigDecimal currentStock = BigDecimal.ZERO;
    
    @Column(name = "min_stock_level", precision = 10, scale = 3)
    private BigDecimal minStockLevel;
    
    @Column(name = "max_stock_level", precision = 10, scale = 3)
    private BigDecimal maxStockLevel;
    
    @Column(name = "reorder_point", precision = 10, scale = 3)
    private BigDecimal reorderPoint;
    
    @Column(name = "reorder_quantity", precision = 10, scale = 3)
    private BigDecimal reorderQuantity;
    
    @Column(name = "lead_time_days")
    @Builder.Default
    private Integer leadTimeDays = 7;
    
    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;
    
    @Column(name = "storage_temperature_min", precision = 5, scale = 2)
    private BigDecimal storageTemperatureMin;
    
    @Column(name = "storage_temperature_max", precision = 5, scale = 2)
    private BigDecimal storageTemperatureMax;
    
    @Column(name = "storage_conditions", length = 500)
    private String storageConditions;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_vendor_id")
    private Vendor primaryVendor;
    
    @Column(name = "allergen_info", length = 500)
    private String allergenInfo;
    
    @Column(name = "nutritional_info", length = 1000)
    private String nutritionalInfo;
    
    @Column(name = "origin_country", length = 100)
    private String originCountry;
    
    @Column(name = "certifications", length = 500)
    private String certifications;
    
    @Column(name = "wastage_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal wastagePercentage = BigDecimal.valueOf(5.0);
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private MaterialStatus status = MaterialStatus.ACTIVE;
    
    @Column(name = "last_purchase_date")
    private LocalDate lastPurchaseDate;
    
    @Column(name = "last_purchase_cost", precision = 10, scale = 4)
    private BigDecimal lastPurchaseCost;
    
    @Column(name = "average_cost", precision = 10, scale = 4)
    private BigDecimal averageCost;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "barcode", length = 100)
    private String barcode;
    
    @Column(name = "internal_notes", length = 1000)
    private String internalNotes;
    
    @OneToMany(mappedBy = "rawMaterial", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RecipeIngredient> recipeIngredients;
    
    @OneToMany(mappedBy = "rawMaterial", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MaterialTransaction> transactions;
    
    @OneToMany(mappedBy = "rawMaterial", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VendorMaterial> vendorMaterials;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Business logic methods
    public boolean isLowStock() {
        if (minStockLevel == null) return false;
        return currentStock.compareTo(minStockLevel) <= 0;
    }
    
    public boolean needsReorder() {
        if (reorderPoint == null) return false;
        return currentStock.compareTo(reorderPoint) <= 0;
    }
    
    public boolean isExpired(LocalDate currentDate) {
        if (shelfLifeDays == null || lastPurchaseDate == null) return false;
        LocalDate expiryDate = lastPurchaseDate.plusDays(shelfLifeDays);
        return currentDate.isAfter(expiryDate);
    }
    
    public BigDecimal getEffectiveQuantity(BigDecimal requestedQuantity) {
        if (wastagePercentage == null) return requestedQuantity;
        BigDecimal wastageMultiplier = BigDecimal.ONE.add(wastagePercentage.divide(BigDecimal.valueOf(100)));
        return requestedQuantity.multiply(wastageMultiplier);
    }
    
    public BigDecimal getStockValue() {
        if (currentStock == null || averageCost == null) return BigDecimal.ZERO;
        return currentStock.multiply(averageCost);
    }
    
    public int getDaysUntilReorderNeeded() {
        // Simple calculation based on current consumption trends
        // This would be enhanced with actual consumption data
        if (leadTimeDays == null) return 0;
        return leadTimeDays + 3; // Adding buffer days
    }
}