package com.smartoutlet.auth.application.service;

import com.smartoutlet.auth.domain.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service("permissionService")
@RequiredArgsConstructor
@Slf4j
public class PermissionService {

    /**
     * Check if the current user has a specific permission
     * Can be used in @PreAuthorize("@permissionService.canAccess('USER_CREATE')")
     */
    public boolean canAccess(String permission) {
        try {
            User user = getCurrentUser();
            return user.getPermissionNames().contains(permission);
        } catch (Exception e) {
            log.warn("Error checking permission {}: {}", permission, e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user has any of the specified permissions
     * Can be used in @PreAuthorize("@permissionService.hasAnyPermission('USER_CREATE', 'USER_UPDATE')")
     */
    public boolean hasAnyPermission(String... permissions) {
        try {
            User user = getCurrentUser();
            Set<String> userPermissions = user.getPermissionNames();
            
            for (String permission : permissions) {
                if (userPermissions.contains(permission)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.warn("Error checking permissions {}: {}", String.join(", ", permissions), e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user has all of the specified permissions
     * Can be used in @PreAuthorize("@permissionService.hasAllPermissions('USER_CREATE', 'USER_UPDATE')")
     */
    public boolean hasAllPermissions(String... permissions) {
        try {
            User user = getCurrentUser();
            Set<String> userPermissions = user.getPermissionNames();
            
            for (String permission : permissions) {
                if (!userPermissions.contains(permission)) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            log.warn("Error checking permissions {}: {}", String.join(", ", permissions), e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user has a specific role
     * Can be used in @PreAuthorize("@permissionService.hasRole('ADMIN')")
     */
    public boolean hasRole(String role) {
        try {
            User user = getCurrentUser();
            return user.getRoleNames().contains(role);
        } catch (Exception e) {
            log.warn("Error checking role {}: {}", role, e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user has any of the specified roles
     * Can be used in @PreAuthorize("@permissionService.hasAnyRole('ADMIN', 'MANAGER')")
     */
    public boolean hasAnyRole(String... roles) {
        try {
            User user = getCurrentUser();
            Set<String> userRoles = user.getRoleNames();
            
            for (String role : roles) {
                if (userRoles.contains(role)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.warn("Error checking roles {}: {}", String.join(", ", roles), e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user can access a resource action combination
     * Can be used in @PreAuthorize("@permissionService.canAccessResource('USER', 'CREATE')")
     */
    public boolean canAccessResource(String resource, String action) {
        String permission = resource + "_" + action;
        return canAccess(permission);
    }

    /**
     * Check if the current user is the owner of a resource or has admin privileges
     * Can be used in @PreAuthorize("@permissionService.isOwnerOrAdmin(#userId)")
     */
    public boolean isOwnerOrAdmin(Long resourceOwnerId) {
        try {
            User user = getCurrentUser();
            
            // If user is admin, allow access
            if (user.getRoleNames().contains("ADMIN")) {
                return true;
            }
            
            // If user is the owner, allow access
            return user.getId().equals(resourceOwnerId);
        } catch (Exception e) {
            log.warn("Error checking ownership for user {}: {}", resourceOwnerId, e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user is in the same department or has higher privileges
     * Can be used in @PreAuthorize("@permissionService.canAccessDepartment(#targetDepartment)")
     */
    public boolean canAccessDepartment(String targetDepartment) {
        try {
            User user = getCurrentUser();
            
            // Admin and Manager can access all departments
            if (user.getRoleNames().contains("ADMIN") || user.getRoleNames().contains("MANAGER")) {
                return true;
            }
            
            // User can access their own department
            return user.getDepartment() != null && user.getDepartment().equals(targetDepartment);
        } catch (Exception e) {
            log.warn("Error checking department access for {}: {}", targetDepartment, e.getMessage());
            return false;
        }
    }

    /**
     * Check if the current user has minimum role level (hierarchy-based)
     * Can be used in @PreAuthorize("@permissionService.hasMinimumRoleLevel(2)")
     */
    public boolean hasMinimumRoleLevel(Integer minLevel) {
        try {
            User user = getCurrentUser();
            
            Integer userLevel = user.getRoles().stream()
                    .mapToInt(role -> role.getHierarchyLevel() != null ? role.getHierarchyLevel() : Integer.MAX_VALUE)
                    .min()
                    .orElse(Integer.MAX_VALUE);
                    
            return userLevel <= minLevel;
        } catch (Exception e) {
            log.warn("Error checking role level {}: {}", minLevel, e.getMessage());
            return false;
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        throw new RuntimeException("No authenticated user found");
    }
}