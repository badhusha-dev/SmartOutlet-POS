package com.smartoutlet.auth.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartoutlet.auth.application.service.AuthService;
import com.smartoutlet.auth.dto.request.LoginRequest;
import com.smartoutlet.auth.dto.request.RegisterRequest;
import com.smartoutlet.auth.dto.response.AuthResponse;
import com.smartoutlet.auth.dto.response.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Auth Integration Tests")
class AuthIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .build();
    }

    @Test
    @DisplayName("Should complete full authentication flow")
    void shouldCompleteFullAuthenticationFlow() throws Exception {
        // Given - Register a new user
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("1234567890")
                .build();

        // When - Register the user
        UserResponse registeredUser = authService.register(registerRequest);

        // Then - User should be registered successfully
        assertNotNull(registeredUser);
        assertEquals("testuser", registeredUser.getUsername());
        assertEquals("test@example.com", registeredUser.getEmail());
        assertFalse(registeredUser.getIsVerified()); // Should be unverified initially

        // Given - Login request
        LoginRequest loginRequest = new LoginRequest("testuser", "password123");

        // When - Authenticate the user
        AuthResponse authResponse = authService.authenticate(loginRequest);

        // Then - Should return valid auth response
        assertNotNull(authResponse);
        assertNotNull(authResponse.getToken());
        assertEquals("testuser", authResponse.getUsername());
        assertEquals("test@example.com", authResponse.getEmail());
        assertNotNull(authResponse.getExpiresAt());
        assertTrue(authResponse.getExpiresAt().isAfter(java.time.LocalDateTime.now()));
    }

    @Test
    @DisplayName("Should validate user registration via REST API")
    void shouldValidateUserRegistrationViaRestApi() throws Exception {
        // Given
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("apiuser")
                .email("api@example.com")
                .password("password123")
                .firstName("API")
                .lastName("User")
                .phoneNumber("9876543210")
                .build();

        String requestJson = objectMapper.writeValueAsString(registerRequest);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("apiuser"))
                .andExpect(jsonPath("$.email").value("api@example.com"))
                .andExpect(jsonPath("$.firstName").value("API"))
                .andExpect(jsonPath("$.lastName").value("User"))
                .andExpect(jsonPath("$.isActive").value(true))
                .andExpect(jsonPath("$.isVerified").value(false));
    }

    @Test
    @DisplayName("Should validate user login via REST API")
    void shouldValidateUserLoginViaRestApi() throws Exception {
        // Given - First register a user
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("loginuser")
                .email("login@example.com")
                .password("password123")
                .firstName("Login")
                .lastName("User")
                .phoneNumber("5555555555")
                .build();

        authService.register(registerRequest);

        // Given - Login request
        LoginRequest loginRequest = new LoginRequest("loginuser", "password123");
        String loginJson = objectMapper.writeValueAsString(loginRequest);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("loginuser"))
                .andExpect(jsonPath("$.email").value("login@example.com"))
                .andExpect(jsonPath("$.expiresAt").exists());
    }

    @Test
    @DisplayName("Should handle invalid login credentials")
    void shouldHandleInvalidLoginCredentials() throws Exception {
        // Given
        LoginRequest invalidRequest = new LoginRequest("nonexistent", "wrongpassword");
        String requestJson = objectMapper.writeValueAsString(invalidRequest);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should handle duplicate username registration")
    void shouldHandleDuplicateUsernameRegistration() throws Exception {
        // Given - Register first user
        RegisterRequest firstUser = RegisterRequest.builder()
                .username("duplicate")
                .email("first@example.com")
                .password("password123")
                .firstName("First")
                .lastName("User")
                .phoneNumber("1111111111")
                .build();

        authService.register(firstUser);

        // Given - Try to register with same username
        RegisterRequest duplicateUser = RegisterRequest.builder()
                .username("duplicate")
                .email("second@example.com")
                .password("password456")
                .firstName("Second")
                .lastName("User")
                .phoneNumber("2222222222")
                .build();

        String requestJson = objectMapper.writeValueAsString(duplicateUser);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Should validate token successfully")
    void shouldValidateTokenSuccessfully() throws Exception {
        // Given - Register and login to get token
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("tokenuser")
                .email("token@example.com")
                .password("password123")
                .firstName("Token")
                .lastName("User")
                .phoneNumber("3333333333")
                .build();

        authService.register(registerRequest);
        
        LoginRequest loginRequest = new LoginRequest("tokenuser", "password123");
        AuthResponse authResponse = authService.authenticate(loginRequest);

        // When & Then
        mockMvc.perform(get("/api/auth/validate")
                        .header("Authorization", "Bearer " + authResponse.getToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true));
    }

    @Test
    @DisplayName("Should reject invalid token")
    void shouldRejectInvalidToken() throws Exception {
        // Given
        String invalidToken = "invalid.jwt.token";

        // When & Then
        mockMvc.perform(get("/api/auth/validate")
                        .header("Authorization", "Bearer " + invalidToken))
                .andExpect(status().isUnauthorized());
    }
} 