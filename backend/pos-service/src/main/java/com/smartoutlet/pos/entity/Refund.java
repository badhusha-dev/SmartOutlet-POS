package com.smartoutlet.pos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "refunds")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Refund {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "original_transaction_id", nullable = false)
    private Long originalTransactionId;
    
    @Column(name = "refund_amount", nullable = false)
    private Double refundAmount;
    
    @Column(name = "reason")
    private String reason;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private RefundStatus status = RefundStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "refund_method", nullable = false)
    private RefundMethod refundMethod;
    
    @Column(name = "processed_by", nullable = false)
    private String processedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;
    
    @OneToMany(mappedBy = "refund", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RefundItem> refundItems;
    
    @Column(name = "processed_at")
    @CreationTimestamp
    private LocalDateTime processedAt;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "receipt_reprinted")
    @Builder.Default
    private Boolean receiptReprinted = false;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum RefundStatus {
        PENDING, PROCESSED, DECLINED, CANCELLED
    }
    
    public enum RefundMethod {
        CASH, CREDIT_CARD, DEBIT_CARD, STORE_CREDIT
    }
} 