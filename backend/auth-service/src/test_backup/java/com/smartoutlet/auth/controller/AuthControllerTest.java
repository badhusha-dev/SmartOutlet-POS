package com.smartoutlet.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartoutlet.auth.dto.*;
import com.smartoutlet.auth.exception.UserAlreadyExistsException;
import com.smartoutlet.auth.exception.UserNotFoundException;
import com.smartoutlet.auth.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Auth Controller Tests")
class AuthControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("Should successfully login user with valid credentials")
    void shouldLoginUserSuccessfully() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest("testuser", "password123");
        AuthResponse authResponse = AuthResponse.builder()
                .token("jwt-token-123")
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .roles(Set.of("STAFF"))
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();

        when(userService.authenticate(any(LoginRequest.class))).thenReturn(authResponse);

        // When & Then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.token").value("jwt-token-123"))
                .andExpect(jsonPath("$.data.username").value("testuser"))
                .andExpect(jsonPath("$.data.email").value("test@example.com"));

        verify(userService, times(1)).authenticate(any(LoginRequest.class));
    }

    @Test
    @DisplayName("Should return 400 when login request is invalid")
    void shouldReturnBadRequestForInvalidLoginRequest() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest("", "");

        // When & Then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 404 when user not found during login")
    void shouldReturnNotFoundWhenUserNotFound() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest("nonexistent", "password123");
        when(userService.authenticate(any(LoginRequest.class)))
                .thenThrow(new UserNotFoundException("User not found"));

        // When & Then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should successfully register new user")
    void shouldRegisterUserSuccessfully() throws Exception {
        // Given
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("newuser")
                .email("newuser@example.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .phoneNumber("1234567890")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(2L)
                .username("newuser")
                .email("newuser@example.com")
                .firstName("New")
                .lastName("User")
                .phoneNumber("1234567890")
                .isActive(true)
                .isVerified(false)
                .roles(Set.of("STAFF"))
                .build();

        when(userService.register(any(RegisterRequest.class))).thenReturn(userResponse);

        // When & Then
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registration successful"))
                .andExpect(jsonPath("$.data.username").value("newuser"))
                .andExpect(jsonPath("$.data.email").value("newuser@example.com"));

        verify(userService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("Should return 409 when user already exists during registration")
    void shouldReturnConflictWhenUserAlreadyExists() throws Exception {
        // Given
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("existinguser")
                .email("existing@example.com")
                .password("password123")
                .build();

        when(userService.register(any(RegisterRequest.class)))
                .thenThrow(new UserAlreadyExistsException("Username already exists"));

        // When & Then
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Should return 400 when registration request is invalid")
    void shouldReturnBadRequestForInvalidRegistrationRequest() throws Exception {
        // Given
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("")
                .email("invalid-email")
                .password("123")
                .build();

        // When & Then
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should successfully validate token")
    void shouldValidateTokenSuccessfully() throws Exception {
        // Given
        ValidationRequest validationRequest = new ValidationRequest("valid-jwt-token");
        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .isActive(true)
                .isVerified(true)
                .roles(Set.of("STAFF"))
                .build();

        when(userService.validateToken("valid-jwt-token")).thenReturn(true);
        when(userService.getUserFromToken("valid-jwt-token")).thenReturn(userResponse);

        // When & Then
        mockMvc.perform(post("/auth/validate-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Token is valid"))
                .andExpect(jsonPath("$.data.username").value("testuser"));

        verify(userService, times(1)).validateToken("valid-jwt-token");
        verify(userService, times(1)).getUserFromToken("valid-jwt-token");
    }

    @Test
    @DisplayName("Should return 400 when token is invalid")
    void shouldReturnBadRequestForInvalidToken() throws Exception {
        // Given
        ValidationRequest validationRequest = new ValidationRequest("invalid-jwt-token");
        when(userService.validateToken("invalid-jwt-token")).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/auth/validate-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validationRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid token"));

        verify(userService, times(1)).validateToken("invalid-jwt-token");
        verify(userService, never()).getUserFromToken(anyString());
    }

    @Test
    @DisplayName("Should get user by ID successfully")
    void shouldGetUserByIdSuccessfully() throws Exception {
        // Given
        Long userId = 1L;
        UserResponse userResponse = UserResponse.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .isActive(true)
                .isVerified(true)
                .roles(Set.of("STAFF"))
                .build();

        when(userService.getUserById(userId)).thenReturn(userResponse);

        // When & Then
        mockMvc.perform(get("/auth/user/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User found"))
                .andExpect(jsonPath("$.data.id").value(userId))
                .andExpect(jsonPath("$.data.username").value("testuser"));

        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    @DisplayName("Should get user by username successfully")
    void shouldGetUserByUsernameSuccessfully() throws Exception {
        // Given
        String username = "testuser";
        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .username(username)
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .isActive(true)
                .isVerified(true)
                .roles(Set.of("STAFF"))
                .build();

        when(userService.getUserByUsername(username)).thenReturn(userResponse);

        // When & Then
        mockMvc.perform(get("/auth/user/username/{username}", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User found"))
                .andExpect(jsonPath("$.data.username").value(username));

        verify(userService, times(1)).getUserByUsername(username);
    }

    @Test
    @DisplayName("Should return health check successfully")
    void shouldReturnHealthCheckSuccessfully() throws Exception {
        // When & Then
        mockMvc.perform(get("/auth/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Auth service is running"))
                .andExpect(jsonPath("$.data").value("OK"));
    }
} 