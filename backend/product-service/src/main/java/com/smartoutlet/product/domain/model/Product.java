package com.smartoutlet.product.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name cannot exceed 200 characters")
    @Column(name = "name", length = 200)
    private String name;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @NotBlank(message = "SKU is required")
    @Size(max = 50, message = "SKU cannot exceed 50 characters")
    @Column(name = "sku", unique = true, length = 50)
    private String sku;
    
    @Column(name = "barcode", length = 100)
    private String barcode;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    @Column(name = "min_stock_level")
    private Integer minStockLevel = 5;
    
    @Column(name = "max_stock_level")
    private Integer maxStockLevel = 1000;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Column(name = "unit_of_measure", length = 20)
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
    private Boolean isActive = true;
    
    @Column(name = "is_taxable")
    private Boolean isTaxable = true;
    
    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate = BigDecimal.ZERO;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "tags", length = 500)
    private String tags;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StockMovement> stockMovements;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public boolean isLowStock() {
        return stockQuantity != null && minStockLevel != null && stockQuantity <= minStockLevel;
    }
    
    public boolean isOutOfStock() {
        return stockQuantity == null || stockQuantity <= 0;
    }
    
    public BigDecimal getProfitMargin() {
        if (price != null && costPrice != null && costPrice.compareTo(BigDecimal.ZERO) > 0) {
            return price.subtract(costPrice).divide(costPrice, 4, BigDecimal.ROUND_HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }
}