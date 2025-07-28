package com.smartoutlet.inventory.controller;

import com.smartoutlet.inventory.dto.request.StockAdjustmentRequest;
import com.smartoutlet.inventory.dto.request.StockReceiveRequest;
import com.smartoutlet.inventory.dto.request.StockTransferRequest;
import com.smartoutlet.inventory.dto.response.InventoryItemResponse;
import com.smartoutlet.inventory.dto.response.StockLevelResponse;
import com.smartoutlet.inventory.entity.InventoryStatus;
import com.smartoutlet.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Inventory Management", description = "APIs for managing inventory with FIFO tracking and expiry management")
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    // Stock Receiving
    @PostMapping("/receive")
    @PreAuthorize("hasAuthority('INVENTORY_WRITE')")
    @Operation(summary = "Receive stock into inventory", description = "Add new stock with batch tracking and expiry dates")
    public ResponseEntity<InventoryItemResponse> receiveStock(
            @Valid @RequestBody StockReceiveRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        log.info("Receiving stock for product {} at outlet {}", request.getProductId(), request.getOutletId());
        InventoryItemResponse response = inventoryService.receiveStock(request, userId);
        return ResponseEntity.ok(response);
    }
    
    // Stock Transfer
    @PostMapping("/transfer")
    @PreAuthorize("hasAuthority('INVENTORY_WRITE')")
    @Operation(summary = "Transfer stock between outlets", description = "Transfer stock from one outlet to another with FIFO allocation")
    public ResponseEntity<Void> transferStock(
            @Valid @RequestBody StockTransferRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        log.info("Transferring {} units of product {} from outlet {} to {}", 
                request.getQuantity(), request.getProductId(), 
                request.getSourceOutletId(), request.getDestinationOutletId());
        inventoryService.transferStock(request, userId);
        return ResponseEntity.ok().build();
    }
    
    // Stock Adjustment
    @PostMapping("/adjust")
    @PreAuthorize("hasAuthority('INVENTORY_WRITE')")
    @Operation(summary = "Adjust inventory stock", description = "Manual stock adjustments for damage, waste, etc.")
    public ResponseEntity<InventoryItemResponse> adjustStock(
            @Valid @RequestBody StockAdjustmentRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        log.info("Adjusting stock for inventory item {}", request.getInventoryItemId());
        InventoryItemResponse response = inventoryService.adjustStock(request, userId);
        return ResponseEntity.ok(response);
    }
    
    // Get Stock Levels by Outlet
    @GetMapping("/outlets/{outletId}/stock-levels")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get stock levels by outlet", description = "Retrieve all product stock levels for a specific outlet")
    public ResponseEntity<List<StockLevelResponse>> getStockLevelsByOutlet(
            @PathVariable @Parameter(description = "Outlet ID") Long outletId) {
        List<StockLevelResponse> response = inventoryService.getStockLevelsByOutlet(outletId);
        return ResponseEntity.ok(response);
    }
    
    // Get Stock Levels by Product
    @GetMapping("/products/{productId}/stock-levels")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get stock levels by product", description = "Retrieve stock levels for a product across all outlets")
    public ResponseEntity<List<StockLevelResponse>> getStockLevelsByProduct(
            @PathVariable @Parameter(description = "Product ID") Long productId) {
        List<StockLevelResponse> response = inventoryService.getStockLevelsByProduct(productId);
        return ResponseEntity.ok(response);
    }
    
    // Get Specific Stock Level
    @GetMapping("/products/{productId}/outlets/{outletId}/stock-level")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get specific stock level", description = "Get stock level for a specific product at a specific outlet")
    public ResponseEntity<StockLevelResponse> getStockLevel(
            @PathVariable @Parameter(description = "Product ID") Long productId,
            @PathVariable @Parameter(description = "Outlet ID") Long outletId) {
        StockLevelResponse response = inventoryService.getStockLevel(productId, outletId);
        return ResponseEntity.ok(response);
    }
    
    // Search Inventory Items
    @GetMapping("/items")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Search inventory items", description = "Search inventory items with filters and pagination")
    public ResponseEntity<Page<InventoryItemResponse>> searchInventoryItems(
            @RequestParam(required = false) @Parameter(description = "Outlet ID filter") Long outletId,
            @RequestParam(required = false) @Parameter(description = "Product ID filter") Long productId,
            @RequestParam(required = false) @Parameter(description = "Status filter") InventoryStatus status,
            @RequestParam(required = false) @Parameter(description = "Batch number filter") String batchNumber,
            @RequestParam(defaultValue = "0") @Parameter(description = "Page number") int page,
            @RequestParam(defaultValue = "20") @Parameter(description = "Page size") int size,
            @RequestParam(defaultValue = "createdAt") @Parameter(description = "Sort field") String sortBy,
            @RequestParam(defaultValue = "desc") @Parameter(description = "Sort direction") String sortDir) {
        
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? 
                           Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<InventoryItemResponse> response = inventoryService.searchInventoryItems(
                outletId, productId, status, batchNumber, pageable);
        return ResponseEntity.ok(response);
    }
    
    // Get Inventory Item Details
    @GetMapping("/items/{itemId}")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get inventory item details", description = "Get detailed information about a specific inventory item")
    public ResponseEntity<InventoryItemResponse> getInventoryItem(
            @PathVariable @Parameter(description = "Inventory item ID") Long itemId) {
        InventoryItemResponse response = inventoryService.getInventoryItem(itemId);
        return ResponseEntity.ok(response);
    }
    
    // Get Expiring Items
    @GetMapping("/outlets/{outletId}/expiring")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get expiring items", description = "Get items expiring within specified days")
    public ResponseEntity<List<InventoryItemResponse>> getExpiringItems(
            @PathVariable @Parameter(description = "Outlet ID") Long outletId,
            @RequestParam(defaultValue = "30") @Parameter(description = "Days ahead to check") Integer days) {
        List<InventoryItemResponse> response = inventoryService.getExpiringItems(outletId, days);
        return ResponseEntity.ok(response);
    }
    
    // Get Expired Items
    @GetMapping("/outlets/{outletId}/expired")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get expired items", description = "Get all expired items for an outlet")
    public ResponseEntity<List<InventoryItemResponse>> getExpiredItems(
            @PathVariable @Parameter(description = "Outlet ID") Long outletId) {
        List<InventoryItemResponse> response = inventoryService.getExpiredItems(outletId);
        return ResponseEntity.ok(response);
    }
    
    // Get Low Stock Products
    @GetMapping("/outlets/{outletId}/low-stock")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get low stock products", description = "Get products with stock below minimum level")
    public ResponseEntity<List<StockLevelResponse>> getLowStockProducts(
            @PathVariable @Parameter(description = "Outlet ID") Long outletId) {
        List<StockLevelResponse> response = inventoryService.getLowStockProducts(outletId);
        return ResponseEntity.ok(response);
    }
    
    // Get Out of Stock Products
    @GetMapping("/outlets/{outletId}/out-of-stock")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get out of stock products", description = "Get products with zero available stock")
    public ResponseEntity<List<StockLevelResponse>> getOutOfStockProducts(
            @PathVariable @Parameter(description = "Outlet ID") Long outletId) {
        List<StockLevelResponse> response = inventoryService.getOutOfStockProducts(outletId);
        return ResponseEntity.ok(response);
    }
    
    // Reserve Stock
    @PostMapping("/products/{productId}/outlets/{outletId}/reserve")
    @PreAuthorize("hasAuthority('INVENTORY_WRITE')")
    @Operation(summary = "Reserve stock", description = "Reserve stock for pending orders")
    public ResponseEntity<Void> reserveStock(
            @PathVariable @Parameter(description = "Product ID") Long productId,
            @PathVariable @Parameter(description = "Outlet ID") Long outletId,
            @RequestParam @Parameter(description = "Quantity to reserve") Integer quantity,
            @RequestParam @Parameter(description = "Reference ID (order ID, etc.)") String referenceId) {
        inventoryService.reserveStock(productId, outletId, quantity, referenceId);
        return ResponseEntity.ok().build();
    }
    
    // Release Reservation
    @PostMapping("/products/{productId}/outlets/{outletId}/release-reservation")
    @PreAuthorize("hasAuthority('INVENTORY_WRITE')")
    @Operation(summary = "Release stock reservation", description = "Release previously reserved stock")
    public ResponseEntity<Void> releaseReservation(
            @PathVariable @Parameter(description = "Product ID") Long productId,
            @PathVariable @Parameter(description = "Outlet ID") Long outletId,
            @RequestParam @Parameter(description = "Quantity to release") Integer quantity,
            @RequestParam @Parameter(description = "Reference ID") String referenceId) {
        inventoryService.releaseReservation(productId, outletId, quantity, referenceId);
        return ResponseEntity.ok().build();
    }
    
    // Get Stock Summary
    @GetMapping("/products/{productId}/outlets/{outletId}/summary")
    @PreAuthorize("hasAuthority('INVENTORY_READ')")
    @Operation(summary = "Get stock summary", description = "Get total available stock for a product at an outlet")
    public ResponseEntity<Map<String, Object>> getStockSummary(
            @PathVariable @Parameter(description = "Product ID") Long productId,
            @PathVariable @Parameter(description = "Outlet ID") Long outletId) {
        Integer totalStock = inventoryService.getTotalAvailableStock(productId, outletId);
        Integer totalAllOutlets = inventoryService.getTotalAvailableStockAllOutlets(productId);
        
        Map<String, Object> summary = Map.of(
                "totalAvailableStock", totalStock,
                "totalStockAllOutlets", totalAllOutlets,
                "productId", productId,
                "outletId", outletId
        );
        
        return ResponseEntity.ok(summary);
    }
    
    // Update Item Status
    @PutMapping("/items/{itemId}/status")
    @PreAuthorize("hasAuthority('INVENTORY_WRITE')")
    @Operation(summary = "Update inventory item status", description = "Update the status of an inventory item")
    public ResponseEntity<Void> updateItemStatus(
            @PathVariable @Parameter(description = "Inventory item ID") Long itemId,
            @RequestParam @Parameter(description = "New status") InventoryStatus status,
            @RequestParam @Parameter(description = "Reason for status change") String reason,
            @RequestHeader("X-User-ID") Long userId) {
        inventoryService.updateInventoryItemStatus(itemId, status, reason, userId);
        return ResponseEntity.ok().build();
    }
}