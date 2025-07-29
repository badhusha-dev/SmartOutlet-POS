package com.smartoutlet.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "sku", nullable = false, unique = true, length = 50)
    private String sku;
    
    @Column(name = "barcode", length = 100)
    private String barcode;
    
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;
    
    @Column(name = "min_stock_level")
    @Builder.Default
    private Integer minStockLevel = 5;
    
    @Column(name = "max_stock_level")
    @Builder.Default
    private Integer maxStockLevel = 1000;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Column(name = "unit_of_measure", length = 20)
    @Builder.Default
    private String unitOfMeasure = "PIECE";
    
    @Column(name = "weight", precision = 8, scale = 3)
    private BigDecimal weight;
    
    @Column(name = "dimensions", length = 100)
    private String dimensions;
    
    @Column(name = "brand", length = 100)
    private String brand;
    
    @Column(name = "supplier", length = 100)
    private String supplier;
    
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "is_taxable")
    @Builder.Default
    private Boolean isTaxable = true;
    
    @Column(name = "tax_rate", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal taxRate = BigDecimal.ZERO;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "tags", length = 500)
    private String tags;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StockMovement> stockMovements;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Business logic methods
    public boolean isOutOfStock() {
        return this.stockQuantity <= 0;
    }
    
    public boolean isLowStock() {
        return this.stockQuantity <= this.minStockLevel;
    }
    
    public BigDecimal getProfitMargin() {
        if (this.costPrice == null || this.costPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return this.price.subtract(this.costPrice).divide(this.costPrice, 4, RoundingMode.HALF_UP);
    }
    
    public BigDecimal getTotalValue() {
        return this.price.multiply(BigDecimal.valueOf(this.stockQuantity));
    }
} 