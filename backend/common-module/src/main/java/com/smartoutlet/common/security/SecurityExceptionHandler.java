package com.smartoutlet.common.security;

import com.smartoutlet.common.dto.ApiResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class SecurityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(SecurityExceptionHandler.class);

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponseDTO<String>> handleAuthenticationException(AuthenticationException e) {
        logger.warn("Authentication failed: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDTO.error("Authentication failed", "UNAUTHORIZED"));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponseDTO<String>> handleBadCredentialsException(BadCredentialsException e) {
        logger.warn("Bad credentials: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDTO.error("Invalid username or password", "BAD_CREDENTIALS"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponseDTO<String>> handleAccessDeniedException(AccessDeniedException e) {
        logger.warn("Access denied: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponseDTO.error("Access denied", "FORBIDDEN"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDTO<String>> handleGenericException(Exception e) {
        logger.error("Unexpected error occurred", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDTO.error("An unexpected error occurred", "INTERNAL_ERROR"));
    }
} 