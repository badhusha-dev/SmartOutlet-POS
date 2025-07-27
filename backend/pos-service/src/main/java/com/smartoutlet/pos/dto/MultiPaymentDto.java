package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Schema(description = "Multi-payment information for split payments and multiple payment methods")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MultiPaymentDto extends BaseDto {
    
    @Schema(description = "Transaction ID", example = "123")
    private Long transactionId;
    
    @Schema(description = "Total transaction amount", example = "125.75")
    private Double totalAmount;
    
    @Schema(description = "Total amount paid", example = "125.75")
    private Double totalPaid;
    
    @Schema(description = "Remaining balance", example = "0.00")
    private Double remainingBalance;
    
    @Schema(description = "Payment status", example = "PAID", allowableValues = {"PENDING", "PARTIAL", "PAID", "OVERPAID"})
    private String paymentStatus;
    
    @Schema(description = "Individual payment methods used")
    private List<PaymentMethodDto> paymentMethods;
    
    @Schema(description = "Gift card information if used")
    private GiftCardDto giftCard;
    
    @Schema(description = "Loyalty points used", example = "100")
    private Integer loyaltyPointsUsed;
    
    @Schema(description = "Loyalty points value", example = "10.00")
    private Double loyaltyPointsValue;
    
    @Schema(description = "Change amount", example = "5.25")
    private Double changeAmount;
    
    @Schema(description = "Staff member who processed", example = "Jane Smith")
    private String processedBy;
    
    @Schema(description = "Additional notes", example = "Customer paid with multiple methods")
    private String notes;
} 