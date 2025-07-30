package com.smartoutlet.auth.api.controller;

import com.smartoutlet.auth.application.service.AuthService;
import com.smartoutlet.auth.dto.request.LoginRequest;
import com.smartoutlet.auth.dto.request.RegisterRequest;
import com.smartoutlet.auth.dto.response.AuthResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
        summary = "User Login",
        description = "Authenticate user and return JWT token with user details and permissions"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for username: {}", loginRequest.getUsername());
        
        AuthResponse authResponse = authService.login(loginRequest);
        
        log.info("Login successful for username: {}", loginRequest.getUsername());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    @Operation(
        summary = "User Registration",
        description = "Register a new user and return JWT token"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Registration successful"),
        @ApiResponse(responseCode = "400", description = "Invalid request data or user already exists"),
        @ApiResponse(responseCode = "409", description = "Username or email already exists")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("Registration attempt for username: {}", registerRequest.getUsername());
        
        AuthResponse authResponse = authService.register(registerRequest);
        
        log.info("Registration successful for username: {}", registerRequest.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @GetMapping("/me")
    @Operation(
        summary = "Get Current User",
        description = "Get details of the currently authenticated user"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User details retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        try {
            var user = authService.getCurrentUser();
            
            Map<String, Object> userInfo = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "department", user.getDepartment() != null ? user.getDepartment() : "",
                "position", user.getPosition() != null ? user.getPosition() : "",
                "roles", user.getRoleNames(),
                "permissions", user.getPermissionNames(),
                "lastLoginAt", user.getLastLoginAt()
            );
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            log.error("Error getting current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/check-permission")
    @Operation(
        summary = "Check Permission",
        description = "Check if the current user has a specific permission"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Permission check completed"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<Map<String, Object>> checkPermission(@RequestBody Map<String, String> request) {
        String permission = request.get("permission");
        boolean hasPermission = authService.hasPermission(permission);
        
        Map<String, Object> response = Map.of(
            "permission", permission,
            "hasPermission", hasPermission
        );
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-role")
    @Operation(
        summary = "Check Role",
        description = "Check if the current user has a specific role"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Role check completed"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<Map<String, Object>> checkRole(@RequestBody Map<String, String> request) {
        String role = request.get("role");
        boolean hasRole = authService.hasRole(role);
        
        Map<String, Object> response = Map.of(
            "role", role,
            "hasRole", hasRole
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin-only")
    @PreAuthorize("@permissionService.hasRole('ADMIN')")
    @Operation(
        summary = "Admin Only Endpoint",
        description = "Example endpoint that requires ADMIN role"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Access granted"),
        @ApiResponse(responseCode = "403", description = "Access denied - insufficient privileges")
    })
    public ResponseEntity<Map<String, String>> adminOnly() {
        return ResponseEntity.ok(Map.of(
            "message", "This endpoint is accessible only to ADMIN users",
            "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }

    @GetMapping("/manager-or-admin")
    @PreAuthorize("@permissionService.hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(
        summary = "Manager or Admin Endpoint",
        description = "Example endpoint that requires ADMIN or MANAGER role"
    )
    public ResponseEntity<Map<String, String>> managerOrAdmin() {
        return ResponseEntity.ok(Map.of(
            "message", "This endpoint is accessible to ADMIN and MANAGER users",
            "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }

    @GetMapping("/sale-access")
    @PreAuthorize("@permissionService.canAccess('SALE_CREATE')")
    @Operation(
        summary = "Sale Access Endpoint",
        description = "Example endpoint that requires SALE_CREATE permission"
    )
    public ResponseEntity<Map<String, String>> saleAccess() {
        return ResponseEntity.ok(Map.of(
            "message", "This endpoint requires SALE_CREATE permission",
            "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }
}