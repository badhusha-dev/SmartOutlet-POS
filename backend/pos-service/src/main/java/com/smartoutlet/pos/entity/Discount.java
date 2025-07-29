package com.smartoutlet.pos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "discounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Discount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "discount_code", unique = true, nullable = false)
    private String discountCode;
    
    @Column(name = "discount_name", nullable = false)
    private String discountName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;
    
    @Column(name = "discount_value", nullable = false)
    private Double discountValue;
    
    @Column(name = "minimum_purchase")
    private Double minimumPurchase;
    
    @Column(name = "maximum_discount")
    private Double maximumDiscount;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "valid_from")
    private LocalDateTime validFrom;
    
    @Column(name = "valid_to")
    private LocalDateTime validTo;
    
    @Column(name = "max_uses")
    private Integer maxUses;
    
    @Column(name = "current_uses")
    @Builder.Default
    private Integer currentUses = 0;
    
    @Column(name = "applies_to_all_products")
    @Builder.Default
    private Boolean appliesToAllProducts = true;
    
    @Column(name = "applicable_product_ids")
    private String applicableProductIds;
    
    @Column(name = "applicable_category_ids")
    private String applicableCategoryIds;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum DiscountType {
        PERCENTAGE, FIXED_AMOUNT, BUY_ONE_GET_ONE, FREE_SHIPPING
    }
    
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return isActive && 
               (validFrom == null || now.isAfter(validFrom)) &&
               (validTo == null || now.isBefore(validTo)) &&
               (maxUses == null || currentUses < maxUses);
    }
    
    public void incrementUsage() {
        this.currentUses++;
    }
} 