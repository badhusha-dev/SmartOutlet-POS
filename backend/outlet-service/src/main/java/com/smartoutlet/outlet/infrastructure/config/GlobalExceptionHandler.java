package com.smartoutlet.outlet.infrastructure.config;

import com.smartoutlet.outlet.api.dto.ApiResponse;
import com.smartoutlet.outlet.domain.model.ErrorLog;
import com.smartoutlet.outlet.application.service.ErrorLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    
    private final ErrorLogService errorLogService;
    
    @ExceptionHandler(OutletNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleOutletNotFoundException(OutletNotFoundException ex, HttpServletRequest request) {
        log.error("Outlet not found: {}", ex.getMessage());
        
        // Log error to database
        logErrorToDatabase(ex, "OutletNotFoundException", "Outlet lookup", request, HttpStatus.NOT_FOUND.value());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(OutletAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleOutletAlreadyExistsException(OutletAlreadyExistsException ex, HttpServletRequest request) {
        log.error("Outlet already exists: {}", ex.getMessage());
        
        // Log error to database
        logErrorToDatabase(ex, "OutletAlreadyExistsException", "Outlet creation", request, HttpStatus.CONFLICT.value());
        
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        log.error("Validation failed: {}", errors);
        
        // Log error to database
        logErrorToDatabase(ex, "ValidationException", "Data validation", request, HttpStatus.BAD_REQUEST.value());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, "Validation failed", errors));
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        log.error("Runtime exception: {}", ex.getMessage(), ex);
        
        // Log error to database
        logErrorToDatabase(ex, "RuntimeException", "General operation", request, HttpStatus.BAD_REQUEST.value());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        
        // Log error to database
        logErrorToDatabase(ex, "UnexpectedException", "General operation", request, HttpStatus.INTERNAL_SERVER_ERROR.value());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred"));
    }
    
    /**
     * Helper method to log errors to database
     */
    private void logErrorToDatabase(Exception ex, String errorType, String actionPerformed, 
                                   HttpServletRequest request, Integer responseStatus) {
        try {
            // Get request information
            String requestUrl = request.getRequestURL().toString();
            String requestMethod = request.getMethod();
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            // Get stack trace
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            ex.printStackTrace(pw);
            String stackTrace = sw.toString();
            
            // Log to database
            errorLogService.logError(
                ex.getMessage(),
                errorType,
                actionPerformed,
                null, // userId - not available without security
                "anonymous", // username - not available without security
                ipAddress,
                userAgent,
                stackTrace,
                requestUrl,
                requestMethod,
                null, // request body - could be extracted if needed
                responseStatus
            );
        } catch (Exception logEx) {
            log.error("Failed to log error to database: {}", logEx.getMessage());
        }
    }
    
    /**
     * Helper method to get client IP address
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
}