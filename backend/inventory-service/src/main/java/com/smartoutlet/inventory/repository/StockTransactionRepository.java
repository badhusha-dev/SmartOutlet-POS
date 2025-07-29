package com.smartoutlet.inventory.repository;

import com.smartoutlet.inventory.entity.StockTransaction;
import com.smartoutlet.inventory.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    
    // Find by inventory item
    List<StockTransaction> findByInventoryItemIdOrderByCreatedAtDesc(Long inventoryItemId);
    
    // Find by transaction type
    List<StockTransaction> findByTransactionTypeOrderByCreatedAtDesc(TransactionType transactionType);
    
    // Find by reference
    List<StockTransaction> findByReferenceTypeAndReferenceId(String referenceType, String referenceId);
    
    // Find by date range
    List<StockTransaction> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    
    // Find by outlet and date range
    @Query("SELECT t FROM StockTransaction t JOIN t.inventoryItem i " +
           "WHERE i.outletId = :outletId AND t.createdAt BETWEEN :start AND :end " +
           "ORDER BY t.createdAt DESC")
    List<StockTransaction> findByOutletAndDateRange(@Param("outletId") Long outletId,
                                                   @Param("start") LocalDateTime start,
                                                   @Param("end") LocalDateTime end);
    
    // Find by product and date range
    @Query("SELECT t FROM StockTransaction t JOIN t.inventoryItem i " +
           "WHERE i.productId = :productId AND t.createdAt BETWEEN :start AND :end " +
           "ORDER BY t.createdAt DESC")
    List<StockTransaction> findByProductAndDateRange(@Param("productId") Long productId,
                                                    @Param("start") LocalDateTime start,
                                                    @Param("end") LocalDateTime end);
    
    // Search with filters and pagination
    @Query("SELECT t FROM StockTransaction t JOIN t.inventoryItem i WHERE " +
           "(:outletId IS NULL OR i.outletId = :outletId) AND " +
           "(:productId IS NULL OR i.productId = :productId) AND " +
           "(:transactionType IS NULL OR t.transactionType = :transactionType) AND " +
           "(:start IS NULL OR t.createdAt >= :start) AND " +
           "(:end IS NULL OR t.createdAt <= :end)")
    Page<StockTransaction> findWithFilters(@Param("outletId") Long outletId,
                                         @Param("productId") Long productId,
                                         @Param("transactionType") TransactionType transactionType,
                                         @Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end,
                                         Pageable pageable);
    
    // Get transaction summary by type and date range
    @Query("SELECT t.transactionType, COUNT(t), SUM(t.quantity) " +
           "FROM StockTransaction t WHERE t.createdAt BETWEEN :start AND :end " +
           "GROUP BY t.transactionType")
    List<Object[]> getTransactionSummary(@Param("start") LocalDateTime start,
                                        @Param("end") LocalDateTime end);
    
    // Get recent transactions for a product
    @Query("SELECT t FROM StockTransaction t JOIN t.inventoryItem i " +
           "WHERE i.productId = :productId ORDER BY t.createdAt DESC")
    Page<StockTransaction> findRecentByProduct(@Param("productId") Long productId, Pageable pageable);
}