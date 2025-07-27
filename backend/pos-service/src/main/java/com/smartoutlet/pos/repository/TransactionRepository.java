package com.smartoutlet.pos.repository;

import com.smartoutlet.pos.entity.Transaction;
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
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionNumber(String transactionNumber);
    
    Optional<Transaction> findByReceiptNumber(String receiptNumber);
    
    Page<Transaction> findByOutletId(Long outletId, Pageable pageable);
    
    Page<Transaction> findByCashierId(Long cashierId, Pageable pageable);
    
    Page<Transaction> findByCustomerId(Long customerId, Pageable pageable);
    
    Page<Transaction> findByStatus(Transaction.TransactionStatus status, Pageable pageable);
    
    Page<Transaction> findByTransactionType(Transaction.TransactionType transactionType, Pageable pageable);
    
    Page<Transaction> findByPaymentMethod(Transaction.PaymentMethod paymentMethod, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.createdAt BETWEEN :startDate AND :endDate")
    Page<Transaction> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate, 
                                     Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.outletId = :outletId AND t.createdAt BETWEEN :startDate AND :endDate")
    Page<Transaction> findByOutletIdAndDateRange(@Param("outletId") Long outletId,
                                                @Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate,
                                                Pageable pageable);
    
    @Query("SELECT SUM(t.totalAmount) FROM Transaction t WHERE t.outletId = :outletId AND t.status = 'COMPLETED'")
    Double getTotalSalesByOutlet(@Param("outletId") Long outletId);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.outletId = :outletId AND t.status = 'COMPLETED'")
    Long getTransactionCountByOutlet(@Param("outletId") Long outletId);
    
    @Query("SELECT t FROM Transaction t WHERE t.customerId = :customerId ORDER BY t.createdAt DESC")
    List<Transaction> findRecentTransactionsByCustomer(@Param("customerId") Long customerId, Pageable pageable);
    
    boolean existsByTransactionNumber(String transactionNumber);
    
    boolean existsByReceiptNumber(String receiptNumber);
} 