package com.smartoutlet.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transactions", indexes = {
    @Index(name = "idx_inventory_item", columnList = "inventory_item_id"),
    @Index(name = "idx_transaction_type", columnList = "transaction_type"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_reference", columnList = "reference_type, reference_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "unit_cost", precision = 10, scale = 2)
    private BigDecimal unitCost;
    
    @Column(name = "previous_quantity")
    private Integer previousQuantity;
    
    @Column(name = "new_quantity")
    private Integer newQuantity;
    
    @Column(name = "reason", length = 500)
    private String reason;
    
    @Column(name = "reference_id", length = 100)
    private String referenceId;
    
    @Column(name = "reference_type", length = 50)
    private String referenceType;
    
    @Column(name = "source_outlet_id")
    private Long sourceOutletId;
    
    @Column(name = "destination_outlet_id")
    private Long destinationOutletId;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "user_name", length = 100)
    private String userName;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Helper method to check if this is a FIFO-relevant transaction
    public boolean isFifoRelevant() {
        return transactionType == TransactionType.SALE || 
               transactionType == TransactionType.ISSUE ||
               transactionType == TransactionType.TRANSFER_OUT;
    }
}