package com.smartoutlet.expense.service;

import com.smartoutlet.expense.dto.ExpenseRequest;
import com.smartoutlet.expense.dto.ExpenseResponse;
import com.smartoutlet.expense.entity.Expense;
import com.smartoutlet.expense.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseResponse addExpense(ExpenseRequest request, String createdBy) {
        Expense expense = Expense.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .outletId(request.getOutletId())
                .category(request.getCategory())
                .createdBy(createdBy)
                .build();
        expense = expenseRepository.save(expense);
        return toResponse(expense);
    }

    public List<ExpenseResponse> listExpenses(Long outletId, String category, LocalDate date) {
        List<Expense> expenses;
        if (outletId != null && category != null && date != null) {
            expenses = expenseRepository.findByOutletIdAndCategoryAndCreatedAtBetween(
                    outletId, category, date.atStartOfDay(), date.atTime(LocalTime.MAX));
        } else if (outletId != null && category != null) {
            expenses = expenseRepository.findByOutletIdAndCategory(outletId, category);
        } else if (outletId != null && date != null) {
            expenses = expenseRepository.findByOutletIdAndCreatedAtBetween(
                    outletId, date.atStartOfDay(), date.atTime(LocalTime.MAX));
        } else if (category != null && date != null) {
            expenses = expenseRepository.findByCategoryAndCreatedAtBetween(
                    category, date.atStartOfDay(), date.atTime(LocalTime.MAX));
        } else if (outletId != null) {
            expenses = expenseRepository.findByOutletId(outletId);
        } else if (category != null) {
            expenses = expenseRepository.findByCategory(category);
        } else if (date != null) {
            expenses = expenseRepository.findByCreatedAtBetween(
                    date.atStartOfDay(), date.atTime(LocalTime.MAX));
        } else {
            expenses = expenseRepository.findAll();
        }
        return expenses.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ExpenseResponse toResponse(Expense expense) {
        ExpenseResponse resp = new ExpenseResponse();
        resp.setId(expense.getId());
        resp.setDescription(expense.getDescription());
        resp.setAmount(expense.getAmount());
        resp.setOutletId(expense.getOutletId());
        resp.setCategory(expense.getCategory());
        resp.setCreatedBy(expense.getCreatedBy());
        resp.setCreatedAt(expense.getCreatedAt());
        return resp;
    }
} 