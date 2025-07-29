package com.smartoutlet.pos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "refund_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "refund_id", nullable = false)
    private Refund refund;
    
    @Column(name = "original_item_id", nullable = false)
    private Long originalItemId;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "product_name", nullable = false)
    private String productName;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;
    
    @Column(name = "refund_amount", nullable = false)
    private Double refundAmount;
    
    @Column(name = "reason")
    private String reason;
    
    @Column(name = "is_returned")
    @Builder.Default
    private Boolean isReturned = false;
} 