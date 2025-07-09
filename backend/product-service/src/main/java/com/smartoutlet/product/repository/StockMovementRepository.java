package com.smartoutlet.product.repository;

import com.smartoutlet.product.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    
    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    Page<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    
    List<StockMovement> findByOutletIdOrderByCreatedAtDesc(Long outletId);
    
    Page<StockMovement> findByOutletIdOrderByCreatedAtDesc(Long outletId, Pageable pageable);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.createdAt BETWEEN :startDate AND :endDate ORDER BY sm.createdAt DESC")
    Page<StockMovement> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate, 
                                       Pageable pageable);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.movementType = :movementType ORDER BY sm.createdAt DESC")
    Page<StockMovement> findByMovementType(@Param("movementType") StockMovement.MovementType movementType, 
                                          Pageable pageable);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.referenceType = :referenceType ORDER BY sm.createdAt DESC")
    List<StockMovement> findByReferenceType(@Param("referenceType") String referenceType);
    
    @Query("SELECT sm FROM StockMovement sm WHERE sm.referenceId = :referenceId ORDER BY sm.createdAt DESC")
    List<StockMovement> findByReferenceId(@Param("referenceId") String referenceId);
    
    @Query("SELECT SUM(sm.quantity) FROM StockMovement sm WHERE sm.product.id = :productId AND sm.movementType = 'IN'")
    Long getTotalStockIn(@Param("productId") Long productId);
    
    @Query("SELECT SUM(sm.quantity) FROM StockMovement sm WHERE sm.product.id = :productId AND sm.movementType = 'OUT'")
    Long getTotalStockOut(@Param("productId") Long productId);
}