package com.smartoutlet.product.infrastructure.persistence;

import com.smartoutlet.product.entity.ErrorLog;
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
public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long> {
    
    // Basic query methods
    List<ErrorLog> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    
    List<ErrorLog> findByErrorTypeOrderByCreatedAtDesc(String errorType);
    
    @Query("SELECT e FROM ErrorLog e WHERE e.errorMessage LIKE %:keyword% OR e.stackTrace LIKE %:keyword%")
    List<ErrorLog> findByKeyword(@Param("keyword") String keyword);
    
    Page<ErrorLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    @Query("SELECT COUNT(e) FROM ErrorLog e WHERE e.createdAt >= :since")
    long countErrorsSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT e.errorType, COUNT(e) FROM ErrorLog e WHERE e.createdAt >= :since GROUP BY e.errorType")
    List<Object[]> getErrorTypeCountsSince(@Param("since") LocalDateTime since);
    
    // Additional methods needed by ErrorLogService
    Optional<ErrorLog> findByErrorMessageAndActionPerformedAndRequestUrl(String errorMessage, String actionPerformed, String requestUrl);
    
    List<ErrorLog> findByErrorType(String errorType);
    
    List<ErrorLog> findByActionPerformed(String actionPerformed);
    
    List<ErrorLog> findByUserId(Long userId);
    
    List<ErrorLog> findByUsername(String username);
    
    List<ErrorLog> findByIsResolvedFalse();
    
    @Query("SELECT e FROM ErrorLog e WHERE e.occurrenceCount >= :minOccurrences ORDER BY e.occurrenceCount DESC")
    List<ErrorLog> findHighOccurrenceErrors(@Param("minOccurrences") Integer minOccurrences);
    
    List<ErrorLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<ErrorLog> findByErrorMessageContainingIgnoreCase(String errorMessage);
    
    @Query("SELECT e FROM ErrorLog e ORDER BY e.occurrenceCount DESC")
    Page<ErrorLog> findMostFrequentErrors(Pageable pageable);
    
    @Query("SELECT e FROM ErrorLog e WHERE e.createdAt >= :since ORDER BY e.createdAt DESC")
    List<ErrorLog> findRecentErrors(@Param("since") LocalDateTime since);
    
    @Query("SELECT e.errorType, COUNT(e) FROM ErrorLog e GROUP BY e.errorType ORDER BY COUNT(e) DESC")
    List<Object[]> countErrorsByType();
    
    @Query("SELECT e.actionPerformed, COUNT(e) FROM ErrorLog e GROUP BY e.actionPerformed ORDER BY COUNT(e) DESC")
    List<Object[]> countErrorsByAction();
    
    @Query("SELECT e FROM ErrorLog e WHERE e.errorType = :errorType AND e.createdAt BETWEEN :startDate AND :endDate")
    List<ErrorLog> findByErrorTypeAndDateRange(@Param("errorType") String errorType, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e.actionPerformed, COUNT(e), SUM(e.occurrenceCount) FROM ErrorLog e GROUP BY e.actionPerformed ORDER BY COUNT(e) DESC")
    List<Object[]> getErrorStatisticsByAction();
    
    List<ErrorLog> findByFileNameOrderByLastOccurrenceDesc(String fileName);
    
    List<ErrorLog> findByLineNumberOrderByLastOccurrenceDesc(Integer lineNumber);
    
    List<ErrorLog> findByFileNameAndLineNumberOrderByLastOccurrenceDesc(String fileName, Integer lineNumber);
    
    @Query("SELECT e.fileName, COUNT(e), SUM(e.occurrenceCount) FROM ErrorLog e WHERE e.fileName IS NOT NULL GROUP BY e.fileName ORDER BY COUNT(e) DESC")
    List<Object[]> getErrorStatisticsByFile();
} 