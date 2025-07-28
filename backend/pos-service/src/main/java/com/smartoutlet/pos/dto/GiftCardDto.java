package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Schema(description = "Gift card information for POS transactions")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GiftCardDto extends BaseDto {
    
    @Schema(description = "Gift card number", example = "GC-123456789")
    private String giftCardNumber;
    
    @Schema(description = "Gift card holder name", example = "John Doe")
    private String holderName;
    
    @Schema(description = "Original gift card value", example = "100.00")
    private Double originalValue;
    
    @Schema(description = "Current balance", example = "75.50")
    private Double currentBalance;
    
    @Schema(description = "Amount used in transaction", example = "24.50")
    private Double amountUsed;
    
    @Schema(description = "Gift card status", example = "ACTIVE", allowableValues = {"ACTIVE", "INACTIVE", "EXPIRED", "REDEEMED"})
    private String status;
    
    @Schema(description = "Issue date", example = "2024-01-01T00:00:00")
    private LocalDateTime issueDate;
    
    @Schema(description = "Expiry date", example = "2025-01-01T23:59:59")
    private LocalDateTime expiryDate;
    
    @Schema(description = "Purchased by", example = "Jane Smith")
    private String purchasedBy;
    
    @Schema(description = "Gift card type", example = "PHYSICAL", allowableValues = {"PHYSICAL", "DIGITAL", "VIRTUAL"})
    private String giftCardType;
    
    @Schema(description = "Security code", example = "123")
    private String securityCode;
    
    @Schema(description = "Whether gift card is valid", example = "true")
    private Boolean isValid;
    
    @Schema(description = "Validation message", example = "Gift card is valid")
    private String validationMessage;
} 