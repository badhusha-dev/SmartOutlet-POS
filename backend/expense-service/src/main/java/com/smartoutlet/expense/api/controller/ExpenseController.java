package com.smartoutlet.expense.api.controller;

import com.smartoutlet.expense.api.dto.ExpenseRequest;
import com.smartoutlet.expense.api.dto.ExpenseResponse;
import com.smartoutlet.expense.application.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Management", description = "Expense tracking and budget management")
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    @Operation(summary = "Add expense", description = "Create a new expense record")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Expense created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ExpenseResponse> addExpense(
            @RequestBody ExpenseRequest request,
            @AuthenticationPrincipal UserDetails userDetails,
            Principal principal
    ) {
        log.info("Adding expense: {}", request.getDescription());
        String createdBy = userDetails != null ? userDetails.getUsername() : principal.getName();
        ExpenseResponse response = expenseService.addExpense(request, createdBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "List expenses", description = "Retrieve expenses with optional filtering")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Expenses retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<ExpenseResponse>> listExpenses(
            @RequestParam(required = false) Long outletId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        log.info("Listing expenses - outletId: {}, category: {}, date: {}", outletId, category, date);
        List<ExpenseResponse> expenses = expenseService.listExpenses(outletId, category, date);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the expense service is running")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Expense service is running");
    }
} 