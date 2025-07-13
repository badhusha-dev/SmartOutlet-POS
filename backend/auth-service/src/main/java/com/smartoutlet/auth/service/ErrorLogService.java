package com.smartoutlet.auth.service;

import com.smartoutlet.auth.entity.ErrorLog;
import com.smartoutlet.auth.entity.User;
import com.smartoutlet.auth.repository.ErrorLogRepository;
import com.smartoutlet.auth.util.StackTraceUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ErrorLogService {
    
    private final ErrorLogRepository errorLogRepository;
    
    /**
     * Log an error with automatic duplicate detection and occurrence counting
     */
    @Transactional
    public ErrorLog logError(String errorMessage, String errorType, String actionPerformed, 
                           Exception exception, HttpServletRequest request, User user) {
        
        try {
            String requestUrl = null;
            if (request != null) {
                requestUrl = request.getRequestURL().toString();
            }
            
            // Get stack trace and extract file info
            String stackTrace = getStackTrace(exception);
            String fileName = StackTraceUtil.extractFileName(stackTrace);
            Integer lineNumber = StackTraceUtil.extractLineNumber(stackTrace);
            
            // Check if similar error already exists (same message, action, and URL)
            Optional<ErrorLog> existingError = errorLogRepository.findByErrorMessageAndActionAndUrl(
                errorMessage, actionPerformed, requestUrl);
            
            if (existingError.isPresent()) {
                // Increment occurrence count for existing error
                ErrorLog errorLog = existingError.get();
                errorLog.incrementOccurrenceCount();
                errorLog.setLastOccurrence(LocalDateTime.now());
                
                // Update additional context if available
                if (request != null) {
                    errorLog.setIpAddress(getClientIpAddress(request));
                    errorLog.setUserAgent(request.getHeader("User-Agent"));
                    errorLog.setRequestUrl(request.getRequestURL().toString());
                    errorLog.setRequestMethod(request.getMethod());
                }
                
                if (user != null) {
                    errorLog.setUser(user);
                    errorLog.setUsername(user.getUsername());
                }
                
                return errorLogRepository.save(errorLog);
            } else {
                // Create new error log entry
                ErrorLog errorLog = ErrorLog.builder()
                        .errorMessage(errorMessage)
                        .errorType(errorType)
                        .actionPerformed(actionPerformed)
                        .stackTrace(stackTrace)
                        .fileName(fileName)
                        .lineNumber(lineNumber)
                        .build();
                
                // Add request context
                if (request != null) {
                    errorLog.setIpAddress(getClientIpAddress(request));
                    errorLog.setUserAgent(request.getHeader("User-Agent"));
                    errorLog.setRequestUrl(request.getRequestURL().toString());
                    errorLog.setRequestMethod(request.getMethod());
                    errorLog.setRequestBody(getRequestBody(request));
                }
                
                // Add user context
                if (user != null) {
                    errorLog.setUser(user);
                    errorLog.setUsername(user.getUsername());
                }
                
                return errorLogRepository.save(errorLog);
            }
        } catch (Exception e) {
            log.error("Failed to log error: {}", e.getMessage(), e);
            return null;
        }
    }
    
    /**
     * Log an error without exception (for business logic errors)
     */
    @Transactional
    public ErrorLog logError(String errorMessage, String errorType, String actionPerformed, 
                           HttpServletRequest request, User user) {
        return logError(errorMessage, errorType, actionPerformed, null, request, user);
    }
    
    /**
     * Mark an error as resolved
     */
    @Transactional
    public ErrorLog markAsResolved(Long errorId, String resolutionNotes) {
        Optional<ErrorLog> errorLogOpt = errorLogRepository.findById(errorId);
        if (errorLogOpt.isPresent()) {
            ErrorLog errorLog = errorLogOpt.get();
            errorLog.markAsResolved(resolutionNotes);
            return errorLogRepository.save(errorLog);
        }
        return null;
    }
    
    /**
     * Get all unresolved errors
     */
    public List<ErrorLog> getUnresolvedErrors() {
        return errorLogRepository.findByIsResolvedFalse();
    }
    
    /**
     * Get errors by type
     */
    public List<ErrorLog> getErrorsByType(String errorType) {
        return errorLogRepository.findByErrorType(errorType);
    }
    
    /**
     * Get errors by action
     */
    public List<ErrorLog> getErrorsByAction(String actionPerformed) {
        return errorLogRepository.findByActionPerformed(actionPerformed);
    }
    
    /**
     * Get high occurrence errors (occurrence count >= threshold)
     */
    public List<ErrorLog> getHighOccurrenceErrors(Integer threshold) {
        return errorLogRepository.findHighOccurrenceErrors(threshold);
    }
    
    /**
     * Get recent errors (within specified time)
     */
    public List<ErrorLog> getRecentErrors(LocalDateTime since) {
        return errorLogRepository.findRecentErrors(since);
    }
    
    /**
     * Get error statistics by type
     */
    public List<Object[]> getErrorStatisticsByType() {
        return errorLogRepository.countErrorsByType();
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
    
    /**
     * Get most frequent errors
     */
    public List<ErrorLog> getMostFrequentErrors(int limit) {
        return errorLogRepository.findMostFrequentErrors(
            org.springframework.data.domain.PageRequest.of(0, limit)
        ).getContent();
    }
    
    /**
     * Get errors within date range
     */
    public List<ErrorLog> getErrorsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return errorLogRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    /**
     * Search errors by message content
     */
    public List<ErrorLog> searchErrorsByMessage(String searchTerm) {
        return errorLogRepository.findByErrorMessageContainingIgnoreCase(searchTerm);
    }
    
    /**
     * Get client IP address from request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    /**
     * Get request body (if available)
     */
    private String getRequestBody(HttpServletRequest request) {
        // Note: This is a simplified version. In a real implementation,
        // you might want to use a request wrapper to capture the body
        return "Request body capture not implemented";
    }
    
    /**
     * Get stack trace from exception
     */
    private String getStackTrace(Exception exception) {
        if (exception == null) {
            return null;
        }
        
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        exception.printStackTrace(pw);
        return sw.toString();
    }
} 