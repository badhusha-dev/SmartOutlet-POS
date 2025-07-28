package com.smartoutlet.inventory.service;

import com.smartoutlet.inventory.dto.request.StockAdjustmentRequest;
import com.smartoutlet.inventory.dto.request.StockReceiveRequest;
import com.smartoutlet.inventory.dto.request.StockTransferRequest;
import com.smartoutlet.inventory.dto.response.InventoryItemResponse;
import com.smartoutlet.inventory.dto.response.StockLevelResponse;
import com.smartoutlet.inventory.entity.InventoryItem;
import com.smartoutlet.inventory.entity.InventoryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface InventoryService {
    
    // Stock receiving operations
    InventoryItemResponse receiveStock(StockReceiveRequest request, Long userId);
    
    // Stock transfer operations
    void transferStock(StockTransferRequest request, Long userId);
    
    // Stock adjustment operations
    InventoryItemResponse adjustStock(StockAdjustmentRequest request, Long userId);
    
    // FIFO stock allocation for sales
    List<InventoryItem> allocateStock(Long productId, Long outletId, Integer quantity, Long userId);
    
    // Stock query operations
    List<StockLevelResponse> getStockLevelsByOutlet(Long outletId);
    List<StockLevelResponse> getStockLevelsByProduct(Long productId);
    StockLevelResponse getStockLevel(Long productId, Long outletId);
    
    // Inventory item operations
    InventoryItemResponse getInventoryItem(Long itemId);
    Page<InventoryItemResponse> searchInventoryItems(Long outletId, Long productId, 
                                                    InventoryStatus status, String batchNumber, 
                                                    Pageable pageable);
    
    // Expiry management
    List<InventoryItemResponse> getExpiringItems(Long outletId, Integer days);
    List<InventoryItemResponse> getExpiredItems(Long outletId);
    void markItemsAsExpired();
    
    // Stock reservation (for orders)
    void reserveStock(Long productId, Long outletId, Integer quantity, String referenceId);
    void releaseReservation(Long productId, Long outletId, Integer quantity, String referenceId);
    
    // Stock summary and analytics
    Integer getTotalAvailableStock(Long productId, Long outletId);
    Integer getTotalAvailableStockAllOutlets(Long productId);
    List<StockLevelResponse> getLowStockProducts(Long outletId);
    List<StockLevelResponse> getOutOfStockProducts(Long outletId);
    
    // Batch operations
    InventoryItemResponse getInventoryItemByBatch(String batchNumber, Long productId, Long outletId);
    void updateInventoryItemStatus(Long itemId, InventoryStatus status, String reason, Long userId);
}