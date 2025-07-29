package com.smartoutlet.product.api.controller;

import com.smartoutlet.product.entity.ErrorLog;
import com.smartoutlet.product.application.service.ErrorLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/error-logs")
@RequiredArgsConstructor
public class ErrorLogController {
    
    private final ErrorLogService errorLogService;
    
    /**
     * Get all error logs with pagination
     */
    @GetMapping
    public ResponseEntity<Page<ErrorLog>> getAllErrorLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(errorLogService.getAllErrorLogs(pageable));
    }
    
    /**
     * Get error log by ID
     */
    @GetMapping("/{errorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ErrorLog> getErrorLogById(@PathVariable Long errorId) {
        // This would require adding findById method to service
        // For now, returning not found
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Get errors by type
     */
    @GetMapping("/type/{errorType}")
    public ResponseEntity<List<ErrorLog>> getErrorsByType(@PathVariable String errorType) {
        return ResponseEntity.ok(errorLogService.getErrorsByType(errorType));
    }
    
    /**
     * Get errors by action performed
     */
    @GetMapping("/action/{actionPerformed}")
    public ResponseEntity<List<ErrorLog>> getErrorsByAction(@PathVariable String actionPerformed) {
        return ResponseEntity.ok(errorLogService.getErrorsByAction(actionPerformed));
    }
    
    /**
     * Get errors by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ErrorLog>> getErrorsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(errorLogService.getErrorsByUser(userId));
    }
    
    /**
     * Get errors by username
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<List<ErrorLog>> getErrorsByUsername(@PathVariable String username) {
        return ResponseEntity.ok(errorLogService.getErrorsByUsername(username));
    }
    
    /**
     * Get unresolved errors
     */
    @GetMapping("/unresolved")
    public ResponseEntity<List<ErrorLog>> getUnresolvedErrors() {
        return ResponseEntity.ok(errorLogService.getUnresolvedErrors());
    }
    
    /**
     * Get errors with high occurrence count
     */
    @GetMapping("/high-occurrence")
    public ResponseEntity<List<ErrorLog>> getHighOccurrenceErrors(
            @RequestParam(defaultValue = "5") Integer minOccurrences) {
        return ResponseEntity.ok(errorLogService.getHighOccurrenceErrors(minOccurrences));
    }
    
    /**
     * Get errors within date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<ErrorLog>> getErrorsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(errorLogService.getErrorsByDateRange(startDate, endDate));
    }
    
    /**
     * Search errors by message
     */
    @GetMapping("/search")
    public ResponseEntity<List<ErrorLog>> searchErrorsByMessage(@RequestParam String errorMessage) {
        return ResponseEntity.ok(errorLogService.searchErrorsByMessage(errorMessage));
    }
    
    /**
     * Get most frequent errors
     */
    @GetMapping("/most-frequent")
    public ResponseEntity<Page<ErrorLog>> getMostFrequentErrors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(errorLogService.getMostFrequentErrors(pageable));
    }
    
    /**
     * Get recent errors
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ErrorLog>> getRecentErrors(
            @RequestParam(defaultValue = "24") Integer hoursAgo) {
        LocalDateTime since = LocalDateTime.now().minusHours(hoursAgo);
        return ResponseEntity.ok(errorLogService.getRecentErrors(since));
    }
    
    /**
     * Mark error as resolved
     */
    @PutMapping("/{id}/resolve")
    public ResponseEntity<ErrorLog> markAsResolved(
            @PathVariable Long id,
            @RequestParam String resolutionNotes) {
        try {
            ErrorLog resolvedError = errorLogService.markAsResolved(id, resolutionNotes);
            return ResponseEntity.ok(resolvedError);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete error log
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteErrorLog(@PathVariable Long id) {
        errorLogService.deleteErrorLog(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get error statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getErrorStatistics() {
        return ResponseEntity.ok(errorLogService.getErrorStatistics());
    }
    
    /**
     * Get errors by type and date range
     */
    @GetMapping("/type/{errorType}/date-range")
    public ResponseEntity<List<ErrorLog>> getErrorsByTypeAndDateRange(
            @PathVariable String errorType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(errorLogService.getErrorsByTypeAndDateRange(errorType, startDate, endDate));
    }
    
    /**
     * Get errors by file name
     */
    @GetMapping("/file/{fileName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getErrorsByFileName(@PathVariable String fileName) {
        List<ErrorLog> errors = errorLogService.getErrorsByFileName(fileName);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get errors by line number
     */
    @GetMapping("/line/{lineNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getErrorsByLineNumber(@PathVariable Integer lineNumber) {
        List<ErrorLog> errors = errorLogService.getErrorsByLineNumber(lineNumber);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get errors by file name and line number
     */
    @GetMapping("/file/{fileName}/line/{lineNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getErrorsByFileAndLine(
            @PathVariable String fileName,
            @PathVariable Integer lineNumber) {
        List<ErrorLog> errors = errorLogService.getErrorsByFileAndLine(fileName, lineNumber);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get error statistics by file
     */
    @GetMapping("/statistics/file")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Object[]>> getErrorStatisticsByFile() {
        List<Object[]> statistics = errorLogService.getErrorStatisticsByFile();
        return ResponseEntity.ok(statistics);
    }
} 