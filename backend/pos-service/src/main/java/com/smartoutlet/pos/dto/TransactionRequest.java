package com.smartoutlet.pos.dto;

import com.smartoutlet.pos.entity.Transaction.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    
    @NotNull(message = "Outlet ID is required")
    private Long outletId;
    
    private String outletName;
    
    @NotNull(message = "Cashier ID is required")
    private Long cashierId;
    
    private String cashierName;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    
    @NotEmpty(message = "Transaction must have at least one item")
    @Valid
    private List<TransactionItemRequest> items;
    
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal discountPercentage = BigDecimal.ZERO;
    private PaymentMethod paymentMethod = PaymentMethod.CASH;
    private BigDecimal paidAmount = BigDecimal.ZERO;
    private String notes;
    
    @Valid
    private List<PaymentRequest> payments;
}