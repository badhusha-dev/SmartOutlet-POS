package com.smartoutlet.common.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartoutlet.common.dto.ApiResponseDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Set;

/**
 * Dynamic Authorization Filter
 * Intercepts requests and checks permissions based on user roles and API endpoints
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DynamicAuthorizationFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Public endpoints that don't require authorization
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/swagger-ui.html",
        "/actuator/health",
        "/actuator/info",
        "/h2-console/**",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/forgot-password",
        "/api/auth/reset-password"
    );

    // Admin-only endpoints
    private static final List<String> ADMIN_ONLY_ENDPOINTS = List.of(
        "/api/auth/users/**",
        "/api/auth/roles/**",
        "/api/system/**",
        "/api/audit/**",
        "/api/reports/admin/**"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        log.debug("Dynamic authorization check for {} {}", method, requestURI);

        // Check if it's a public endpoint
        if (isPublicEndpoint(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get authentication from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            sendUnauthorizedResponse(response, "Authentication required");
            return;
        }

        // Check if user has required permissions
        if (!hasRequiredPermissions(authentication, method, requestURI)) {
            sendForbiddenResponse(response, "Insufficient permissions");
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Check if the endpoint is public (no authorization required)
     */
    private boolean isPublicEndpoint(String requestURI) {
        return PUBLIC_ENDPOINTS.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, requestURI));
    }

    /**
     * Check if the endpoint is admin-only
     */
    private boolean isAdminOnlyEndpoint(String requestURI) {
        return ADMIN_ONLY_ENDPOINTS.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, requestURI));
    }

    /**
     * Check if user has required permissions for the request
     */
    private boolean hasRequiredPermissions(Authentication authentication, String method, String requestURI) {
        // Get user roles
        Set<String> userRoles = getUserRoles(authentication);
        
        if (userRoles.isEmpty()) {
            log.warn("No roles found for user: {}", authentication.getName());
            return false;
        }

        // Check if it's an admin-only endpoint
        if (isAdminOnlyEndpoint(requestURI)) {
            boolean hasAdminRole = userRoles.stream()
                    .anyMatch(role -> AuthorizationConfig.ROLE_ADMIN.equals(role));
            
            if (!hasAdminRole) {
                log.warn("Admin-only endpoint accessed by non-admin user: {} - {}", 
                        authentication.getName(), requestURI);
                return false;
            }
        }

        // Check permissions for the specific API endpoint
        String apiKey = method + " " + requestURI;
        String requiredPermission = AuthorizationConfig.API_PERMISSIONS.get(apiKey);
        if (requiredPermission == null) {
            // Use default permission based on path
            requiredPermission = AuthorizationConfig.getDefaultPermission(requestURI);
        }
        final String finalRequiredPermission = requiredPermission;

        // Check if any of the user's roles have the required permission
        boolean hasPermission = userRoles.stream()
                .anyMatch(role -> AuthorizationConfig.hasPermission(role, finalRequiredPermission));

        if (!hasPermission) {
            log.warn("Permission denied for user: {} - {} {} (required: {})", 
                    authentication.getName(), method, requestURI, finalRequiredPermission);
        }

        return hasPermission;
    }

    /**
     * Extract user roles from authentication
     */
    private Set<String> getUserRoles(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(Object::toString)
                .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * Send unauthorized response
     */
    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        ApiResponseDTO<Object> errorResponse = ApiResponseDTO.error(message);
        
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    /**
     * Send forbidden response
     */
    private void sendForbiddenResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        ApiResponseDTO<Object> errorResponse = ApiResponseDTO.error(message);
        
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        
        // Don't filter static resources
        return requestURI.startsWith("/static/") || 
               requestURI.startsWith("/css/") || 
               requestURI.startsWith("/js/") || 
               requestURI.startsWith("/images/") ||
               requestURI.startsWith("/favicon.ico");
    }
} 