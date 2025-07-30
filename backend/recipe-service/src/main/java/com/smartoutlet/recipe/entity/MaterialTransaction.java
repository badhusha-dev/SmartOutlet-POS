package com.smartoutlet.recipe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_transactions", indexes = {
    @Index(name = "idx_raw_material", columnList = "raw_material_id"),
    @Index(name = "idx_transaction_date", columnList = "transaction_date"),
    @Index(name = "idx_transaction_type", columnList = "transaction_type")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    private RawMaterial rawMaterial;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;
    
    @Column(name = "quantity", precision = 10, scale = 3, nullable = false)
    private BigDecimal quantity;
    
    @Column(name = "unit_cost", precision = 10, scale = 2)
    private BigDecimal unitCost;
    
    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;
    
    @Column(name = "reference_number", length = 100)
    private String referenceNumber;
    
    @Column(name = "notes", length = 500)
    private String notes;
    
    @CreationTimestamp
    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;
    
    @Column(name = "created_by", length = 100)
    private String createdBy;
    
    public enum TransactionType {
        PURCHASE_IN,
        USAGE_OUT,
        ADJUSTMENT_IN,
        ADJUSTMENT_OUT,
        WASTE_OUT,
        TRANSFER_IN,
        TRANSFER_OUT
    }
}