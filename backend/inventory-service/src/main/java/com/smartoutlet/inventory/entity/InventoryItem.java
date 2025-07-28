package com.smartoutlet.inventory.entity;

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
@Table(name = "inventory_items", indexes = {
    @Index(name = "idx_product_outlet", columnList = "product_id, outlet_id"),
    @Index(name = "idx_expiry_date", columnList = "expiry_date"),
    @Index(name = "idx_batch_number", columnList = "batch_number")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "outlet_id", nullable = false)
    private Long outletId;
    
    @Column(name = "batch_number", nullable = false, length = 100)
    private String batchNumber;
    
    @Column(name = "quantity", nullable = false)
    @Builder.Default
    private Integer quantity = 0;
    
    @Column(name = "reserved_quantity")
    @Builder.Default
    private Integer reservedQuantity = 0;
    
    @Column(name = "unit_cost", precision = 10, scale = 2)
    private BigDecimal unitCost;
    
    @Column(name = "expiry_date")
    private LocalDate expiryDate;
    
    @Column(name = "manufactured_date")
    private LocalDate manufacturedDate;
    
    @Column(name = "received_date", nullable = false)
    private LocalDate receivedDate;
    
    @Column(name = "supplier_reference", length = 100)
    private String supplierReference;
    
    @Column(name = "location_code", length = 50)
    private String locationCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private InventoryStatus status = InventoryStatus.AVAILABLE;
    
    @OneToMany(mappedBy = "inventoryItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StockTransaction> stockTransactions;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Business logic methods
    public Integer getAvailableQuantity() {
        return quantity - (reservedQuantity != null ? reservedQuantity : 0);
    }
    
    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }
    
    public boolean isNearExpiry(int warningDays) {
        if (expiryDate == null) return false;
        LocalDate warningDate = LocalDate.now().plusDays(warningDays);
        return expiryDate.isBefore(warningDate) || expiryDate.isEqual(warningDate);
    }
    
    public boolean isCriticalExpiry(int criticalDays) {
        if (expiryDate == null) return false;
        LocalDate criticalDate = LocalDate.now().plusDays(criticalDays);
        return expiryDate.isBefore(criticalDate) || expiryDate.isEqual(criticalDate);
    }
    
    public ExpiryStatus getExpiryStatus(int warningDays, int criticalDays) {
        if (isExpired()) return ExpiryStatus.EXPIRED;
        if (isCriticalExpiry(criticalDays)) return ExpiryStatus.CRITICAL;
        if (isNearExpiry(warningDays)) return ExpiryStatus.WARNING;
        return ExpiryStatus.FRESH;
    }
    
    public boolean canReduceQuantity(int requestedQuantity) {
        return getAvailableQuantity() >= requestedQuantity;
    }
    
    public void reduceQuantity(int amount) {
        if (!canReduceQuantity(amount)) {
            throw new IllegalArgumentException("Insufficient available quantity");
        }
        this.quantity -= amount;
    }
    
    public void addQuantity(int amount) {
        this.quantity += amount;
    }
    
    public void reserveQuantity(int amount) {
        if (!canReduceQuantity(amount)) {
            throw new IllegalArgumentException("Insufficient available quantity for reservation");
        }
        this.reservedQuantity = (this.reservedQuantity != null ? this.reservedQuantity : 0) + amount;
    }
    
    public void releaseReservedQuantity(int amount) {
        if (this.reservedQuantity == null || this.reservedQuantity < amount) {
            throw new IllegalArgumentException("Cannot release more than reserved quantity");
        }
        this.reservedQuantity -= amount;
    }
}