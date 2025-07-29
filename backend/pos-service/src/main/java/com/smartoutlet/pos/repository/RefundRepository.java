package com.smartoutlet.pos.repository;

import com.smartoutlet.pos.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    
    List<Refund> findByOriginalTransactionId(Long originalTransactionId);
    
    List<Refund> findByCustomerId(Long customerId);
    
    List<Refund> findByStatus(Refund.RefundStatus status);
    
    List<Refund> findByProcessedBy(String processedBy);
    
    List<Refund> findByProcessedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT r FROM Refund r WHERE r.customer.id = :customerId AND r.processedAt >= :startDate")
    List<Refund> findByCustomerIdAndProcessedAtAfter(@Param("customerId") Long customerId, 
                                                    @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(r.refundAmount) FROM Refund r WHERE r.status = 'PROCESSED' AND r.processedAt BETWEEN :startDate AND :endDate")
    Double getTotalRefundsForPeriod(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(r) FROM Refund r WHERE r.status = 'PROCESSED' AND r.processedAt BETWEEN :startDate AND :endDate")
    Long getRefundCountForPeriod(@Param("startDate") LocalDateTime startDate, 
                                @Param("endDate") LocalDateTime endDate);
} 