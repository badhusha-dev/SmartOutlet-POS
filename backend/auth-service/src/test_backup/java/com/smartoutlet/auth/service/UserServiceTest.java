package com.smartoutlet.auth.service;

import com.smartoutlet.auth.config.JwtUtil;
import com.smartoutlet.auth.dto.*;
import com.smartoutlet.auth.entity.Role;
import com.smartoutlet.auth.entity.User;
import com.smartoutlet.auth.exception.UserAlreadyExistsException;
import com.smartoutlet.auth.exception.UserNotFoundException;
import com.smartoutlet.auth.repository.RoleRepository;
import com.smartoutlet.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("User Service Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Role testRole;
    private LoginRequest loginRequest;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        // Setup test role
        testRole = new Role();
        testRole.setId(1L);
        testRole.setName("STAFF");
        testRole.setDescription("Staff member");

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPhoneNumber("1234567890");
        testUser.setIsActive(true);
        testUser.setIsVerified(true);
        testUser.setLastLogin(LocalDateTime.now());
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setRoles(Set.of(testRole));

        // Setup test requests
        loginRequest = new LoginRequest("testuser", "password123");
        registerRequest = RegisterRequest.builder()
                .username("newuser")
                .email("newuser@example.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .phoneNumber("1234567890")
                .build();
    }

    @Test
    @DisplayName("Should authenticate user successfully with valid credentials")
    void shouldAuthenticateUserSuccessfully() {
        // Given
        when(userRepository.findByUsernameOrEmailWithRoles("testuser"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encodedPassword"))
                .thenReturn(true);
        when(jwtUtil.generateToken("testuser", 1L, Set.of("STAFF")))
                .thenReturn("jwt-token-123");
        when(jwtUtil.getExpirationLocalDateTimeFromToken("jwt-token-123"))
                .thenReturn(LocalDateTime.now().plusHours(1));

        // When
        AuthResponse result = userService.authenticate(loginRequest);

        // Then
        assertNotNull(result);
        assertEquals("jwt-token-123", result.getToken());
        assertEquals(1L, result.getId());
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test", result.getFirstName());
        assertEquals("User", result.getLastName());
        assertEquals(Set.of("STAFF"), result.getRoles());
        assertTrue(result.getExpiresAt().isAfter(LocalDateTime.now()));

        verify(userRepository).save(testUser);
        verify(userRepository).findByUsernameOrEmailWithRoles("testuser");
        verify(passwordEncoder).matches("password123", "encodedPassword");
        verify(jwtUtil).generateToken("testuser", 1L, Set.of("STAFF"));
    }

    @Test
    @DisplayName("Should throw UserNotFoundException when user not found")
    void shouldThrowUserNotFoundExceptionWhenUserNotFound() {
        // Given
        when(userRepository.findByUsernameOrEmailWithRoles("nonexistent"))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.authenticate(new LoginRequest("nonexistent", "password123"));
        });

        verify(userRepository).findByUsernameOrEmailWithRoles("nonexistent");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw RuntimeException when password is invalid")
    void shouldThrowRuntimeExceptionWhenPasswordInvalid() {
        // Given
        when(userRepository.findByUsernameOrEmailWithRoles("testuser"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword"))
                .thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            userService.authenticate(new LoginRequest("testuser", "wrongpassword"));
        });

        verify(userRepository).findByUsernameOrEmailWithRoles("testuser");
        verify(passwordEncoder).matches("wrongpassword", "encodedPassword");
        verify(jwtUtil, never()).generateToken(anyString(), anyLong(), anySet());
    }

    @Test
    @DisplayName("Should throw RuntimeException when user account is deactivated")
    void shouldThrowRuntimeExceptionWhenUserDeactivated() {
        // Given
        testUser.setIsActive(false);
        when(userRepository.findByUsernameOrEmailWithRoles("testuser"))
                .thenReturn(Optional.of(testUser));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            userService.authenticate(loginRequest);
        });

        verify(userRepository).findByUsernameOrEmailWithRoles("testuser");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("Should register new user successfully")
    void shouldRegisterUserSuccessfully() {
        // Given
        User savedUser = new User();
        savedUser.setId(2L);
        savedUser.setUsername("newuser");
        savedUser.setEmail("newuser@example.com");
        savedUser.setPassword("encodedPassword");
        savedUser.setFirstName("New");
        savedUser.setLastName("User");
        savedUser.setPhoneNumber("1234567890");
        savedUser.setIsActive(true);
        savedUser.setIsVerified(false);
        savedUser.setRoles(Set.of(testRole));

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(roleRepository.findByName("STAFF")).thenReturn(Optional.of(testRole));
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        UserResponse result = userService.register(registerRequest);

        // Then
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("newuser", result.getUsername());
        assertEquals("newuser@example.com", result.getEmail());
        assertEquals("New", result.getFirstName());
        assertEquals("User", result.getLastName());
        assertEquals("1234567890", result.getPhoneNumber());
        assertTrue(result.getIsActive());
        assertFalse(result.getIsVerified());
        assertEquals(Set.of("STAFF"), result.getRoles());

        verify(userRepository).existsByUsername("newuser");
        verify(userRepository).existsByEmail("newuser@example.com");
        verify(passwordEncoder).encode("password123");
        verify(roleRepository).findByName("STAFF");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when username already exists")
    void shouldThrowUserAlreadyExistsExceptionWhenUsernameExists() {
        // Given
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.register(RegisterRequest.builder()
                    .username("existinguser")
                    .email("new@example.com")
                    .password("password123")
                    .build());
        });

        verify(userRepository).existsByUsername("existinguser");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when email already exists")
    void shouldThrowUserAlreadyExistsExceptionWhenEmailExists() {
        // Given
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When & Then
        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.register(RegisterRequest.builder()
                    .username("newuser")
                    .email("existing@example.com")
                    .password("password123")
                    .build());
        });

        verify(userRepository).existsByUsername("newuser");
        verify(userRepository).existsByEmail("existing@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should validate token successfully")
    void shouldValidateTokenSuccessfully() {
        // Given
        String token = "valid-jwt-token";
        when(jwtUtil.validateToken(token)).thenReturn(true);

        // When
        Boolean result = userService.validateToken(token);

        // Then
        assertTrue(result);
        verify(jwtUtil).validateToken(token);
    }

    @Test
    @DisplayName("Should return false for invalid token")
    void shouldReturnFalseForInvalidToken() {
        // Given
        String token = "invalid-jwt-token";
        when(jwtUtil.validateToken(token)).thenReturn(false);

        // When
        Boolean result = userService.validateToken(token);

        // Then
        assertFalse(result);
        verify(jwtUtil).validateToken(token);
    }

    @Test
    @DisplayName("Should get user from token successfully")
    void shouldGetUserFromTokenSuccessfully() {
        // Given
        String token = "valid-jwt-token";
        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("testuser");
        when(userRepository.findByUsernameWithRoles("testuser"))
                .thenReturn(Optional.of(testUser));

        // When
        UserResponse result = userService.getUserFromToken(token);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());

        verify(jwtUtil).validateToken(token);
        verify(jwtUtil).getUsernameFromToken(token);
        verify(userRepository).findByUsernameWithRoles("testuser");
    }

    @Test
    @DisplayName("Should throw RuntimeException for invalid token when getting user")
    void shouldThrowRuntimeExceptionForInvalidTokenWhenGettingUser() {
        // Given
        String token = "invalid-jwt-token";
        when(jwtUtil.validateToken(token)).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            userService.getUserFromToken(token);
        });

        verify(jwtUtil).validateToken(token);
        verify(jwtUtil, never()).getUsernameFromToken(anyString());
    }

    @Test
    @DisplayName("Should get user by ID successfully")
    void shouldGetUserByIdSuccessfully() {
        // Given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // When
        UserResponse result = userService.getUserById(userId);

        // Then
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());

        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should throw UserNotFoundException when user not found by ID")
    void shouldThrowUserNotFoundExceptionWhenUserNotFoundById() {
        // Given
        Long userId = 999L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserById(userId);
        });

        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should get user by username successfully")
    void shouldGetUserByUsernameSuccessfully() {
        // Given
        String username = "testuser";
        when(userRepository.findByUsernameWithRoles(username))
                .thenReturn(Optional.of(testUser));

        // When
        UserResponse result = userService.getUserByUsername(username);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(username, result.getUsername());
        assertEquals("test@example.com", result.getEmail());

        verify(userRepository).findByUsernameWithRoles(username);
    }

    @Test
    @DisplayName("Should throw UserNotFoundException when user not found by username")
    void shouldThrowUserNotFoundExceptionWhenUserNotFoundByUsername() {
        // Given
        String username = "nonexistent";
        when(userRepository.findByUsernameWithRoles(username))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserByUsername(username);
        });

        verify(userRepository).findByUsernameWithRoles(username);
    }

    @Test
    @DisplayName("Should handle password encryption correctly")
    void shouldHandlePasswordEncryptionCorrectly() {
        // Given
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123";
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(roleRepository.findByName("STAFF")).thenReturn(Optional.of(testRole));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        userService.register(registerRequest);

        // Then
        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(argThat(user -> 
            encodedPassword.equals(user.getPassword())
        ));
    }
} 