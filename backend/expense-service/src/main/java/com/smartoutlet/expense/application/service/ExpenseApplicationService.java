package com.smartoutlet.expense.application.service;

import com.smartoutlet.expense.api.dto.ExpenseRequest;
import com.smartoutlet.expense.api.dto.ExpenseResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ExpenseApplicationService {
    
    ExpenseResponse createExpense(ExpenseRequest request);
    
    ExpenseResponse getExpenseById(Long id);
    
    List<ExpenseResponse> getAllExpenses();
    
    List<ExpenseResponse> getExpensesByOutlet(Long outletId);
    
    List<ExpenseResponse> getExpensesByCategory(String category);
    
    List<ExpenseResponse> getExpensesByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    ExpenseResponse updateExpense(Long id, ExpenseRequest request);
    
    void deleteExpense(Long id);
    
    BigDecimal getTotalExpensesByOutlet(Long outletId);
    
    BigDecimal getTotalExpensesByCategory(String category);
    
    List<ExpenseResponse> searchExpenses(String query);
} 