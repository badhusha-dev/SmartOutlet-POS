package com.smartoutlet.expense.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ExpenseRequest {
    private String description;
    private BigDecimal amount;
    private Long outletId;
    private String category;
} 