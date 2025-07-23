package com.smartoutlet.expense.api.controller;

import com.smartoutlet.expense.domain.model.ErrorLog;
import com.smartoutlet.expense.application.service.ErrorLogService;
import com.smartoutlet.expense.api.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/error-logs")
@RequiredArgsConstructor
@Slf4j
public class ErrorLogController {

    private final ErrorLogService errorLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getAllErrorLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ErrorLog> errorLogs = errorLogService.getAllErrorLogs(pageable);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs retrieved successfully");
        response.setData(errorLogs.getContent());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ErrorLog>> getErrorLogById(@PathVariable Long id) {
        return errorLogService.getErrorLogById(id)
                .map(errorLog -> {
                    ApiResponse<ErrorLog> response = new ApiResponse<>();
                    response.setSuccess(true);
                    response.setMessage("Error log retrieved successfully");
                    response.setData(errorLog);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-error-type/{errorType}")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByType(@PathVariable String errorType) {
        List<ErrorLog> errorLogs = errorLogService.getErrorsByType(errorType);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by type retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-status/{isResolved}")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByStatus(@PathVariable boolean isResolved) {
        List<ErrorLog> errorLogs = isResolved ? 
            errorLogService.getAllErrorLogs(PageRequest.of(0, Integer.MAX_VALUE)).getContent() :
            errorLogService.getUnresolvedErrors();
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by status retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<ErrorLog> errorLogs = errorLogService.getErrorsByDateRange(startDateTime, endDateTime);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by date range retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByUser(@PathVariable Long userId) {
        List<ErrorLog> errorLogs = errorLogService.getErrorsByUser(userId);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by user retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-username/{username}")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByUsername(@PathVariable String username) {
        List<ErrorLog> errorLogs = errorLogService.getErrorsByUsername(username);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by username retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-ip/{ipAddress}")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByIpAddress(@PathVariable String ipAddress) {
        List<ErrorLog> errorLogs = errorLogService.getErrorsByIpAddress(ipAddress);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by IP address retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-url/{requestUrl}")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByRequestUrl(@PathVariable String requestUrl) {
        List<ErrorLog> errorLogs = errorLogService.getErrorsByRequestUrl(requestUrl);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by request URL retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-method/{requestMethod}")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByRequestMethod(@PathVariable String requestMethod) {
        List<ErrorLog> errorLogs = errorLogService.getErrorsByRequestMethod(requestMethod);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by request method retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-status-code/{responseStatus}")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> getErrorLogsByResponseStatus(@PathVariable Integer responseStatus) {
        List<ErrorLog> errorLogs = errorLogService.getErrorsByResponseStatus(responseStatus);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs by response status retrieved successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ErrorLog>>> searchErrorLogs(@RequestParam String keyword) {
        List<ErrorLog> errorLogs = errorLogService.searchErrorsByMessage(keyword);
        
        ApiResponse<List<ErrorLog>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs search completed successfully");
        response.setData(errorLogs);
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<ErrorLog>> resolveErrorLog(
            @PathVariable Long id,
            @RequestParam String resolutionNotes) {
        
        try {
            ErrorLog errorLog = errorLogService.markAsResolved(id, resolutionNotes);
            
            ApiResponse<ErrorLog> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Error log resolved successfully");
            response.setData(errorLog);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ApiResponse<ErrorLog> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error log not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteErrorLog(@PathVariable Long id) {
        errorLogService.deleteErrorLog(id);
        
        ApiResponse<Void> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error log deleted successfully");
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/bulk-delete")
    public ResponseEntity<ApiResponse<Void>> bulkDeleteErrorLogs(@RequestBody List<Long> ids) {
        ids.forEach(errorLogService::deleteErrorLog);
        
        ApiResponse<Void> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error logs deleted successfully");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Object>> getErrorLogStatistics() {
        Object statistics = errorLogService.getErrorStatistics();
        
        ApiResponse<Object> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Error log statistics retrieved successfully");
        response.setData(statistics);
        
        return ResponseEntity.ok(response);
    }
} 