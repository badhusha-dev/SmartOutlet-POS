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
@Table(name = "vendor_materials", indexes = {
    @Index(name = "idx_vendor_id", columnList = "vendor_id"),
    @Index(name = "idx_raw_material_id", columnList = "raw_material_id"),
    @Index(name = "idx_is_preferred", columnList = "is_preferred")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorMaterial {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    private RawMaterial rawMaterial;
    
    @Column(name = "vendor_material_code", length = 100)
    private String vendorMaterialCode;
    
    @Column(name = "vendor_material_name", length = 200)
    private String vendorMaterialName;
    
    @Column(name = "unit_price", precision = 10, scale = 4)
    private BigDecimal unitPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "price_unit", length = 20)
    private UnitOfMeasure priceUnit;
    
    @Column(name = "minimum_order_quantity", precision = 10, scale = 3)
    private BigDecimal minimumOrderQuantity;
    
    @Column(name = "maximum_order_quantity", precision = 10, scale = 3)
    private BigDecimal maximumOrderQuantity;
    
    @Column(name = "lead_time_days")
    private Integer leadTimeDays;
    
    @Column(name = "is_preferred")
    @Builder.Default
    private Boolean isPreferred = false;
    
    @Column(name = "quality_rating", precision = 3, scale = 1)
    private BigDecimal qualityRating;
    
    @Column(name = "reliability_rating", precision = 3, scale = 1)
    private BigDecimal reliabilityRating;
    
    @Column(name = "last_order_date")
    private LocalDateTime lastOrderDate;
    
    @Column(name = "last_order_price", precision = 10, scale = 4)
    private BigDecimal lastOrderPrice;
    
    @Column(name = "average_price", precision = 10, scale = 4)
    private BigDecimal averagePrice;
    
    @Column(name = "total_orders")
    @Builder.Default
    private Integer totalOrders = 0;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Business logic methods
    public boolean canOrder(BigDecimal quantity) {
        if (!isActive || !vendor.isActive()) return false;
        
        if (minimumOrderQuantity != null && 
            quantity.compareTo(minimumOrderQuantity) < 0) {
            return false;
        }
        
        if (maximumOrderQuantity != null && 
            quantity.compareTo(maximumOrderQuantity) > 0) {
            return false;
        }
        
        return true;
    }
    
    public BigDecimal calculateTotalPrice(BigDecimal quantity) {
        if (unitPrice == null || quantity == null) {
            return BigDecimal.ZERO;
        }
        return unitPrice.multiply(quantity);
    }
    
    public BigDecimal getOverallRating() {
        if (qualityRating == null || reliabilityRating == null) {
            return null;
        }
        return qualityRating.add(reliabilityRating)
                .divide(BigDecimal.valueOf(2), 1, java.math.RoundingMode.HALF_UP);
    }
}