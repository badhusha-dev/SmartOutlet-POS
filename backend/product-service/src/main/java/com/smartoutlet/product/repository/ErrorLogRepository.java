package com.smartoutlet.product.repository;

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
    
    // Find by error type
    List<ErrorLog> findByErrorType(String errorType);
    
    // Find by action performed
    List<ErrorLog> findByActionPerformed(String actionPerformed);
    
    // Find by user
    List<ErrorLog> findByUserId(Long userId);
    
    // Find by username
    List<ErrorLog> findByUsername(String username);
    
    // Find unresolved errors
    List<ErrorLog> findByIsResolvedFalse();
    
    // Find by occurrence count greater than threshold
    List<ErrorLog> findByOccurrenceCountGreaterThan(Integer threshold);
    
    // Find errors within date range
    List<ErrorLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find errors by error message (partial match)
    List<ErrorLog> findByErrorMessageContainingIgnoreCase(String errorMessage);
    
    // Find most frequent errors
    @Query("SELECT e FROM ErrorLog e ORDER BY e.occurrenceCount DESC")
    Page<ErrorLog> findMostFrequentErrors(Pageable pageable);
    
    // Find errors by error type and date range
    @Query("SELECT e FROM ErrorLog e WHERE e.errorType = :errorType AND e.createdAt BETWEEN :startDate AND :endDate")
    List<ErrorLog> findByErrorTypeAndDateRange(@Param("errorType") String errorType, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    // Find similar errors (same error message, action, and URL)
    @Query("SELECT e FROM ErrorLog e WHERE e.errorMessage = :errorMessage AND e.actionPerformed = :actionPerformed AND e.requestUrl = :requestUrl")
    Optional<ErrorLog> findByErrorMessageAndActionAndUrl(@Param("errorMessage") String errorMessage, 
                                                         @Param("actionPerformed") String actionPerformed,
                                                         @Param("requestUrl") String requestUrl);
    
    // Count errors by type
    @Query("SELECT e.errorType, COUNT(e) FROM ErrorLog e GROUP BY e.errorType ORDER BY COUNT(e) DESC")
    List<Object[]> countErrorsByType();
    
    // Count errors by action
    @Query("SELECT e.actionPerformed, COUNT(e) FROM ErrorLog e GROUP BY e.actionPerformed ORDER BY COUNT(e) DESC")
    List<Object[]> countErrorsByAction();
    
    // Find errors with high occurrence count
    @Query("SELECT e FROM ErrorLog e WHERE e.occurrenceCount >= :minOccurrences ORDER BY e.occurrenceCount DESC")
    List<ErrorLog> findHighOccurrenceErrors(@Param("minOccurrences") Integer minOccurrences);
    
    // Find recent errors
    @Query("SELECT e FROM ErrorLog e WHERE e.createdAt >= :since ORDER BY e.createdAt DESC")
    List<ErrorLog> findRecentErrors(@Param("since") LocalDateTime since);
    
    /**
     * Get error statistics by file
     */
    @Query("SELECT e.fileName, COUNT(e), SUM(e.occurrenceCount) FROM ErrorLog e WHERE e.fileName IS NOT NULL GROUP BY e.fileName ORDER BY COUNT(e) DESC")
    List<Object[]> getErrorStatisticsByFile();
    
    /**
     * Get error statistics by action
     */
    @Query("SELECT e.actionPerformed, COUNT(e), SUM(e.occurrenceCount) FROM ErrorLog e GROUP BY e.actionPerformed ORDER BY COUNT(e) DESC")
    List<Object[]> getErrorStatisticsByAction();
    
    /**
     * Find errors by file name
     */
    List<ErrorLog> findByFileNameOrderByLastOccurrenceDesc(String fileName);
    
    /**
     * Find errors by line number
     */
    List<ErrorLog> findByLineNumberOrderByLastOccurrenceDesc(Integer lineNumber);
    
    /**
     * Find errors by file name and line number
     */
    List<ErrorLog> findByFileNameAndLineNumberOrderByLastOccurrenceDesc(String fileName, Integer lineNumber);
} 