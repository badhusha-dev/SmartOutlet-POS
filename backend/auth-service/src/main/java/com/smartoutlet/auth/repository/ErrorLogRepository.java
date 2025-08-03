package com.smartoutlet.auth.repository;

import com.smartoutlet.auth.domain.entity.ErrorLog;
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

    Optional<ErrorLog> findByErrorMessageAndActionPerformedAndRequestUrl(String errorMessage, String actionPerformed, String requestUrl);
    
    List<ErrorLog> findByErrorType(String errorType);
    
    List<ErrorLog> findByActionPerformed(String actionPerformed);
    
    List<ErrorLog> findByUserId(Long userId);
    
    List<ErrorLog> findByUsername(String username);
    
    List<ErrorLog> findByIsResolvedFalse();
    
    @Query("SELECT e FROM ErrorLog e WHERE e.occurrenceCount >= :minOccurrences")
    List<ErrorLog> findHighOccurrenceErrors(@Param("minOccurrences") Integer minOccurrences);
    
    List<ErrorLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<ErrorLog> findByErrorMessageContainingIgnoreCase(String errorMessage);
    
    @Query("SELECT e FROM ErrorLog e ORDER BY e.occurrenceCount DESC")
    Page<ErrorLog> findMostFrequentErrors(Pageable pageable);
    
    List<ErrorLog> findByLastOccurrenceAfter(LocalDateTime since);
    
    @Query("SELECT e FROM ErrorLog e WHERE e.lastOccurrence > :since")
    List<ErrorLog> findRecentErrors(@Param("since") LocalDateTime since);
    
    @Query("SELECT e.errorType, COUNT(e) FROM ErrorLog e GROUP BY e.errorType")
    List<Object[]> countErrorsByType();
    
    @Query("SELECT e.actionPerformed, COUNT(e) FROM ErrorLog e GROUP BY e.actionPerformed")
    List<Object[]> countErrorsByAction();
    
    @Query("SELECT e FROM ErrorLog e WHERE e.errorType = :errorType AND e.createdAt BETWEEN :startDate AND :endDate")
    List<ErrorLog> findByErrorTypeAndDateRange(@Param("errorType") String errorType, 
                                              @Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e.actionPerformed, COUNT(e), AVG(e.occurrenceCount) FROM ErrorLog e GROUP BY e.actionPerformed")
    List<Object[]> getErrorStatisticsByAction();
    
    List<ErrorLog> findByFileNameOrderByLastOccurrenceDesc(String fileName);
    
    List<ErrorLog> findByLineNumberOrderByLastOccurrenceDesc(Integer lineNumber);
    
    List<ErrorLog> findByFileNameAndLineNumberOrderByLastOccurrenceDesc(String fileName, Integer lineNumber);
    
    @Query("SELECT e.fileName, COUNT(e), AVG(e.occurrenceCount) FROM ErrorLog e GROUP BY e.fileName")
    List<Object[]> getErrorStatisticsByFile();
    
    List<ErrorLog> findByIpAddress(String ipAddress);
    
    List<ErrorLog> findByRequestUrl(String requestUrl);
    
    List<ErrorLog> findByRequestMethod(String requestMethod);
    
    List<ErrorLog> findByResponseStatus(Integer responseStatus);
} 