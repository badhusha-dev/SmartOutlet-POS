package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Refund information for POS transactions")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RefundDto extends BaseDto {
    
    @Schema(description = "Original transaction ID", example = "123")
    private Long originalTransactionId;
    
    @Schema(description = "Refund amount", example = "25.50")
    private Double refundAmount;
    
    @Schema(description = "Reason for refund", example = "Customer returned item")
    private String reason;
    
    @Schema(description = "Refund status", example = "PROCESSED", allowableValues = {"PENDING", "PROCESSED", "DECLINED", "CANCELLED"})
    private String status;
    
    @Schema(description = "Refund method", example = "CASH", allowableValues = {"CASH", "CREDIT_CARD", "DEBIT_CARD", "STORE_CREDIT"})
    private String refundMethod;
    
    @Schema(description = "Staff member who processed the refund", example = "John Smith")
    private String processedBy;
    
    @Schema(description = "Customer ID", example = "456")
    private Long customerId;
    
    @Schema(description = "Customer name", example = "Jane Doe")
    private String customerName;
    
    @Schema(description = "Items being refunded")
    private List<RefundItemDto> refundItems;
    
    @Schema(description = "Date when refund was processed", example = "2024-01-20T14:30:00")
    private LocalDateTime processedAt;
    
    @Schema(description = "Additional notes", example = "Item was damaged during delivery")
    private String notes;
    
    @Schema(description = "Whether receipt was reprinted", example = "true")
    private Boolean receiptReprinted;
} 