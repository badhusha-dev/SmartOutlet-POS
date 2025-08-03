package com.smartoutlet.inventory.repository;

import com.smartoutlet.inventory.entity.InventoryItem;
import com.smartoutlet.inventory.entity.InventoryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    
    // Find by product and outlet
    List<InventoryItem> findByProductIdAndOutletId(Long productId, Long outletId);
    
    // Find by outlet
    List<InventoryItem> findByOutletId(Long outletId);
    
    // Find by product across all outlets
    List<InventoryItem> findByProductId(Long productId);
    
    // Find by status
    List<InventoryItem> findByStatus(InventoryStatus status);
    
    // Find available items (FIFO ordered)
    @Query("SELECT i FROM InventoryItem i WHERE i.productId = :productId AND i.outletId = :outletId " +
           "AND i.status = 'AVAILABLE' AND i.quantity > i.reservedQuantity " +
           "ORDER BY i.expiryDate ASC NULLS LAST, i.receivedDate ASC")
    List<InventoryItem> findAvailableItemsFifo(@Param("productId") Long productId, 
                                               @Param("outletId") Long outletId);
    
    // Find items expiring soon
    @Query("SELECT i FROM InventoryItem i WHERE i.expiryDate IS NOT NULL " +
           "AND i.expiryDate <= :expiryDate AND i.status = 'AVAILABLE' " +
           "ORDER BY i.expiryDate ASC")
    List<InventoryItem> findItemsExpiringBefore(@Param("expiryDate") LocalDate expiryDate);
    
    // Find items expiring soon by outlet
    @Query("SELECT i FROM InventoryItem i WHERE i.outletId = :outletId " +
           "AND i.expiryDate IS NOT NULL AND i.expiryDate <= :expiryDate " +
           "AND i.status = 'AVAILABLE' ORDER BY i.expiryDate ASC")
    List<InventoryItem> findItemsExpiringBeforeByOutlet(@Param("outletId") Long outletId,
                                                        @Param("expiryDate") LocalDate expiryDate);
    
    // Find expired items
    @Query("SELECT i FROM InventoryItem i WHERE i.expiryDate IS NOT NULL " +
           "AND i.expiryDate < :currentDate AND i.status = 'AVAILABLE'")
    List<InventoryItem> findExpiredItems(@Param("currentDate") LocalDate currentDate);
    
    // Get total stock by product and outlet
    @Query("SELECT COALESCE(SUM(i.quantity - COALESCE(i.reservedQuantity, 0)), 0) " +
           "FROM InventoryItem i WHERE i.productId = :productId AND i.outletId = :outletId " +
           "AND i.status = 'AVAILABLE'")
    Integer getTotalAvailableStock(@Param("productId") Long productId, 
                                  @Param("outletId") Long outletId);
    
    // Get total stock by product across all outlets
    @Query("SELECT COALESCE(SUM(i.quantity - COALESCE(i.reservedQuantity, 0)), 0) " +
           "FROM InventoryItem i WHERE i.productId = :productId AND i.status = 'AVAILABLE'")
    Integer getTotalAvailableStockAllOutlets(@Param("productId") Long productId);
    
    // Find items by batch number
    Optional<InventoryItem> findByBatchNumberAndProductIdAndOutletId(String batchNumber, 
                                                                    Long productId, 
                                                                    Long outletId);
    
    // Find low stock items (considering all batches)
    @Query("SELECT i.productId, i.outletId, SUM(i.quantity - COALESCE(i.reservedQuantity, 0)) as totalStock " +
           "FROM InventoryItem i WHERE i.status = 'AVAILABLE' " +
           "GROUP BY i.productId, i.outletId " +
           "HAVING SUM(i.quantity - COALESCE(i.reservedQuantity, 0)) <= :minStock")
    List<Object[]> findLowStockProducts(@Param("minStock") Integer minStock);
    
    // Search with pagination
    @Query("SELECT i FROM InventoryItem i WHERE " +
           "(:outletId IS NULL OR i.outletId = :outletId) AND " +
           "(:productId IS NULL OR i.productId = :productId) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:batchNumber IS NULL OR LOWER(i.batchNumber) LIKE LOWER(CONCAT('%', :batchNumber, '%')))")
    Page<InventoryItem> findWithFilters(@Param("outletId") Long outletId,
                                       @Param("productId") Long productId,
                                       @Param("status") InventoryStatus status,
                                       @Param("batchNumber") String batchNumber,
                                       Pageable pageable);
    
    // Get inventory summary by outlet
    @Query("SELECT i.productId, " +
           "SUM(i.quantity) as totalQuantity, " +
           "SUM(i.quantity - COALESCE(i.reservedQuantity, 0)) as availableQuantity, " +
           "SUM(COALESCE(i.reservedQuantity, 0)) as reservedQuantity, " +
           "COUNT(i) as batchCount " +
           "FROM InventoryItem i WHERE i.outletId = :outletId AND i.status = 'AVAILABLE' " +
           "GROUP BY i.productId")
    List<Object[]> getInventorySummaryByOutlet(@Param("outletId") Long outletId);
}