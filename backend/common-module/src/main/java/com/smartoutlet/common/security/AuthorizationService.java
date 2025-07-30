package com.smartoutlet.common.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Authorization Service
 * Provides methods to check permissions programmatically
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorizationService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${outlet.service.url:http://localhost:8082}")
    private String outletServiceUrl;

    /**
     * Check if current user has a specific permission
     */
    public boolean hasPermission(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Set<String> userRoles = getUserRoles(authentication);
        return userRoles.stream()
                .anyMatch(role -> AuthorizationConfig.hasPermission(role, permission));
    }

    /**
     * Check if current user has any of the specified permissions
     */
    public boolean hasAnyPermission(String... permissions) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Set<String> userRoles = getUserRoles(authentication);
        return userRoles.stream()
                .anyMatch(role -> {
                    for (String permission : permissions) {
                        if (AuthorizationConfig.hasPermission(role, permission)) {
                            return true;
                        }
                    }
                    return false;
                });
    }

    /**
     * Check if current user has all of the specified permissions
     */
    public boolean hasAllPermissions(String... permissions) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Set<String> userRoles = getUserRoles(authentication);
        for (String permission : permissions) {
            boolean hasPermission = userRoles.stream()
                    .anyMatch(role -> AuthorizationConfig.hasPermission(role, permission));
            if (!hasPermission) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if current user has a specific role
     */
    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Set<String> userRoles = getUserRoles(authentication);
        return userRoles.contains(role);
    }

    /**
     * Check if current user has any of the specified roles
     */
    public boolean hasAnyRole(String... roles) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Set<String> userRoles = getUserRoles(authentication);
        for (String role : roles) {
            if (userRoles.contains(role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if current user has admin role
     */
    public boolean isAdmin() {
        return hasRole(AuthorizationConfig.ROLE_ADMIN);
    }

    /**
     * Check if current user has manager role
     */
    public boolean isManager() {
        return hasRole(AuthorizationConfig.ROLE_MANAGER);
    }

    /**
     * Check if current user has staff role
     */
    public boolean isStaff() {
        return hasRole(AuthorizationConfig.ROLE_STAFF);
    }

    /**
     * Check if current user has cashier role
     */
    public boolean isCashier() {
        return hasRole(AuthorizationConfig.ROLE_CASHIER);
    }

    /**
     * Check if current user has kitchen role
     */
    public boolean isKitchen() {
        return hasRole(AuthorizationConfig.ROLE_KITCHEN);
    }

    /**
     * Get current user's roles
     */
    public Set<String> getCurrentUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Set.of();
        }
        return getUserRoles(authentication);
    }

    /**
     * Get current user's permissions
     */
    public Set<String> getCurrentUserPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Set.of();
        }

        Set<String> userRoles = getUserRoles(authentication);
        return userRoles.stream()
                .flatMap(role -> AuthorizationConfig.getRolePermissions(role).stream())
                .collect(Collectors.toSet());
    }

    /**
     * Check if current user can access a specific resource
     */
    public boolean canAccessResource(String resource, String action) {
        String permission = resource + "_" + action.toUpperCase();
        return hasPermission(permission);
    }

    /**
     * Check if current user can read a specific resource
     */
    public boolean canRead(String resource) {
        return canAccessResource(resource, "READ");
    }

    /**
     * Check if current user can write to a specific resource
     */
    public boolean canWrite(String resource) {
        return canAccessResource(resource, "WRITE");
    }

    /**
     * Check if current user can delete a specific resource
     */
    public boolean canDelete(String resource) {
        return canAccessResource(resource, "DELETE");
    }

    /**
     * Check if current user can administer a specific resource
     */
    public boolean canAdmin(String resource) {
        return canAccessResource(resource, "ADMIN");
    }

    /**
     * Extract user roles from authentication
     */
    private Set<String> getUserRoles(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(Object::toString)
                .collect(Collectors.toSet());
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof JwtUserDetails userDetails) {
            return userDetails.getUserId();
        }
        return null;
    }
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof JwtUserDetails userDetails) {
            return userDetails.getUsername();
        }
        return null;
    }

    /**
     * Validate if current user can access outlet-specific data
     */
    public boolean canAccessOutlet(Long outletId) {
        if (isAdmin()) {
            return true;
        }
        Long userId = getCurrentUserId();
        if (userId == null) return false;
        if (isManager()) {
            // Check if manager is assigned to this outlet
            String url = outletServiceUrl + "/api/outlets/" + outletId + "/staff";
            try {
                StaffAssignmentResponse[] staff = restTemplate.getForObject(url, StaffAssignmentResponse[].class);
                if (staff != null) {
                    for (StaffAssignmentResponse s : staff) {
                        if (s.getUserId().equals(userId)) return true;
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to check outlet assignment: {}", e.getMessage());
            }
            return false;
        }
        if (isStaff() || isCashier() || isKitchen()) {
            // Check if staff/cashier/kitchen is assigned to this outlet
            String url = outletServiceUrl + "/api/outlets/" + outletId + "/staff";
            try {
                StaffAssignmentResponse[] staff = restTemplate.getForObject(url, StaffAssignmentResponse[].class);
                if (staff != null) {
                    for (StaffAssignmentResponse s : staff) {
                        if (s.getUserId().equals(userId)) return true;
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to check outlet assignment: {}", e.getMessage());
            }
            return false;
        }
        return false;
    }

    /**
     * Check if current user can modify data created by another user
     */
    public boolean canModifyUserData(String dataOwnerUsername) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        String currentUsername = getCurrentUsername();
        if (currentUsername != null && currentUsername.equals(dataOwnerUsername)) {
            return true;
        }
        if (isAdmin()) {
            return true;
        }
        if (isManager()) {
            // Check if manager and staff are assigned to the same outlet
            Long managerId = getCurrentUserId();
            if (managerId == null) return false;
            String url = outletServiceUrl + "/api/outlets/user/" + managerId;
            try {
                StaffAssignmentResponse[] managerAssignments = restTemplate.getForObject(url, StaffAssignmentResponse[].class);
                if (managerAssignments != null) {
                    for (StaffAssignmentResponse assignment : managerAssignments) {
                        // For each outlet the manager is assigned to, check if the staff is also assigned
                        String staffUrl = outletServiceUrl + "/api/outlets/" + assignment.getOutletId() + "/staff";
                        StaffAssignmentResponse[] staff = restTemplate.getForObject(staffUrl, StaffAssignmentResponse[].class);
                        if (staff != null) {
                            for (StaffAssignmentResponse s : staff) {
                                if (s.getUsername().equals(dataOwnerUsername)) return true;
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to check outlet-based permission: {}", e.getMessage());
            }
            return false;
        }
        return false;
    }

    /**
     * Log authorization check for audit purposes
     */
    public void logAuthorizationCheck(String permission, boolean granted) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : "anonymous";
        
        log.info("Authorization check - User: {}, Permission: {}, Granted: {}", 
                username, permission, granted);
    }
} 