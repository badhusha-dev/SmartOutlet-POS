package com.smartoutlet.pos.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Sales transaction information")
public class TransactionDto {
    
    @Schema(description = "Unique transaction identifier", example = "1")
    private Long id;
    
    @Schema(description = "Transaction number", example = "TXN-2024-001")
    private String transactionNumber;
    
    @Schema(description = "Outlet ID where transaction occurred", example = "1")
    private Long outletId;
    
    @Schema(description = "Outlet name", example = "Downtown Coffee Shop")
    private String outletName;
    
    @Schema(description = "Cashier ID", example = "1")
    private Long cashierId;
    
    @Schema(description = "Cashier name", example = "John Doe")
    private String cashierName;
    
    @Schema(description = "Customer ID", example = "1")
    private Long customerId;
    
    @Schema(description = "Customer name", example = "Jane Smith")
    private String customerName;
    
    @Schema(description = "Customer email", example = "jane.smith@email.com")
    private String customerEmail;
    
    @Schema(description = "Customer phone", example = "+1-555-0123")
    private String customerPhone;
    
    @Schema(description = "Transaction type", example = "SALE", allowableValues = {"SALE", "RETURN", "REFUND", "EXCHANGE", "VOID"})
    private String transactionType;
    
    @Schema(description = "Payment method", example = "CREDIT_CARD", allowableValues = {"CASH", "CREDIT_CARD", "DEBIT_CARD", "MOBILE_PAYMENT", "GIFT_CARD", "LOYALTY_POINTS"})
    private String paymentMethod;
    
    @Schema(description = "Subtotal amount", example = "45.50")
    private BigDecimal subtotal;
    
    @Schema(description = "Tax amount", example = "3.64")
    private BigDecimal taxAmount;
    
    @Schema(description = "Discount amount", example = "5.00")
    private BigDecimal discountAmount;
    
    @Schema(description = "Total amount", example = "44.14")
    private BigDecimal totalAmount;
    
    @Schema(description = "Amount paid by customer", example = "50.00")
    private BigDecimal amountPaid;
    
    @Schema(description = "Change amount", example = "5.86")
    private BigDecimal changeAmount;
    
    @Schema(description = "Transaction status", example = "COMPLETED", allowableValues = {"PENDING", "COMPLETED", "CANCELLED", "VOIDED", "REFUNDED"})
    private String status;
    
    @Schema(description = "Receipt number", example = "RCP-2024-001")
    private String receiptNumber;
    
    @Schema(description = "Transaction notes", example = "Customer requested extra hot coffee")
    private String notes;
    
    @Schema(description = "Loyalty points earned", example = "44")
    private Integer loyaltyPointsEarned;
    
    @Schema(description = "Loyalty points redeemed", example = "0")
    private Integer loyaltyPointsRedeemed;
    
    @Schema(description = "Discount code used", example = "SAVE10")
    private String discountCode;
    
    @Schema(description = "Discount percentage", example = "10.00")
    private BigDecimal discountPercentage;
    
    @Schema(description = "List of transaction items")
    private List<TransactionItemDto> items;
    
    @Schema(description = "Transaction creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Transaction update timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime updatedAt;
} 