package com.smartoutlet.product.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @NotNull(message = "Movement type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", length = 20)
    private MovementType movementType;
    
    @NotNull(message = "Quantity is required")
    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "previous_stock")
    private Integer previousStock;
    
    @Column(name = "new_stock")
    private Integer newStock;
    
    @Column(name = "reason", length = 200)
    private String reason;
    
    @Column(name = "reference_id")
    private String referenceId; // Transaction ID, Purchase Order ID, etc.
    
    @Column(name = "reference_type", length = 50)
    private String referenceType; // SALE, PURCHASE, ADJUSTMENT, DAMAGE, etc.
    
    @Column(name = "outlet_id")
    private Long outletId;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum MovementType {
        IN,      // Stock increase (purchase, return, adjustment)
        OUT,     // Stock decrease (sale, damage, adjustment)
        TRANSFER // Stock transfer between outlets
    }
    
    public StockMovement(Product product, MovementType movementType, Integer quantity, 
                        Integer previousStock, Integer newStock, String reason, String referenceType) {
        this.product = product;
        this.movementType = movementType;
        this.quantity = quantity;
        this.previousStock = previousStock;
        this.newStock = newStock;
        this.reason = reason;
        this.referenceType = referenceType;
    }
}