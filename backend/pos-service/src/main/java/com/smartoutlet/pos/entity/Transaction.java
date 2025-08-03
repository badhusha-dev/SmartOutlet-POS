package com.smartoutlet.pos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_number", nullable = false, unique = true, length = 50)
    private String transactionNumber;
    
    @Column(name = "outlet_id", nullable = false)
    private Long outletId;
    
    @Column(name = "outlet_name", length = 200)
    private String outletName;
    
    @Column(name = "cashier_id", nullable = false)
    private Long cashierId;
    
    @Column(name = "cashier_name", length = 200)
    private String cashierName;
    
    @Column(name = "customer_id")
    private Long customerId;
    
    @Column(name = "customer_name", length = 200)
    private String customerName;
    
    @Column(name = "customer_email", length = 200)
    private String customerEmail;
    
        @Column(name = "customer_phone", length = 50)
    private String customerPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;
    
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal taxAmount;
    
    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "amount_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;
    
    @Column(name = "change_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal changeAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TransactionStatus status = TransactionStatus.COMPLETED;
    
    @Column(name = "receipt_number", length = 50)
    private String receiptNumber;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @Column(name = "loyalty_points_earned")
    @Builder.Default
    private Integer loyaltyPointsEarned = 0;
    
    @Column(name = "loyalty_points_redeemed")
    @Builder.Default
    private Integer loyaltyPointsRedeemed = 0;
    
    @Column(name = "discount_code", length = 50)
    private String discountCode;
    
    @Column(name = "discount_percentage")
    private BigDecimal discountPercentage;
    
    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TransactionItem> items;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum TransactionType {
        SALE, RETURN, REFUND, EXCHANGE, VOID
    }
    
    public enum PaymentMethod {
        CASH, CREDIT_CARD, DEBIT_CARD, MOBILE_PAYMENT, GIFT_CARD, LOYALTY_POINTS
    }
    
    public enum TransactionStatus {
        PENDING, COMPLETED, CANCELLED, VOIDED, REFUNDED
    }
    
    // Additional methods for service compatibility
    public String getCustomer() {
        return this.customerName;
    }
    
    public String getProcessedBy() {
        return this.cashierName;
    }
    
    public LocalDateTime getTransactionDate() {
        return this.createdAt;
    }
} 