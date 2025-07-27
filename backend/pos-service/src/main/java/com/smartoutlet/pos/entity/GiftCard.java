package com.smartoutlet.pos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "gift_cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GiftCard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "gift_card_number", unique = true, nullable = false)
    private String giftCardNumber;
    
    @Column(name = "holder_name")
    private String holderName;
    
    @Column(name = "original_value", nullable = false)
    private Double originalValue;
    
    @Column(name = "current_balance", nullable = false)
    private Double currentBalance;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private GiftCardStatus status = GiftCardStatus.ACTIVE;
    
    @Column(name = "issue_date", nullable = false)
    @CreationTimestamp
    private LocalDateTime issueDate;
    
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;
    
    @Column(name = "purchased_by")
    private String purchasedBy;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gift_card_type", nullable = false)
    @Builder.Default
    private GiftCardType giftCardType = GiftCardType.PHYSICAL;
    
    @Column(name = "security_code")
    private String securityCode;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum GiftCardStatus {
        ACTIVE, INACTIVE, EXPIRED, REDEEMED
    }
    
    public enum GiftCardType {
        PHYSICAL, DIGITAL, VIRTUAL
    }
    
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return status == GiftCardStatus.ACTIVE && 
               currentBalance > 0 &&
               (expiryDate == null || now.isBefore(expiryDate));
    }
    
    public boolean canUseAmount(Double amount) {
        return isValid() && currentBalance >= amount;
    }
    
    public void deductAmount(Double amount) {
        if (canUseAmount(amount)) {
            this.currentBalance -= amount;
            if (this.currentBalance <= 0) {
                this.status = GiftCardStatus.REDEEMED;
            }
        }
    }
} 