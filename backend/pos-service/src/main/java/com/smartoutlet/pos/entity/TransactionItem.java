package com.smartoutlet.pos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;
    
    @NotNull(message = "Product ID is required")
    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "product_name", length = 200)
    private String productName;
    
    @Column(name = "product_sku", length = 50)
    private String productSku;
    
    @Column(name = "product_barcode", length = 100)
    private String productBarcode;
    
    @Column(name = "category_id")
    private Long categoryId;
    
    @Column(name = "category_name", length = 100)
    private String categoryName;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "quantity")
    private Integer quantity;
    
    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", message = "Unit price must be non-negative")
    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage = BigDecimal.ZERO;
    
    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate = BigDecimal.ZERO;
    
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @NotNull(message = "Total price is required")
    @DecimalMin(value = "0.0", message = "Total price must be non-negative")
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        
        // Calculate total price if not set
        if (totalPrice == null) {
            calculateTotalPrice();
        }
    }
    
    public void calculateTotalPrice() {
        if (unitPrice != null && quantity != null) {
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
            
            // Apply discount
            BigDecimal discountedAmount = subtotal;
            if (discountAmount != null && discountAmount.compareTo(BigDecimal.ZERO) > 0) {
                discountedAmount = subtotal.subtract(discountAmount);
            } else if (discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discount = subtotal.multiply(discountPercentage).divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
                discountedAmount = subtotal.subtract(discount);
                this.discountAmount = discount;
            }
            
            // Calculate tax
            if (taxRate != null && taxRate.compareTo(BigDecimal.ZERO) > 0) {
                this.taxAmount = discountedAmount.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
            }
            
            // Set total price
            this.totalPrice = discountedAmount.add(taxAmount != null ? taxAmount : BigDecimal.ZERO);
        }
    }
    
    public BigDecimal getSubtotal() {
        if (unitPrice != null && quantity != null) {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }
    
    public BigDecimal getProfitAmount() {
        if (totalPrice != null && costPrice != null && quantity != null) {
            BigDecimal totalCost = costPrice.multiply(BigDecimal.valueOf(quantity));
            return totalPrice.subtract(totalCost);
        }
        return BigDecimal.ZERO;
    }
}