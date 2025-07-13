package com.smartoutlet.expense.controller;

import com.smartoutlet.expense.dto.ExpenseRequest;
import com.smartoutlet.expense.dto.ExpenseResponse;
import com.smartoutlet.expense.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(
            @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserDetails userDetails,
            Principal principal
    ) {
        String createdBy = userDetails != null ? userDetails.getUsername() : principal.getName();
        ExpenseResponse response = expenseService.addExpense(request, createdBy);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> listExpenses(
            @RequestParam(required = false) Long outletId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<ExpenseResponse> expenses = expenseService.listExpenses(outletId, category, date);
        return ResponseEntity.ok(expenses);
    }
} 