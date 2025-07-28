package com.smartoutlet.expense.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Expense information")
public class ExpenseDto {
    
    @Schema(description = "Unique expense identifier", example = "1")
    private Long id;
    
    @Schema(description = "Expense description", example = "Office supplies purchase")
    private String description;
    
    @Schema(description = "Expense amount", example = "125.50")
    private BigDecimal amount;
    
    @Schema(description = "Expense category ID", example = "1")
    private Long categoryId;
    
    @Schema(description = "Expense category name", example = "Office Supplies")
    private String categoryName;
    
    @Schema(description = "Budget ID", example = "1")
    private Long budgetId;
    
    @Schema(description = "Budget name", example = "Monthly Operations Budget")
    private String budgetName;
    
    @Schema(description = "Outlet ID where expense occurred", example = "1")
    private Long outletId;
    
    @Schema(description = "Outlet name", example = "Downtown Coffee Shop")
    private String outletName;
    
    @Schema(description = "Expense date", example = "2024-01-15")
    private LocalDate expenseDate;
    
    @Schema(description = "Payment method", example = "CREDIT_CARD", allowableValues = {"CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "CHECK"})
    private String paymentMethod;
    
    @Schema(description = "Vendor/supplier name", example = "Office Depot")
    private String vendor;
    
    @Schema(description = "Invoice number", example = "INV-2024-001")
    private String invoiceNumber;
    
    @Schema(description = "Receipt number", example = "RCP-2024-001")
    private String receiptNumber;
    
    @Schema(description = "Additional notes", example = "Monthly office supplies including paper, pens, and printer ink")
    private String notes;
    
    @Schema(description = "Expense status", example = "PENDING_APPROVAL", allowableValues = {"PENDING_APPROVAL", "APPROVED", "REJECTED", "PAID"})
    private String status;
    
    @Schema(description = "Approval status", example = "PENDING", allowableValues = {"PENDING", "APPROVED", "REJECTED"})
    private String approvalStatus;
    
    @Schema(description = "Approved by user ID", example = "1")
    private Long approvedBy;
    
    @Schema(description = "Approver name", example = "John Doe")
    private String approverName;
    
    @Schema(description = "Approval date", example = "2024-01-16T10:30:00")
    private LocalDateTime approvalDate;
    
    @Schema(description = "Rejection reason (if applicable)", example = "Expense exceeds budget limit")
    private String rejectionReason;
    
    @Schema(description = "Submitted by user ID", example = "2")
    private Long submittedBy;
    
    @Schema(description = "Submitter name", example = "Jane Smith")
    private String submitterName;
    
    @Schema(description = "Receipt image URL", example = "https://example.com/receipts/expense-001.jpg")
    private String receiptUrl;
    
    @Schema(description = "Tax amount", example = "10.50")
    private BigDecimal taxAmount;
    
    @Schema(description = "Total amount including tax", example = "136.00")
    private BigDecimal totalAmount;
    
    @Schema(description = "Currency code", example = "USD")
    private String currency;
    
    @Schema(description = "Exchange rate (if different currency)", example = "1.0")
    private BigDecimal exchangeRate;
    
    @Schema(description = "Is recurring expense", example = "false")
    private Boolean isRecurring;
    
    @Schema(description = "Recurrence frequency (if recurring)", example = "MONTHLY", allowableValues = {"DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"})
    private String recurrenceFrequency;
    
    @Schema(description = "Next occurrence date (if recurring)", example = "2024-02-15")
    private LocalDate nextOccurrenceDate;
    
    @Schema(description = "Creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2024-01-15T14:45:00")
    private LocalDateTime updatedAt;
} 