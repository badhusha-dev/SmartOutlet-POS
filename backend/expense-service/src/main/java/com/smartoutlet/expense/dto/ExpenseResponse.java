package com.smartoutlet.expense.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ExpenseResponse {
    private Long id;
    private String description;
    private BigDecimal amount;
    private Long outletId;
    private String category;
    private String createdBy;
    private LocalDateTime createdAt;
} 