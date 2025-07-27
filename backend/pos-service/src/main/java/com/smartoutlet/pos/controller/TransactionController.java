package com.smartoutlet.pos.controller;

import com.smartoutlet.common.dto.ApiResponseDTO;
import com.smartoutlet.pos.dto.TransactionDto;
import com.smartoutlet.pos.dto.OutletStatsDto;
import com.smartoutlet.pos.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Transactions", description = "Sales transaction management operations")
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping
    @Operation(
        summary = "Create a new transaction",
        description = "Creates a new sales transaction with items, calculates totals, and generates receipt"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Transaction created successfully",
            content = @Content(schema = @Schema(implementation = TransactionDto.class),
                examples = @ExampleObject(value = """
                    {
                      "success": true,
                      "message": "Transaction created successfully",
                      "data": {
                        "id": 1,
                        "transactionNumber": "TXN-20240115-103000",
                        "outletId": 1,
                        "outletName": "Downtown Coffee Shop",
                        "cashierId": 1,
                        "cashierName": "John Doe",
                        "customerId": 1,
                        "customerName": "Jane Smith",
                        "transactionType": "SALE",
                        "paymentMethod": "CREDIT_CARD",
                        "subtotal": 45.50,
                        "taxAmount": 3.64,
                        "discountAmount": 5.00,
                        "totalAmount": 44.14,
                        "amountPaid": 50.00,
                        "changeAmount": 5.86,
                        "status": "COMPLETED",
                        "receiptNumber": "RCP-20240115-103000",
                        "loyaltyPointsEarned": 44
                      }
                    }"""))),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponseDTO<TransactionDto>> createTransaction(
            @Valid @RequestBody TransactionDto transactionDto) {
        log.info("Creating new transaction for outlet: {}", transactionDto.getOutletId());
        TransactionDto createdTransaction = transactionService.createTransaction(transactionDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success("Transaction created successfully", createdTransaction));
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Get transaction by ID",
        description = "Retrieves a specific transaction by its unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transaction found"),
        @ApiResponse(responseCode = "404", description = "Transaction not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ApiResponseDTO<TransactionDto>> getTransactionById(
            @Parameter(description = "Transaction ID", example = "1")
            @PathVariable Long id) {
        log.info("Fetching transaction with ID: {}", id);
        TransactionDto transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponseDTO.success(transaction));
    }
    
    @GetMapping("/number/{transactionNumber}")
    @Operation(
        summary = "Get transaction by transaction number",
        description = "Retrieves a specific transaction by its transaction number"
    )
    public ResponseEntity<ApiResponseDTO<TransactionDto>> getTransactionByNumber(
            @Parameter(description = "Transaction number", example = "TXN-20240115-103000")
            @PathVariable String transactionNumber) {
        log.info("Fetching transaction with number: {}", transactionNumber);
        TransactionDto transaction = transactionService.getTransactionByNumber(transactionNumber);
        return ResponseEntity.ok(ApiResponseDTO.success(transaction));
    }
    
    @GetMapping("/receipt/{receiptNumber}")
    @Operation(
        summary = "Get transaction by receipt number",
        description = "Retrieves a specific transaction by its receipt number"
    )
    public ResponseEntity<ApiResponseDTO<TransactionDto>> getTransactionByReceiptNumber(
            @Parameter(description = "Receipt number", example = "RCP-20240115-103000")
            @PathVariable String receiptNumber) {
        log.info("Fetching transaction with receipt number: {}", receiptNumber);
        TransactionDto transaction = transactionService.getTransactionByReceiptNumber(receiptNumber);
        return ResponseEntity.ok(ApiResponseDTO.success(transaction));
    }
    
    @GetMapping
    @Operation(
        summary = "Get all transactions",
        description = "Retrieves all transactions with pagination and sorting"
    )
    public ResponseEntity<ApiResponseDTO<Page<TransactionDto>>> getAllTransactions(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "20")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction", example = "DESC")
            @RequestParam(defaultValue = "DESC") String sortDir) {
        log.info("Fetching all transactions with pagination: page={}, size={}", page, size);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TransactionDto> transactions = transactionService.getAllTransactions(pageable);
        return ResponseEntity.ok(ApiResponseDTO.success(transactions));
    }
    
    @GetMapping("/outlet/{outletId}")
    @Operation(
        summary = "Get transactions by outlet",
        description = "Retrieves all transactions for a specific outlet"
    )
    public ResponseEntity<ApiResponseDTO<Page<TransactionDto>>> getTransactionsByOutlet(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching transactions for outlet: {}", outletId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TransactionDto> transactions = transactionService.getTransactionsByOutlet(outletId, pageable);
        return ResponseEntity.ok(ApiResponseDTO.success(transactions));
    }
    
    @GetMapping("/cashier/{cashierId}")
    @Operation(
        summary = "Get transactions by cashier",
        description = "Retrieves all transactions processed by a specific cashier"
    )
    public ResponseEntity<ApiResponseDTO<Page<TransactionDto>>> getTransactionsByCashier(
            @Parameter(description = "Cashier ID", example = "1")
            @PathVariable Long cashierId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching transactions for cashier: {}", cashierId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TransactionDto> transactions = transactionService.getTransactionsByCashier(cashierId, pageable);
        return ResponseEntity.ok(ApiResponseDTO.success(transactions));
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(
        summary = "Get transactions by customer",
        description = "Retrieves all transactions for a specific customer"
    )
    public ResponseEntity<ApiResponseDTO<Page<TransactionDto>>> getTransactionsByCustomer(
            @Parameter(description = "Customer ID", example = "1")
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching transactions for customer: {}", customerId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TransactionDto> transactions = transactionService.getTransactionsByCustomer(customerId, pageable);
        return ResponseEntity.ok(ApiResponseDTO.success(transactions));
    }
    
    @GetMapping("/status/{status}")
    @Operation(
        summary = "Get transactions by status",
        description = "Retrieves all transactions with a specific status"
    )
    public ResponseEntity<ApiResponseDTO<Page<TransactionDto>>> getTransactionsByStatus(
            @Parameter(description = "Transaction status", example = "COMPLETED")
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching transactions with status: {}", status);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TransactionDto> transactions = transactionService.getTransactionsByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponseDTO.success(transactions));
    }
    
    @GetMapping("/date-range")
    @Operation(
        summary = "Get transactions by date range",
        description = "Retrieves all transactions within a specific date range"
    )
    public ResponseEntity<ApiResponseDTO<Page<TransactionDto>>> getTransactionsByDateRange(
            @Parameter(description = "Start date", example = "2024-01-01T00:00:00")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date", example = "2024-01-31T23:59:59")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching transactions between {} and {}", startDate, endDate);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TransactionDto> transactions = transactionService.getTransactionsByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponseDTO.success(transactions));
    }
    
    @PutMapping("/{id}")
    @Operation(
        summary = "Update transaction",
        description = "Updates an existing transaction (limited fields can be updated)"
    )
    public ResponseEntity<ApiResponseDTO<TransactionDto>> updateTransaction(
            @Parameter(description = "Transaction ID", example = "1")
            @PathVariable Long id,
            @Valid @RequestBody TransactionDto transactionDto) {
        log.info("Updating transaction with ID: {}", id);
        TransactionDto updatedTransaction = transactionService.updateTransaction(id, transactionDto);
        return ResponseEntity.ok(ApiResponseDTO.success("Transaction updated successfully", updatedTransaction));
    }
    
    @PostMapping("/{id}/cancel")
    @Operation(
        summary = "Cancel transaction",
        description = "Cancels a completed transaction"
    )
    public ResponseEntity<ApiResponseDTO<TransactionDto>> cancelTransaction(
            @Parameter(description = "Transaction ID", example = "1")
            @PathVariable Long id,
            @Parameter(description = "Cancellation reason", example = "Customer requested cancellation")
            @RequestParam String reason) {
        log.info("Cancelling transaction with ID: {}", id);
        TransactionDto cancelledTransaction = transactionService.cancelTransaction(id, reason);
        return ResponseEntity.ok(ApiResponseDTO.success("Transaction cancelled successfully", cancelledTransaction));
    }
    
    @PostMapping("/{id}/void")
    @Operation(
        summary = "Void transaction",
        description = "Voids a transaction (marks as never happened)"
    )
    public ResponseEntity<ApiResponseDTO<TransactionDto>> voidTransaction(
            @Parameter(description = "Transaction ID", example = "1")
            @PathVariable Long id,
            @Parameter(description = "Void reason", example = "System error")
            @RequestParam String reason) {
        log.info("Voiding transaction with ID: {}", id);
        TransactionDto voidedTransaction = transactionService.voidTransaction(id, reason);
        return ResponseEntity.ok(ApiResponseDTO.success("Transaction voided successfully", voidedTransaction));
    }
    
    @PostMapping("/{id}/refund")
    @Operation(
        summary = "Refund transaction",
        description = "Processes a refund for a transaction"
    )
    public ResponseEntity<ApiResponseDTO<TransactionDto>> refundTransaction(
            @Parameter(description = "Transaction ID", example = "1")
            @PathVariable Long id,
            @Parameter(description = "Refund amount", example = "44.14")
            @RequestParam BigDecimal refundAmount,
            @Parameter(description = "Refund reason", example = "Customer returned items")
            @RequestParam String reason) {
        log.info("Processing refund for transaction with ID: {}", id);
        TransactionDto refundedTransaction = transactionService.refundTransaction(id, refundAmount, reason);
        return ResponseEntity.ok(ApiResponseDTO.success("Refund processed successfully", refundedTransaction));
    }
    
    @GetMapping("/{id}/receipt")
    @Operation(
        summary = "Generate receipt",
        description = "Generates a formatted receipt for a transaction"
    )
    public ResponseEntity<ApiResponseDTO<String>> generateReceipt(
            @Parameter(description = "Transaction ID", example = "1")
            @PathVariable Long id) {
        log.info("Generating receipt for transaction: {}", id);
        String receipt = transactionService.generateReceipt(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Receipt generated successfully", receipt));
    }
    
    @GetMapping("/outlet/{outletId}/stats")
    @Operation(
        summary = "Get outlet statistics",
        description = "Retrieves sales statistics for a specific outlet"
    )
    public ResponseEntity<ApiResponseDTO<OutletStatsDto>> getOutletStats(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching statistics for outlet: {}", outletId);
        Double totalSales = transactionService.getTotalSalesByOutlet(outletId);
        Long transactionCount = transactionService.getTransactionCountByOutlet(outletId);
        
        OutletStatsDto stats = OutletStatsDto.builder()
                .outletId(outletId)
                .totalSales(totalSales != null ? totalSales : 0.0)
                .transactionCount(transactionCount != null ? transactionCount : 0L)
                .averageTransactionValue((transactionCount != null && transactionCount > 0 && totalSales != null) ? 
                    totalSales / transactionCount : 0.0)
                .build();
        
        return ResponseEntity.ok(ApiResponseDTO.success(stats));
    }
} 