package com.smartoutlet.pos.controller;

import com.smartoutlet.common.dto.ApiResponseDTO;
import com.smartoutlet.common.security.annotations.RequirePermission;
import com.smartoutlet.pos.dto.RefundDto;
import com.smartoutlet.pos.service.RefundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pos/refunds")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Refund Management", description = "APIs for processing refunds and reprinting receipts")
public class RefundController {
    
    private final RefundService refundService;
    
    @PostMapping
    @Operation(summary = "Create refund", description = "Process a new refund for a transaction")
    @RequirePermission("refund:create")
    public ResponseEntity<ApiResponseDTO<RefundDto>> createRefund(@RequestBody RefundDto refundDto) {
        RefundDto createdRefund = refundService.createRefund(refundDto);
        return ResponseEntity.ok(ApiResponseDTO.success(createdRefund, "Refund processed successfully"));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get refund by ID", description = "Retrieve a specific refund by its ID")
    @RequirePermission("refund:read")
    public ResponseEntity<ApiResponseDTO<RefundDto>> getRefundById(@PathVariable Long id) {
        RefundDto refund = refundService.getRefundById(id);
        return ResponseEntity.ok(ApiResponseDTO.success(refund, "Refund retrieved successfully"));
    }
    
    @GetMapping
    @Operation(summary = "Get all refunds", description = "Retrieve all refunds")
    @RequirePermission("refund:read")
    public ResponseEntity<ApiResponseDTO<List<RefundDto>>> getAllRefunds() {
        List<RefundDto> refunds = refundService.getAllRefunds();
        return ResponseEntity.ok(ApiResponseDTO.success(refunds, "Refunds retrieved successfully"));
    }
    
    @GetMapping("/transaction/{transactionId}")
    @Operation(summary = "Get refunds by transaction", description = "Retrieve all refunds for a specific transaction")
    @RequirePermission("refund:read")
    public ResponseEntity<ApiResponseDTO<List<RefundDto>>> getRefundsByTransactionId(@PathVariable Long transactionId) {
        List<RefundDto> refunds = refundService.getRefundsByTransactionId(transactionId);
        return ResponseEntity.ok(ApiResponseDTO.success(refunds, "Refunds retrieved successfully"));
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get refunds by customer", description = "Retrieve all refunds for a specific customer")
    @RequirePermission("refund:read")
    public ResponseEntity<ApiResponseDTO<List<RefundDto>>> getRefundsByCustomerId(@PathVariable Long customerId) {
        List<RefundDto> refunds = refundService.getRefundsByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponseDTO.success(refunds, "Refunds retrieved successfully"));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get refunds by status", description = "Retrieve refunds by their status (PENDING, PROCESSED, DECLINED, CANCELLED)")
    @RequirePermission("refund:read")
    public ResponseEntity<ApiResponseDTO<List<RefundDto>>> getRefundsByStatus(@PathVariable String status) {
        List<RefundDto> refunds = refundService.getRefundsByStatus(status);
        return ResponseEntity.ok(ApiResponseDTO.success(refunds, "Refunds retrieved successfully"));
    }
    
    @GetMapping("/date-range")
    @Operation(summary = "Get refunds by date range", description = "Retrieve refunds processed within a specific date range")
    @RequirePermission("refund:read")
    public ResponseEntity<ApiResponseDTO<List<RefundDto>>> getRefundsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<RefundDto> refunds = refundService.getRefundsByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponseDTO.success(refunds, "Refunds retrieved successfully"));
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Update refund status", description = "Update the status of a refund")
    @RequirePermission("refund:update")
    public ResponseEntity<ApiResponseDTO<RefundDto>> updateRefundStatus(@PathVariable Long id, @RequestParam String status) {
        RefundDto updatedRefund = refundService.updateRefundStatus(id, status);
        return ResponseEntity.ok(ApiResponseDTO.success(updatedRefund, "Refund status updated successfully"));
    }
    
    @PostMapping("/{id}/reprint")
    @Operation(summary = "Reprint refund receipt", description = "Mark a refund receipt as reprinted")
    @RequirePermission("refund:update")
    public ResponseEntity<ApiResponseDTO<RefundDto>> reprintReceipt(@PathVariable Long id) {
        RefundDto updatedRefund = refundService.reprintReceipt(id);
        return ResponseEntity.ok(ApiResponseDTO.success(updatedRefund, "Receipt reprinted successfully"));
    }
    
    @GetMapping("/stats/total")
    @Operation(summary = "Get total refunds for period", description = "Get total refund amount for a specific period")
    @RequirePermission("refund:read")
    public ResponseEntity<ApiResponseDTO<Double>> getTotalRefundsForPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Double total = refundService.getTotalRefundsForPeriod(startDate, endDate);
        return ResponseEntity.ok(ApiResponseDTO.success(total, "Total refunds calculated successfully"));
    }
    
    @GetMapping("/stats/count")
    @Operation(summary = "Get refund count for period", description = "Get number of refunds for a specific period")
    @RequirePermission("refund:read")
    public ResponseEntity<ApiResponseDTO<Long>> getRefundCountForPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Long count = refundService.getRefundCountForPeriod(startDate, endDate);
        return ResponseEntity.ok(ApiResponseDTO.success(count, "Refund count calculated successfully"));
    }
} 