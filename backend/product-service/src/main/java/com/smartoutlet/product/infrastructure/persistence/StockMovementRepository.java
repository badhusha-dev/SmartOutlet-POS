package com.smartoutlet.product.infrastructure.persistence;

import com.smartoutlet.product.domain.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    
    List<StockMovement> findByProductId(Long productId);
    
    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    List<StockMovement> findByMovementType(String movementType);
    
    List<StockMovement> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.product.id = :productId AND sm.createdAt >= :startDate")
    List<StockMovement> findRecentMovementsByProduct(@Param("productId") Long productId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.outletId = :outletId")
    List<StockMovement> findByOutletId(@Param("outletId") Long outletId);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.referenceType = :referenceType AND sm.referenceId = :referenceId")
    List<StockMovement> findByReference(@Param("referenceType") String referenceType, @Param("referenceId") String referenceId);
} 