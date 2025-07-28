package com.smartoutlet.inventory.repository;

import com.smartoutlet.inventory.entity.StockAlert;
import com.smartoutlet.inventory.entity.AlertType;
import com.smartoutlet.inventory.entity.AlertStatus;
import com.smartoutlet.inventory.entity.AlertPriority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {
    
    // Find by status
    List<StockAlert> findByStatusOrderByCreatedAtDesc(AlertStatus status);
    
    // Find active alerts
    List<StockAlert> findByStatusInOrderByPriorityDescCreatedAtDesc(List<AlertStatus> statuses);
    
    // Find by outlet
    List<StockAlert> findByOutletIdAndStatusOrderByCreatedAtDesc(Long outletId, AlertStatus status);
    
    // Find by product
    List<StockAlert> findByProductIdAndStatusOrderByCreatedAtDesc(Long productId, AlertStatus status);
    
    // Find by alert type
    List<StockAlert> findByAlertTypeAndStatusOrderByCreatedAtDesc(AlertType alertType, AlertStatus status);
    
    // Find by priority
    List<StockAlert> findByPriorityAndStatusOrderByCreatedAtDesc(AlertPriority priority, AlertStatus status);
    
    // Check if alert already exists for product/outlet/type
    @Query("SELECT a FROM StockAlert a WHERE a.productId = :productId AND a.outletId = :outletId " +
           "AND a.alertType = :alertType AND a.status = 'ACTIVE'")
    Optional<StockAlert> findActiveAlert(@Param("productId") Long productId,
                                        @Param("outletId") Long outletId,
                                        @Param("alertType") AlertType alertType);
    
    // Find alerts for specific inventory item
    List<StockAlert> findByInventoryItemIdAndStatusOrderByCreatedAtDesc(Long inventoryItemId, AlertStatus status);
    
    // Count active alerts by outlet
    @Query("SELECT COUNT(a) FROM StockAlert a WHERE a.outletId = :outletId AND a.status = 'ACTIVE'")
    Long countActiveAlertsByOutlet(@Param("outletId") Long outletId);
    
    // Count active alerts by priority
    @Query("SELECT COUNT(a) FROM StockAlert a WHERE a.priority = :priority AND a.status = 'ACTIVE'")
    Long countActiveAlertsByPriority(@Param("priority") AlertPriority priority);
    
    // Find alerts created within date range
    List<StockAlert> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    
    // Search with filters and pagination
    @Query("SELECT a FROM StockAlert a WHERE " +
           "(:outletId IS NULL OR a.outletId = :outletId) AND " +
           "(:productId IS NULL OR a.productId = :productId) AND " +
           "(:alertType IS NULL OR a.alertType = :alertType) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:priority IS NULL OR a.priority = :priority)")
    Page<StockAlert> findWithFilters(@Param("outletId") Long outletId,
                                    @Param("productId") Long productId,
                                    @Param("alertType") AlertType alertType,
                                    @Param("status") AlertStatus status,
                                    @Param("priority") AlertPriority priority,
                                    Pageable pageable);
    
    // Get alert summary by type
    @Query("SELECT a.alertType, COUNT(a) FROM StockAlert a " +
           "WHERE a.status = 'ACTIVE' GROUP BY a.alertType")
    List<Object[]> getActiveAlertSummary();
    
    // Get alert summary by outlet
    @Query("SELECT a.outletId, a.priority, COUNT(a) FROM StockAlert a " +
           "WHERE a.status = 'ACTIVE' GROUP BY a.outletId, a.priority")
    List<Object[]> getActiveAlertSummaryByOutlet();
    
    // Delete old resolved alerts (cleanup)
    void deleteByStatusAndResolvedAtBefore(AlertStatus status, LocalDateTime cutoffDate);
}