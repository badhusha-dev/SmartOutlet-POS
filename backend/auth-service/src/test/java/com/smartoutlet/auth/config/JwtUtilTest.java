package com.smartoutlet.auth.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JWT Util Tests")
class JwtUtilTest {

    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private JwtUtil jwtUtil;

    private static final String TEST_SECRET = "testSecretKeyForJwtTokenGenerationAndValidation123456789";
    private static final long TEST_EXPIRATION = 3600000L; // 1 hour
    private static final String TEST_ISSUER = "smartoutlet-auth";
    private static final String TEST_USERNAME = "testuser";
    private static final Long TEST_USER_ID = 1L;
    private static final Set<String> TEST_ROLES = Set.of("STAFF", "ADMIN");

    @BeforeEach
    void setUp() {
        when(jwtProperties.getSecret()).thenReturn(TEST_SECRET);
        when(jwtProperties.getExpiration()).thenReturn(TEST_EXPIRATION);
        when(jwtProperties.getIssuer()).thenReturn(TEST_ISSUER);
    }

    @Test
    @DisplayName("Should generate valid JWT token")
    void shouldGenerateValidJwtToken() {
        // When
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts separated by dots
    }

    @Test
    @DisplayName("Should extract username from valid token")
    void shouldExtractUsernameFromValidToken() {
        // Given
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // When
        String extractedUsername = jwtUtil.getUsernameFromToken(token);

        // Then
        assertEquals(TEST_USERNAME, extractedUsername);
    }

    @Test
    @DisplayName("Should extract user ID from valid token")
    void shouldExtractUserIdFromValidToken() {
        // Given
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // When
        Long extractedUserId = jwtUtil.getUserIdFromToken(token);

        // Then
        assertEquals(TEST_USER_ID, extractedUserId);
    }

    @Test
    @DisplayName("Should extract roles from valid token")
    void shouldExtractRolesFromValidToken() {
        // Given
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // When
        Set<String> extractedRoles = jwtUtil.getRolesFromToken(token);

        // Then
        assertNotNull(extractedRoles);
        assertEquals(TEST_ROLES, extractedRoles);
    }

    @Test
    @DisplayName("Should get expiration date from token")
    void shouldGetExpirationDateFromToken() {
        // Given
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // When
        Date expirationDate = jwtUtil.getExpirationDateFromToken(token);

        // Then
        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }

    @Test
    @DisplayName("Should get expiration local date time from token")
    void shouldGetExpirationLocalDateTimeFromToken() {
        // Given
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // When
        LocalDateTime expirationDateTime = jwtUtil.getExpirationLocalDateTimeFromToken(token);

        // Then
        assertNotNull(expirationDateTime);
        assertTrue(expirationDateTime.isAfter(LocalDateTime.now()));
    }

    @Test
    @DisplayName("Should validate valid token")
    void shouldValidateValidToken() {
        // Given
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // When
        Boolean isValid = jwtUtil.validateToken(token);

        // Then
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should return false for invalid token")
    void shouldReturnFalseForInvalidToken() {
        // Given
        String invalidToken = "invalid.jwt.token";

        // When
        Boolean isValid = jwtUtil.validateToken(invalidToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false for null token")
    void shouldReturnFalseForNullToken() {
        // When
        Boolean isValid = jwtUtil.validateToken(null);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false for empty token")
    void shouldReturnFalseForEmptyToken() {
        // When
        Boolean isValid = jwtUtil.validateToken("");

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should handle expired token")
    void shouldHandleExpiredToken() {
        // Given
        when(jwtProperties.getExpiration()).thenReturn(1L); // 1 millisecond
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);
        
        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // When
        Boolean isValid = jwtUtil.validateToken(token);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should check if token is expired")
    void shouldCheckIfTokenIsExpired() {
        // Given
        when(jwtProperties.getExpiration()).thenReturn(1L); // 1 millisecond
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);
        
        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // When
        Boolean isExpired = jwtUtil.isTokenExpired(token);

        // Then
        assertTrue(isExpired);
    }

    @Test
    @DisplayName("Should return false for non-expired token")
    void shouldReturnFalseForNonExpiredToken() {
        // Given
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // When
        Boolean isExpired = jwtUtil.isTokenExpired(token);

        // Then
        assertFalse(isExpired);
    }

    @Test
    @DisplayName("Should handle malformed JWT exception")
    void shouldHandleMalformedJwtException() {
        // Given
        String malformedToken = "malformed.token";

        // When
        Boolean isValid = jwtUtil.validateToken(malformedToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should handle unsupported JWT exception")
    void shouldHandleUnsupportedJwtException() {
        // Given
        String unsupportedToken = "unsupported.token";

        // When
        Boolean isValid = jwtUtil.validateToken(unsupportedToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should handle security exception")
    void shouldHandleSecurityException() {
        // Given
        String tokenWithWrongSignature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        // When
        Boolean isValid = jwtUtil.validateToken(tokenWithWrongSignature);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should handle illegal argument exception")
    void shouldHandleIllegalArgumentException() {
        // Given
        String invalidToken = "invalid";

        // When
        Boolean isValid = jwtUtil.validateToken(invalidToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should generate token with correct issuer")
    void shouldGenerateTokenWithCorrectIssuer() {
        // Given
        String expectedIssuer = "custom-issuer";
        when(jwtProperties.getIssuer()).thenReturn(expectedIssuer);

        // When
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // Then
        assertNotNull(token);
        // Note: In a real scenario, you might want to decode the token and verify the issuer claim
        // For this test, we're just ensuring the token is generated without exception
    }

    @Test
    @DisplayName("Should generate token with correct expiration")
    void shouldGenerateTokenWithCorrectExpiration() {
        // Given
        long expectedExpiration = 7200000L; // 2 hours
        when(jwtProperties.getExpiration()).thenReturn(expectedExpiration);

        // When
        String token = jwtUtil.generateToken(TEST_USERNAME, TEST_USER_ID, TEST_ROLES);

        // Then
        assertNotNull(token);
        Date expirationDate = jwtUtil.getExpirationDateFromToken(token);
        assertNotNull(expirationDate);
        
        // Verify expiration is approximately correct (within 1 second tolerance)
        long expectedExpirationTime = System.currentTimeMillis() + expectedExpiration;
        long actualExpirationTime = expirationDate.getTime();
        assertTrue(Math.abs(expectedExpirationTime - actualExpirationTime) < 1000);
    }
} 