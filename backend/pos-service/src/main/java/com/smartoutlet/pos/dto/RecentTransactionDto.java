package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Schema(description = "Recent transaction information for POS dashboard")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RecentTransactionDto extends BaseDto {
    
    @Schema(description = "Transaction ID", example = "123")
    private Long transactionId;
    
    @Schema(description = "Transaction number", example = "TXN-2024-001")
    private String transactionNumber;
    
    @Schema(description = "Customer name", example = "John Doe")
    private String customerName;
    
    @Schema(description = "Total amount", example = "45.75")
    private Double totalAmount;
    
    @Schema(description = "Payment method", example = "CREDIT_CARD")
    private String paymentMethod;
    
    @Schema(description = "Transaction status", example = "COMPLETED")
    private String status;
    
    @Schema(description = "Staff member who processed", example = "Jane Smith")
    private String processedBy;
    
    @Schema(description = "Transaction time", example = "2024-01-20T14:30:00")
    private LocalDateTime transactionTime;
    
    @Schema(description = "Number of items", example = "3")
    private Integer itemCount;
    
    @Schema(description = "Quick summary of items", example = "2x Coffee, 1x Muffin")
    private String itemSummary;
} 