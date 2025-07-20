package com.smartoutlet.expense.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseEvent {
    private String eventType;
    private Long expenseId;
    private String description;
    private BigDecimal amount;
    private Long outletId;
    private String category;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime timestamp;
    private String action;
    private String performedBy;
} 