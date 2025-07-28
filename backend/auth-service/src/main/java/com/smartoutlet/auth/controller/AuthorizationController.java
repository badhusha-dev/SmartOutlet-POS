package com.smartoutlet.auth.controller;

import com.smartoutlet.common.dto.ApiResponseDTO;
import com.smartoutlet.common.security.AuthorizationConfig;
import com.smartoutlet.common.security.AuthorizationService;
import com.smartoutlet.common.security.annotations.RequireAdmin;
import com.smartoutlet.common.security.annotations.RequireAnyPermission;
import com.smartoutlet.common.security.annotations.RequirePermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth/authorization")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authorization", description = "Dynamic authorization management and testing")
public class AuthorizationController {

    private final AuthorizationService authorizationService;

    @GetMapping("/current-user/permissions")
    @Operation(summary = "Get current user permissions", description = "Retrieves all permissions for the current user")
    @RequirePermission("USERS_READ")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> getCurrentUserPermissions() {
        Set<String> roles = authorizationService.getCurrentUserRoles();
        Set<String> permissions = authorizationService.getCurrentUserPermissions();
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("roles", roles);
        userInfo.put("permissions", permissions);
        userInfo.put("isAdmin", authorizationService.isAdmin());
        userInfo.put("isManager", authorizationService.isManager());
        userInfo.put("isStaff", authorizationService.isStaff());
        userInfo.put("isCashier", authorizationService.isCashier());
        userInfo.put("isKitchen", authorizationService.isKitchen());
        
        return ResponseEntity.ok(ApiResponseDTO.success("Current user permissions retrieved", userInfo));
    }

    @GetMapping("/test/permission/{permission}")
    @Operation(summary = "Test specific permission", description = "Tests if current user has a specific permission")
    @RequirePermission("USERS_READ")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> testPermission(@PathVariable String permission) {
        boolean hasPermission = authorizationService.hasPermission(permission);
        
        Map<String, Object> result = new HashMap<>();
        result.put("permission", permission);
        result.put("hasPermission", hasPermission);
        result.put("isValidPermission", AuthorizationConfig.isValidPermission(permission));
        
        return ResponseEntity.ok(ApiResponseDTO.success("Permission test completed", result));
    }

    @GetMapping("/test/role/{role}")
    @Operation(summary = "Test specific role", description = "Tests if current user has a specific role")
    @RequirePermission("USERS_READ")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> testRole(@PathVariable String role) {
        boolean hasRole = authorizationService.hasRole(role);
        
        Map<String, Object> result = new HashMap<>();
        result.put("role", role);
        result.put("hasRole", hasRole);
        result.put("isValidRole", AuthorizationConfig.isValidRole(role));
        
        return ResponseEntity.ok(ApiResponseDTO.success("Role test completed", result));
    }

    @GetMapping("/test/resource/{resource}/{action}")
    @Operation(summary = "Test resource access", description = "Tests if current user can perform action on resource")
    @RequirePermission("USERS_READ")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> testResourceAccess(
            @PathVariable String resource,
            @PathVariable String action) {
        
        boolean canAccess = authorizationService.canAccessResource(resource, action);
        
        Map<String, Object> result = new HashMap<>();
        result.put("resource", resource);
        result.put("action", action);
        result.put("canAccess", canAccess);
        result.put("permission", resource + "_" + action.toUpperCase());
        
        return ResponseEntity.ok(ApiResponseDTO.success("Resource access test completed", result));
    }

    @GetMapping("/admin-only")
    @Operation(summary = "Admin only endpoint", description = "This endpoint requires admin role")
    @RequireAdmin
    public ResponseEntity<ApiResponseDTO<String>> adminOnlyEndpoint() {
        return ResponseEntity.ok(ApiResponseDTO.success("Admin access granted", "This is admin-only content"));
    }

    @GetMapping("/manager-or-admin")
    @Operation(summary = "Manager or admin endpoint", description = "This endpoint requires manager or admin role")
    @RequireAnyPermission({"OUTLETS_READ", "USERS_READ"})
    public ResponseEntity<ApiResponseDTO<String>> managerOrAdminEndpoint() {
        return ResponseEntity.ok(ApiResponseDTO.success("Manager/Admin access granted", "This is manager/admin content"));
    }

    @GetMapping("/staff-permissions")
    @Operation(summary = "Staff permissions endpoint", description = "This endpoint requires staff permissions")
    @RequireAnyPermission({"PRODUCTS_READ", "TRANSACTIONS_READ", "CUSTOMERS_READ"})
    public ResponseEntity<ApiResponseDTO<String>> staffPermissionsEndpoint() {
        return ResponseEntity.ok(ApiResponseDTO.success("Staff access granted", "This is staff content"));
    }

    @GetMapping("/cashier-permissions")
    @Operation(summary = "Cashier permissions endpoint", description = "This endpoint requires cashier permissions")
    @RequireAnyPermission({"TRANSACTIONS_WRITE", "CUSTOMERS_WRITE"})
    public ResponseEntity<ApiResponseDTO<String>> cashierPermissionsEndpoint() {
        return ResponseEntity.ok(ApiResponseDTO.success("Cashier access granted", "This is cashier content"));
    }

    @GetMapping("/kitchen-permissions")
    @Operation(summary = "Kitchen permissions endpoint", description = "This endpoint requires kitchen permissions")
    @RequireAnyPermission({"PRODUCTS_READ", "INVENTORY_READ"})
    public ResponseEntity<ApiResponseDTO<String>> kitchenPermissionsEndpoint() {
        return ResponseEntity.ok(ApiResponseDTO.success("Kitchen access granted", "This is kitchen content"));
    }

    @GetMapping("/all-permissions")
    @Operation(summary = "All permissions endpoint", description = "This endpoint requires all specified permissions")
    @RequireAnyPermission({"USERS_READ", "USERS_WRITE", "USERS_ADMIN"})
    public ResponseEntity<ApiResponseDTO<String>> allPermissionsEndpoint() {
        return ResponseEntity.ok(ApiResponseDTO.success("All permissions granted", "This requires multiple permissions"));
    }

    @GetMapping("/system-info")
    @Operation(summary = "System information", description = "Get system authorization information")
    @RequirePermission("SYSTEM_READ")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> getSystemInfo() {
        Map<String, Object> systemInfo = new HashMap<>();
        systemInfo.put("availableRoles", AuthorizationConfig.ROLE_PERMISSIONS.keySet());
        systemInfo.put("rolePermissions", AuthorizationConfig.ROLE_PERMISSIONS);
        systemInfo.put("apiPermissions", AuthorizationConfig.API_PERMISSIONS);
        
        return ResponseEntity.ok(ApiResponseDTO.success("System information retrieved", systemInfo));
    }
} 