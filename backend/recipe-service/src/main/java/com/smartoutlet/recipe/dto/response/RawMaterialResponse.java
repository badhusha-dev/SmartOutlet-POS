package com.smartoutlet.recipe.dto.response;

import com.smartoutlet.recipe.entity.MaterialStatus;
import com.smartoutlet.recipe.entity.UnitOfMeasure;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialResponse {
    
    private Long id;
    private String materialCode;
    private String name;
    private String description;
    private String category;
    private String subcategory;
    private UnitOfMeasure unitOfMeasure;
    private BigDecimal baseUnitCost;
    private BigDecimal currentStock;
    private BigDecimal minStockLevel;
    private BigDecimal maxStockLevel;
    private BigDecimal reorderPoint;
    private BigDecimal reorderQuantity;
    private Integer leadTimeDays;
    private Integer shelfLifeDays;
    private BigDecimal storageTemperatureMin;
    private BigDecimal storageTemperatureMax;
    private String storageConditions;
    private VendorSummary primaryVendor;
    private String allergenInfo;
    private String nutritionalInfo;
    private String originCountry;
    private String certifications;
    private BigDecimal wastagePercentage;
    private MaterialStatus status;
    private LocalDate lastPurchaseDate;
    private BigDecimal lastPurchaseCost;
    private BigDecimal averageCost;
    private String imageUrl;
    private String barcode;
    private String internalNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Calculated fields
    private BigDecimal stockValue;
    private Boolean isLowStock;
    private Boolean needsReorder;
    private Boolean isExpired;
    private Integer daysUntilReorderNeeded;
    private String stockStatusColor;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VendorSummary {
        private Long id;
        private String vendorCode;
        private String name;
        private String contactPerson;
        private String email;
        private String phone;
        private Integer leadTimeDays;
        private BigDecimal qualityRating;
        private BigDecimal overallRating;
    }
    
    // Helper methods for frontend
    public String getStockStatusColor() {
        if (Boolean.TRUE.equals(isExpired)) return "#ef4444"; // red
        if (Boolean.TRUE.equals(isLowStock)) return "#f97316"; // orange
        if (Boolean.TRUE.equals(needsReorder)) return "#eab308"; // yellow
        return "#22c55e"; // green
    }
    
    public String getStockStatusLabel() {
        if (Boolean.TRUE.equals(isExpired)) return "Expired";
        if (Boolean.TRUE.equals(isLowStock)) return "Low Stock";
        if (Boolean.TRUE.equals(needsReorder)) return "Reorder Needed";
        return "Adequate";
    }
    
    public String getUnitSymbol() {
        return unitOfMeasure != null ? unitOfMeasure.getSymbol() : "";
    }
    
    public String getUnitDisplayName() {
        return unitOfMeasure != null ? unitOfMeasure.getDisplayName() : "";
    }
}