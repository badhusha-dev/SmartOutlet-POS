package com.smartoutlet.pos.controller;

import com.smartoutlet.common.dto.ApiResponseDTO;
import com.smartoutlet.common.security.annotations.RequirePermission;
import com.smartoutlet.pos.dto.OrderHistoryDto;
import com.smartoutlet.pos.service.OrderHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/order-history")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order History", description = "Order history and reporting endpoints")
public class OrderHistoryController {

    private final OrderHistoryService orderHistoryService;

    @GetMapping
    @Operation(summary = "Get all orders", description = "Retrieve all order history")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getAllOrders() {
        log.info("Fetching all orders");
        List<OrderHistoryDto> orders = orderHistoryService.getAllOrders();
        return ResponseEntity.ok(ApiResponseDTO.success("All orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieve a specific order by its ID")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<OrderHistoryDto>> getOrderById(
            @Parameter(description = "Order ID", example = "1")
            @PathVariable Long id) {
        log.info("Fetching order with ID: {}", id);
        OrderHistoryDto order = orderHistoryService.getOrderById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Order retrieved successfully", order));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get orders by customer", description = "Retrieve all orders for a specific customer")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getOrdersByCustomerId(
            @Parameter(description = "Customer ID", example = "1")
            @PathVariable Long customerId) {
        log.info("Fetching orders for customer: {}", customerId);
        List<OrderHistoryDto> orders = orderHistoryService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer orders retrieved successfully", orders));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get orders by date range", description = "Retrieve orders within a specific date range")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getOrdersByDateRange(
            @Parameter(description = "Start date", example = "2024-01-01T00:00:00")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date", example = "2024-12-31T23:59:59")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Fetching orders between {} and {}", startDate, endDate);
        List<OrderHistoryDto> orders = orderHistoryService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponseDTO.success("Orders by date range retrieved successfully", orders));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get orders by status", description = "Retrieve orders by their status")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getOrdersByStatus(
            @Parameter(description = "Order status", example = "COMPLETED")
            @PathVariable String status) {
        log.info("Fetching orders with status: {}", status);
        List<OrderHistoryDto> orders = orderHistoryService.getOrdersByStatus(status);
        return ResponseEntity.ok(ApiResponseDTO.success("Orders by status retrieved successfully", orders));
    }

    @GetMapping("/payment-method/{paymentMethod}")
    @Operation(summary = "Get orders by payment method", description = "Retrieve orders by payment method")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getOrdersByPaymentMethod(
            @Parameter(description = "Payment method", example = "CREDIT_CARD")
            @PathVariable String paymentMethod) {
        log.info("Fetching orders with payment method: {}", paymentMethod);
        List<OrderHistoryDto> orders = orderHistoryService.getOrdersByPaymentMethod(paymentMethod);
        return ResponseEntity.ok(ApiResponseDTO.success("Orders by payment method retrieved successfully", orders));
    }

    @GetMapping("/outlet/{outletId}")
    @Operation(summary = "Get orders by outlet", description = "Retrieve all orders for a specific outlet")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getOrdersByOutletId(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching orders for outlet: {}", outletId);
        List<OrderHistoryDto> orders = orderHistoryService.getOrdersByOutletId(outletId);
        return ResponseEntity.ok(ApiResponseDTO.success("Outlet orders retrieved successfully", orders));
    }

    @GetMapping("/staff/{staffMember}")
    @Operation(summary = "Get orders by staff member", description = "Retrieve orders processed by a specific staff member")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getOrdersByStaffMember(
            @Parameter(description = "Staff member name", example = "John Doe")
            @PathVariable String staffMember) {
        log.info("Fetching orders by staff member: {}", staffMember);
        List<OrderHistoryDto> orders = orderHistoryService.getOrdersByStaffMember(staffMember);
        return ResponseEntity.ok(ApiResponseDTO.success("Staff orders retrieved successfully", orders));
    }

    @GetMapping("/search")
    @Operation(summary = "Search orders", description = "Search orders by customer name or transaction number")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> searchOrders(
            @Parameter(description = "Search term", example = "John")
            @RequestParam String searchTerm) {
        log.info("Searching orders with term: {}", searchTerm);
        List<OrderHistoryDto> orders = orderHistoryService.searchOrders(searchTerm);
        return ResponseEntity.ok(ApiResponseDTO.success("Order search completed successfully", orders));
    }

    @GetMapping("/with-discounts")
    @Operation(summary = "Get orders with discounts", description = "Retrieve all orders that had discounts applied")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getOrdersWithDiscounts() {
        log.info("Fetching orders with discounts");
        List<OrderHistoryDto> orders = orderHistoryService.getOrdersWithDiscounts();
        return ResponseEntity.ok(ApiResponseDTO.success("Orders with discounts retrieved successfully", orders));
    }

    @GetMapping("/amount-range")
    @Operation(summary = "Get orders by amount range", description = "Retrieve orders within a specific amount range")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<List<OrderHistoryDto>>> getOrdersByAmountRange(
            @Parameter(description = "Minimum amount", example = "10.00")
            @RequestParam Double minAmount,
            @Parameter(description = "Maximum amount", example = "100.00")
            @RequestParam Double maxAmount) {
        log.info("Fetching orders between ${} and ${}", minAmount, maxAmount);
        List<OrderHistoryDto> orders = orderHistoryService.getOrdersByAmountRange(minAmount, maxAmount);
        return ResponseEntity.ok(ApiResponseDTO.success("Orders by amount range retrieved successfully", orders));
    }

    @GetMapping("/stats/total-sales")
    @Operation(summary = "Get total sales for period", description = "Get total sales amount for a specific period")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<Double>> getTotalSalesForPeriod(
            @Parameter(description = "Start date", example = "2024-01-01T00:00:00")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date", example = "2024-12-31T23:59:59")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Calculating total sales between {} and {}", startDate, endDate);
        Double totalSales = orderHistoryService.getTotalSalesForPeriod(startDate, endDate);
        return ResponseEntity.ok(ApiResponseDTO.success("Total sales calculated successfully", totalSales));
    }

    @GetMapping("/stats/order-count")
    @Operation(summary = "Get order count for period", description = "Get the number of orders for a specific period")
    @RequirePermission("orderhistory:read")
    public ResponseEntity<ApiResponseDTO<Long>> getOrderCountForPeriod(
            @Parameter(description = "Start date", example = "2024-01-01T00:00:00")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date", example = "2024-12-31T23:59:59")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Counting orders between {} and {}", startDate, endDate);
        Long orderCount = orderHistoryService.getOrderCountForPeriod(startDate, endDate);
        return ResponseEntity.ok(ApiResponseDTO.success("Order count calculated successfully", orderCount));
    }
}