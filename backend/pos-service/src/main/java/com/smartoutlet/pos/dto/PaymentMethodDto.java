package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Schema(description = "Individual payment method information for multi-payment transactions")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PaymentMethodDto extends BaseDto {
    
    @Schema(description = "Payment method type", example = "CASH", allowableValues = {"CASH", "CREDIT_CARD", "DEBIT_CARD", "MOBILE_PAYMENT", "GIFT_CARD", "LOYALTY_POINTS", "STORE_CREDIT"})
    private String paymentMethod;
    
    @Schema(description = "Amount paid with this method", example = "50.00")
    private Double amount;
    
    @Schema(description = "Card type (if applicable)", example = "VISA")
    private String cardType;
    
    @Schema(description = "Last 4 digits of card (if applicable)", example = "1234")
    private String cardLastFour;
    
    @Schema(description = "Transaction reference", example = "TXN-REF-123456")
    private String transactionReference;
    
    @Schema(description = "Payment status", example = "APPROVED", allowableValues = {"PENDING", "APPROVED", "DECLINED", "FAILED"})
    private String status;
    
    @Schema(description = "Authorization code", example = "AUTH123456")
    private String authorizationCode;
    
    @Schema(description = "Gift card number (if applicable)", example = "GC-123456789")
    private String giftCardNumber;
    
    @Schema(description = "Loyalty points used (if applicable)", example = "100")
    private Integer loyaltyPoints;
    
    @Schema(description = "Store credit amount (if applicable)", example = "25.00")
    private Double storeCreditAmount;
    
    @Schema(description = "Additional payment details", example = "Contactless payment")
    private String notes;
} 