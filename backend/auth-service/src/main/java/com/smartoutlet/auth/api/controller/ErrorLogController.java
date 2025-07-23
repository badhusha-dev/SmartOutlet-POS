package com.smartoutlet.auth.api.controller;

import com.smartoutlet.auth.domain.model.ErrorLog;
import com.smartoutlet.auth.application.service.ErrorLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/error-logs")
@RequiredArgsConstructor
public class ErrorLogController {
    
    private final ErrorLogService errorLogService;
    
    /**
     * Get all unresolved errors
     */
    @GetMapping("/unresolved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getUnresolvedErrors() {
        List<ErrorLog> errors = errorLogService.getUnresolvedErrors();
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get errors by type
     */
    @GetMapping("/type/{errorType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getErrorsByType(@PathVariable String errorType) {
        List<ErrorLog> errors = errorLogService.getErrorsByType(errorType);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get errors by action
     */
    @GetMapping("/action/{actionPerformed}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getErrorsByAction(@PathVariable String actionPerformed) {
        List<ErrorLog> errors = errorLogService.getErrorsByAction(actionPerformed);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get high occurrence errors
     */
    @GetMapping("/high-occurrence")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getHighOccurrenceErrors(
            @RequestParam(defaultValue = "5") Integer threshold) {
        List<ErrorLog> errors = errorLogService.getHighOccurrenceErrors(threshold);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get recent errors
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getRecentErrors(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        List<ErrorLog> errors = errorLogService.getRecentErrors(since);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get error statistics by type
     */
    @GetMapping("/statistics/type")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Object[]>> getErrorStatisticsByType() {
        List<Object[]> statistics = errorLogService.getErrorStatisticsByType();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get error statistics by action
     */
    @GetMapping("/statistics/action")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Object[]>> getErrorStatisticsByAction() {
        List<Object[]> statistics = errorLogService.getErrorStatisticsByAction();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get most frequent errors
     */
    @GetMapping("/most-frequent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getMostFrequentErrors(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<ErrorLog> errors = errorLogService.getMostFrequentErrors(limit);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Get errors within date range
     */
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> getErrorsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ErrorLog> errors = errorLogService.getErrorsByDateRange(startDate, endDate);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Search errors by message content
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ErrorLog>> searchErrorsByMessage(@RequestParam String searchTerm) {
        List<ErrorLog> errors = errorLogService.searchErrorsByMessage(searchTerm);
        return ResponseEntity.ok(errors);
    }
    
    /**
     * Mark error as resolved
     */
    @PutMapping("/{errorId}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ErrorLog> markAsResolved(
            @PathVariable Long errorId,
            @RequestParam String resolutionNotes) {
        ErrorLog errorLog = errorLogService.markAsResolved(errorId, resolutionNotes);
        if (errorLog != null) {
            return ResponseEntity.ok(errorLog);
        } else {
            return ResponseEntity.notFound().build();
        }
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