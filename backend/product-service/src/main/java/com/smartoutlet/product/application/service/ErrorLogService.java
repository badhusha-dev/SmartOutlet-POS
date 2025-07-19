package com.smartoutlet.product.application.service;

import com.smartoutlet.product.entity.ErrorLog;
import com.smartoutlet.product.infrastructure.persistence.ErrorLogRepository;
import com.smartoutlet.product.util.StackTraceUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ErrorLogService {
    
    private final ErrorLogRepository errorLogRepository;
    
    /**
     * Log an error with automatic duplicate detection and occurrence counting
     */
    @Transactional
    public ErrorLog logError(String errorMessage, String errorType, String actionPerformed, 
                           Long userId, String username, String ipAddress, String userAgent,
                           String stackTrace, String requestUrl, String requestMethod,
                           String requestBody, Integer responseStatus) {
        
        // Extract file name and line number from stack trace
        String fileName = StackTraceUtil.extractFileName(stackTrace);
        Integer lineNumber = StackTraceUtil.extractLineNumber(stackTrace);
        
        // Check for existing similar error (same message, action, and URL)
        Optional<ErrorLog> existingError = errorLogRepository.findByErrorMessageAndActionPerformedAndRequestUrl(errorMessage, actionPerformed, requestUrl);
        
        if (existingError.isPresent()) {
            // Increment occurrence count for existing error
            ErrorLog error = existingError.get();
            error.incrementOccurrenceCount();
            error.setLastOccurrence(LocalDateTime.now());
            return errorLogRepository.save(error);
        } else {
            // Create new error log entry
            ErrorLog errorLog = ErrorLog.builder()
                    .errorMessage(errorMessage)
                    .errorType(errorType)
                    .actionPerformed(actionPerformed)
                    .userId(userId)
                    .username(username)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .stackTrace(stackTrace)
                    .requestUrl(requestUrl)
                    .requestMethod(requestMethod)
                    .requestBody(requestBody)
                    .responseStatus(responseStatus)
                    .fileName(fileName)
                    .lineNumber(lineNumber)
                    .build();
            
            return errorLogRepository.save(errorLog);
        }
    }
    
    /**
     * Get all error logs with pagination
     */
    public Page<ErrorLog> getAllErrorLogs(Pageable pageable) {
        return errorLogRepository.findAll(pageable);
    }
    
    /**
     * Get error log by ID
     */
    public Optional<ErrorLog> getErrorLogById(Long id) {
        return errorLogRepository.findById(id);
    }
    
    /**
     * Get errors by type
     */
    public List<ErrorLog> getErrorsByType(String errorType) {
        return errorLogRepository.findByErrorType(errorType);
    }
    
    /**
     * Get errors by action performed
     */
    public List<ErrorLog> getErrorsByAction(String actionPerformed) {
        return errorLogRepository.findByActionPerformed(actionPerformed);
    }
    
    /**
     * Get errors by user
     */
    public List<ErrorLog> getErrorsByUser(Long userId) {
        return errorLogRepository.findByUserId(userId);
    }
    
    /**
     * Get errors by username
     */
    public List<ErrorLog> getErrorsByUsername(String username) {
        return errorLogRepository.findByUsername(username);
    }
    
    /**
     * Get unresolved errors
     */
    public List<ErrorLog> getUnresolvedErrors() {
        return errorLogRepository.findByIsResolvedFalse();
    }
    
    /**
     * Get errors with high occurrence count
     */
    public List<ErrorLog> getHighOccurrenceErrors(Integer minOccurrences) {
        return errorLogRepository.findHighOccurrenceErrors(minOccurrences);
    }
    
    /**
     * Get errors within date range
     */
    public List<ErrorLog> getErrorsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return errorLogRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    /**
     * Search errors by message
     */
    public List<ErrorLog> searchErrorsByMessage(String errorMessage) {
        return errorLogRepository.findByErrorMessageContainingIgnoreCase(errorMessage);
    }
    
    /**
     * Get most frequent errors
     */
    public Page<ErrorLog> getMostFrequentErrors(Pageable pageable) {
        return errorLogRepository.findMostFrequentErrors(pageable);
    }
    
    /**
     * Get recent errors
     */
    public List<ErrorLog> getRecentErrors(LocalDateTime since) {
        return errorLogRepository.findRecentErrors(since);
    }
    
    /**
     * Mark error as resolved
     */
    @Transactional
    public ErrorLog markAsResolved(Long errorId, String resolutionNotes) {
        Optional<ErrorLog> errorOpt = errorLogRepository.findById(errorId);
        if (errorOpt.isPresent()) {
            ErrorLog error = errorOpt.get();
            error.markAsResolved(resolutionNotes);
            return errorLogRepository.save(error);
        }
        throw new RuntimeException("Error log not found with ID: " + errorId);
    }
    
    /**
     * Delete error log
     */
    @Transactional
    public void deleteErrorLog(Long errorId) {
        errorLogRepository.deleteById(errorId);
    }
    
    /**
     * Get error statistics
     */
    public Map<String, Object> getErrorStatistics() {
        long totalErrors = errorLogRepository.count();
        long unresolvedErrors = errorLogRepository.findByIsResolvedFalse().size();
        long highOccurrenceErrors = errorLogRepository.findHighOccurrenceErrors(5).size();
        
        List<Object[]> errorsByType = errorLogRepository.countErrorsByType();
        List<Object[]> errorsByAction = errorLogRepository.countErrorsByAction();
        
        return Map.of(
            "totalErrors", totalErrors,
            "unresolvedErrors", unresolvedErrors,
            "highOccurrenceErrors", highOccurrenceErrors,
            "errorsByType", errorsByType,
            "errorsByAction", errorsByAction
        );
    }
    
    /**
     * Get errors by type and date range
     */
    public List<ErrorLog> getErrorsByTypeAndDateRange(String errorType, LocalDateTime startDate, LocalDateTime endDate) {
        return errorLogRepository.findByErrorTypeAndDateRange(errorType, startDate, endDate);
    }
    
    /**
     * Get error statistics by action
     */
    public List<Object[]> getErrorStatisticsByAction() {
        return errorLogRepository.getErrorStatisticsByAction();
    }
    
    /**
     * Get errors by file name
     */
    public List<ErrorLog> getErrorsByFileName(String fileName) {
        return errorLogRepository.findByFileNameOrderByLastOccurrenceDesc(fileName);
    }
    
    /**
     * Get errors by line number
     */
    public List<ErrorLog> getErrorsByLineNumber(Integer lineNumber) {
        return errorLogRepository.findByLineNumberOrderByLastOccurrenceDesc(lineNumber);
    }
    
    /**
     * Get errors by file name and line number
     */
    public List<ErrorLog> getErrorsByFileAndLine(String fileName, Integer lineNumber) {
        return errorLogRepository.findByFileNameAndLineNumberOrderByLastOccurrenceDesc(fileName, lineNumber);
    }
    
    /**
     * Get error statistics by file
     */
    public List<Object[]> getErrorStatisticsByFile() {
        return errorLogRepository.getErrorStatisticsByFile();
    }
} 