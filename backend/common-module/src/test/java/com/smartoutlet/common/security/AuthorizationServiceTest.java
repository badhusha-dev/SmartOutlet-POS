package com.smartoutlet.common.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Authorization Service Tests")
class AuthorizationServiceTest {

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthorizationService authorizationService;

    @BeforeEach
    void setUp() {
        // Setup security context
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        
        // Set outlet service URL
        ReflectionTestUtils.setField(authorizationService, "outletServiceUrl", "http://localhost:8082");
    }

    @Test
    @DisplayName("Should handle unauthenticated user")
    void shouldHandleUnauthenticatedUser() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(false);

        // When
        boolean hasPermission = authorizationService.hasPermission("MANAGE_OUTLETS");

        // Then
        assertFalse(hasPermission);
    }

    @Test
    @DisplayName("Should handle null authentication")
    void shouldHandleNullAuthentication() {
        // Given
        when(securityContext.getAuthentication()).thenReturn(null);

        // When
        boolean hasPermission = authorizationService.hasPermission("MANAGE_OUTLETS");

        // Then
        assertFalse(hasPermission);
    }

    @Test
    @DisplayName("Should handle permission check with authenticated user")
    void shouldHandlePermissionCheckWithAuthenticatedUser() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.hasPermission("READ_OUTLETS");
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle role check with authenticated user")
    void shouldHandleRoleCheckWithAuthenticatedUser() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.hasRole("ADMIN");
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle any permission check")
    void shouldHandleAnyPermissionCheck() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.hasAnyPermission("MANAGE_STAFF", "MANAGE_INVENTORY");
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle all permissions check")
    void shouldHandleAllPermissionsCheck() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.hasAllPermissions("VIEW_REPORTS", "MANAGE_OUTLETS");
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle admin check")
    void shouldHandleAdminCheck() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.isAdmin();
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle manager check")
    void shouldHandleManagerCheck() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.isManager();
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle staff check")
    void shouldHandleStaffCheck() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.isStaff();
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle cashier check")
    void shouldHandleCashierCheck() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.isCashier();
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle resource access check")
    void shouldHandleResourceAccessCheck() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.canAccessResource("outlets", "read");
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle get current user roles")
    void shouldHandleGetCurrentUserRoles() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.getCurrentUserRoles();
        });

        // Then
        verify(authentication).isAuthenticated();
    }

    @Test
    @DisplayName("Should handle get current user permissions")
    void shouldHandleGetCurrentUserPermissions() {
        // Given
        when(authentication.isAuthenticated()).thenReturn(true);

        // When
        assertDoesNotThrow(() -> {
            authorizationService.getCurrentUserPermissions();
        });

        // Then
        verify(authentication).isAuthenticated();
    }
}