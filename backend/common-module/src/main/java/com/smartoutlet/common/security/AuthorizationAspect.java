package com.smartoutlet.common.security;

import com.smartoutlet.common.security.annotations.RequirePermission;
import com.smartoutlet.common.security.annotations.RequireAnyPermission;
import com.smartoutlet.common.security.annotations.RequireAllPermissions;
import com.smartoutlet.common.security.annotations.RequireRole;
import com.smartoutlet.common.security.annotations.RequireAnyRole;
import com.smartoutlet.common.security.annotations.RequireAdmin;
import com.smartoutlet.common.security.annotations.RequireManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

/**
 * Authorization Aspect
 * Provides method-level authorization using AOP
 */
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthorizationAspect {

    private final AuthorizationService authorizationService;

    /**
     * Check permission before method execution
     */
    @Before("@annotation(com.smartoutlet.common.security.annotations.RequirePermission)")
    public void checkPermission(JoinPoint joinPoint) {
        RequirePermission annotation = getRequirePermissionAnnotation(joinPoint);
        if (annotation != null) {
            String permission = annotation.value();
            if (!authorizationService.hasPermission(permission)) {
                log.warn("Permission denied for method: {} - required permission: {}", 
                        joinPoint.getSignature().getName(), permission);
                throw new AccessDeniedException("Insufficient permissions: " + permission);
            }
        }
    }

    /**
     * Check any of the specified permissions before method execution
     */
    @Before("@annotation(com.smartoutlet.common.security.annotations.RequireAnyPermission)")
    public void checkAnyPermission(JoinPoint joinPoint) {
        RequireAnyPermission annotation = getRequireAnyPermissionAnnotation(joinPoint);
        if (annotation != null) {
            String[] permissions = annotation.value();
            if (!authorizationService.hasAnyPermission(permissions)) {
                log.warn("Permission denied for method: {} - required any of: {}", 
                        joinPoint.getSignature().getName(), String.join(", ", permissions));
                throw new AccessDeniedException("Insufficient permissions");
            }
        }
    }

    /**
     * Check all specified permissions before method execution
     */
    @Before("@annotation(com.smartoutlet.common.security.annotations.RequireAllPermissions)")
    public void checkAllPermissions(JoinPoint joinPoint) {
        RequireAllPermissions annotation = getRequireAllPermissionsAnnotation(joinPoint);
        if (annotation != null) {
            String[] permissions = annotation.value();
            if (!authorizationService.hasAllPermissions(permissions)) {
                log.warn("Permission denied for method: {} - required all of: {}", 
                        joinPoint.getSignature().getName(), String.join(", ", permissions));
                throw new AccessDeniedException("Insufficient permissions");
            }
        }
    }

    /**
     * Check role before method execution
     */
    @Before("@annotation(com.smartoutlet.common.security.annotations.RequireRole)")
    public void checkRole(JoinPoint joinPoint) {
        RequireRole annotation = getRequireRoleAnnotation(joinPoint);
        if (annotation != null) {
            String role = annotation.value();
            if (!authorizationService.hasRole(role)) {
                log.warn("Role denied for method: {} - required role: {}", 
                        joinPoint.getSignature().getName(), role);
                throw new AccessDeniedException("Insufficient role: " + role);
            }
        }
    }

    /**
     * Check any of the specified roles before method execution
     */
    @Before("@annotation(com.smartoutlet.common.security.annotations.RequireAnyRole)")
    public void checkAnyRole(JoinPoint joinPoint) {
        RequireAnyRole annotation = getRequireAnyRoleAnnotation(joinPoint);
        if (annotation != null) {
            String[] roles = annotation.value();
            if (!authorizationService.hasAnyRole(roles)) {
                log.warn("Role denied for method: {} - required any of: {}", 
                        joinPoint.getSignature().getName(), String.join(", ", roles));
                throw new AccessDeniedException("Insufficient role");
            }
        }
    }

    /**
     * Check admin role before method execution
     */
    @Before("@annotation(com.smartoutlet.common.security.annotations.RequireAdmin)")
    public void checkAdmin(JoinPoint joinPoint) {
        if (!authorizationService.isAdmin()) {
            log.warn("Admin access denied for method: {}", joinPoint.getSignature().getName());
            throw new AccessDeniedException("Admin access required");
        }
    }

    /**
     * Check manager role before method execution
     */
    @Before("@annotation(com.smartoutlet.common.security.annotations.RequireManager)")
    public void checkManager(JoinPoint joinPoint) {
        if (!authorizationService.isManager() && !authorizationService.isAdmin()) {
            log.warn("Manager access denied for method: {}", joinPoint.getSignature().getName());
            throw new AccessDeniedException("Manager access required");
        }
    }

    /**
     * Helper method to get RequirePermission annotation
     */
    private RequirePermission getRequirePermissionAnnotation(JoinPoint joinPoint) {
        try {
            return joinPoint.getTarget().getClass()
                    .getMethod(joinPoint.getSignature().getName())
                    .getAnnotation(RequirePermission.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Helper method to get RequireAnyPermission annotation
     */
    private RequireAnyPermission getRequireAnyPermissionAnnotation(JoinPoint joinPoint) {
        try {
            return joinPoint.getTarget().getClass()
                    .getMethod(joinPoint.getSignature().getName())
                    .getAnnotation(RequireAnyPermission.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Helper method to get RequireAllPermissions annotation
     */
    private RequireAllPermissions getRequireAllPermissionsAnnotation(JoinPoint joinPoint) {
        try {
            return joinPoint.getTarget().getClass()
                    .getMethod(joinPoint.getSignature().getName())
                    .getAnnotation(RequireAllPermissions.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Helper method to get RequireRole annotation
     */
    private RequireRole getRequireRoleAnnotation(JoinPoint joinPoint) {
        try {
            return joinPoint.getTarget().getClass()
                    .getMethod(joinPoint.getSignature().getName())
                    .getAnnotation(RequireRole.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Helper method to get RequireAnyRole annotation
     */
    private RequireAnyRole getRequireAnyRoleAnnotation(JoinPoint joinPoint) {
        try {
            return joinPoint.getTarget().getClass()
                    .getMethod(joinPoint.getSignature().getName())
                    .getAnnotation(RequireAnyRole.class);
        } catch (Exception e) {
            return null;
        }
    }
} 