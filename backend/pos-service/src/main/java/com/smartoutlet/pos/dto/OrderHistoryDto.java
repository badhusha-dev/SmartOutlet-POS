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

@Schema(description = "Order history information with filtering capabilities")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderHistoryDto extends BaseDto {
    
    @Schema(description = "Transaction ID", example = "123")
    private Long transactionId;
    
    @Schema(description = "Transaction number", example = "TXN-2024-001")
    private String transactionNumber;
    
    @Schema(description = "Customer ID", example = "456")
    private Long customerId;
    
    @Schema(description = "Customer name", example = "John Doe")
    private String customerName;
    
    @Schema(description = "Customer email", example = "john.doe@example.com")
    private String customerEmail;
    
    @Schema(description = "Total transaction amount", example = "125.75")
    private Double totalAmount;
    
    @Schema(description = "Transaction status", example = "COMPLETED", allowableValues = {"PENDING", "COMPLETED", "CANCELLED", "REFUNDED"})
    private String status;
    
    @Schema(description = "Payment method", example = "CREDIT_CARD", allowableValues = {"CASH", "CREDIT_CARD", "DEBIT_CARD", "MOBILE_PAYMENT"})
    private String paymentMethod;
    
    @Schema(description = "Staff member who processed the transaction", example = "Jane Smith")
    private String processedBy;
    
    @Schema(description = "Outlet ID", example = "1")
    private Long outletId;
    
    @Schema(description = "Outlet name", example = "Downtown Store")
    private String outletName;
    
    @Schema(description = "Transaction date and time", example = "2024-01-20T14:30:00")
    private LocalDateTime transactionDate;
    
    @Schema(description = "Items in the transaction")
    private List<TransactionItemDto> items;
    
    @Schema(description = "Discount applied", example = "10.0")
    private Double discountAmount;
    
    @Schema(description = "Tax amount", example = "12.58")
    private Double taxAmount;
    
    @Schema(description = "Receipt number", example = "RCPT-2024-001")
    private String receiptNumber;
    
    @Schema(description = "Whether receipt was reprinted", example = "false")
    private Boolean receiptReprinted;
    
    @Schema(description = "Additional notes", example = "Customer requested extra hot coffee")
    private String notes;
} 