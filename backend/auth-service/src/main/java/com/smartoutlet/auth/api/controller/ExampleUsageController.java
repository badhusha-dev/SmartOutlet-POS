package com.smartoutlet.auth.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/examples")
@RequiredArgsConstructor
@Tag(name = "Example Usage", description = "Examples of different authorization patterns")
@SecurityRequirement(name = "bearer-key")
public class ExampleUsageController {

    @GetMapping("/public")
    @Operation(summary = "Public Endpoint", description = "This endpoint is accessible without authentication")
    public ResponseEntity<Map<String, String>> publicEndpoint() {
        return ResponseEntity.ok(Map.of(
            "message", "This is a public endpoint - no authentication required",
            "access", "public"
        ));
    }

    @GetMapping("/authenticated")
    @Operation(summary = "Authenticated Only", description = "Requires valid JWT token")
    public ResponseEntity<Map<String, String>> authenticatedOnly() {
        return ResponseEntity.ok(Map.of(
            "message", "You are authenticated with a valid JWT token",
            "access", "authenticated"
        ));
    }

    @GetMapping("/admin-only")
    @PreAuthorize("@permissionService.hasRole('ADMIN')")
    @Operation(summary = "Admin Role Required", description = "Requires ADMIN role")
    public ResponseEntity<Map<String, String>> adminOnly() {
        return ResponseEntity.ok(Map.of(
            "message", "You have ADMIN role access",
            "access", "admin"
        ));
    }

    @GetMapping("/manager-or-admin")
    @PreAuthorize("@permissionService.hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Manager or Admin", description = "Requires ADMIN or MANAGER role")
    public ResponseEntity<Map<String, String>> managerOrAdmin() {
        return ResponseEntity.ok(Map.of(
            "message", "You have MANAGER or ADMIN role access",
            "access", "manager-or-admin"
        ));
    }

    @PostMapping("/create-user")
    @PreAuthorize("@permissionService.canAccess('USER_CREATE')")
    @Operation(summary = "Create User Permission", description = "Requires USER_CREATE permission")
    public ResponseEntity<Map<String, String>> createUser() {
        return ResponseEntity.ok(Map.of(
            "message", "You have USER_CREATE permission",
            "action", "create-user"
        ));
    }

    @GetMapping("/read-user")
    @PreAuthorize("@permissionService.canAccess('USER_READ')")
    @Operation(summary = "Read User Permission", description = "Requires USER_READ permission")
    public ResponseEntity<Map<String, String>> readUser() {
        return ResponseEntity.ok(Map.of(
            "message", "You have USER_READ permission",
            "action", "read-user"
        ));
    }

    @PutMapping("/update-user")
    @PreAuthorize("@permissionService.canAccess('USER_UPDATE')")
    @Operation(summary = "Update User Permission", description = "Requires USER_UPDATE permission")
    public ResponseEntity<Map<String, String>> updateUser() {
        return ResponseEntity.ok(Map.of(
            "message", "You have USER_UPDATE permission",
            "action", "update-user"
        ));
    }

    @DeleteMapping("/delete-user")
    @PreAuthorize("@permissionService.canAccess('USER_DELETE')")
    @Operation(summary = "Delete User Permission", description = "Requires USER_DELETE permission")
    public ResponseEntity<Map<String, String>> deleteUser() {
        return ResponseEntity.ok(Map.of(
            "message", "You have USER_DELETE permission",
            "action", "delete-user"
        ));
    }

    @GetMapping("/user-or-sales-permissions")
    @PreAuthorize("@permissionService.hasAnyPermission('USER_READ', 'SALE_READ')")
    @Operation(summary = "Multiple Permissions (ANY)", description = "Requires USER_READ OR SALE_READ permission")
    public ResponseEntity<Map<String, String>> userOrSalesPermissions() {
        return ResponseEntity.ok(Map.of(
            "message", "You have either USER_READ or SALE_READ permission",
            "access", "user-or-sales"
        ));
    }

    @GetMapping("/user-and-sales-permissions")
    @PreAuthorize("@permissionService.hasAllPermissions('USER_READ', 'SALE_READ')")
    @Operation(summary = "Multiple Permissions (ALL)", description = "Requires USER_READ AND SALE_READ permissions")
    public ResponseEntity<Map<String, String>> userAndSalesPermissions() {
        return ResponseEntity.ok(Map.of(
            "message", "You have both USER_READ and SALE_READ permissions",
            "access", "user-and-sales"
        ));
    }

    @GetMapping("/resource-action/{resource}/{action}")
    @PreAuthorize("@permissionService.canAccessResource(#resource, #action)")
    @Operation(summary = "Dynamic Resource Access", description = "Check access to any resource-action combination")
    public ResponseEntity<Map<String, String>> resourceAction(
            @PathVariable String resource, 
            @PathVariable String action) {
        return ResponseEntity.ok(Map.of(
            "message", String.format("You have %s_%s permission", resource, action),
            "resource", resource,
            "action", action
        ));
    }

    @GetMapping("/owner-or-admin/{userId}")
    @PreAuthorize("@permissionService.isOwnerOrAdmin(#userId)")
    @Operation(summary = "Owner or Admin Access", description = "Access granted if user is owner or has admin role")
    public ResponseEntity<Map<String, String>> ownerOrAdmin(@PathVariable Long userId) {
        return ResponseEntity.ok(Map.of(
            "message", "You are either the owner of this resource or have admin privileges",
            "userId", userId.toString()
        ));
    }

    @GetMapping("/department-access/{department}")
    @PreAuthorize("@permissionService.canAccessDepartment(#department)")
    @Operation(summary = "Department Access", description = "Access granted if user belongs to department or has higher privileges")
    public ResponseEntity<Map<String, String>> departmentAccess(@PathVariable String department) {
        return ResponseEntity.ok(Map.of(
            "message", "You have access to this department",
            "department", department
        ));
    }

    @GetMapping("/minimum-role-level/{level}")
    @PreAuthorize("@permissionService.hasMinimumRoleLevel(#level)")
    @Operation(summary = "Role Hierarchy", description = "Access granted if user has minimum role level")
    public ResponseEntity<Map<String, String>> minimumRoleLevel(@PathVariable Integer level) {
        return ResponseEntity.ok(Map.of(
            "message", "You have sufficient role level for this operation",
            "minimumLevel", level.toString()
        ));
    }
}