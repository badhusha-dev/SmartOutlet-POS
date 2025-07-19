package com.smartoutlet.product.repository;

import com.smartoutlet.product.entity.MovementType;
import com.smartoutlet.product.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    
    List<StockMovement> findByProductId(Long productId);
    
    List<StockMovement> findByMovementType(MovementType movementType);
    
    List<StockMovement> findByProductIdAndMovementType(Long productId, MovementType movementType);
    
    List<StockMovement> findByReferenceIdAndReferenceType(String referenceId, String referenceType);
    
    List<StockMovement> findByOutletId(Long outletId);
    
    List<StockMovement> findByUserId(Long userId);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.product.id = :productId ORDER BY sm.createdAt DESC")
    List<StockMovement> findRecentMovementsByProduct(@Param("productId") Long productId);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.createdAt BETWEEN :startDate AND :endDate")
    List<StockMovement> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.product.id = :productId AND sm.createdAt BETWEEN :startDate AND :endDate")
    List<StockMovement> findByProductAndDateRange(@Param("productId") Long productId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.outletId = :outletId AND sm.createdAt BETWEEN :startDate AND :endDate")
    List<StockMovement> findByOutletAndDateRange(@Param("outletId") Long outletId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
} 