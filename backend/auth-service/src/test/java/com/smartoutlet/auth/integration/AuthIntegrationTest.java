package com.smartoutlet.auth.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartoutlet.auth.dto.LoginRequest;
import com.smartoutlet.auth.dto.RegisterRequest;
import com.smartoutlet.auth.entity.Role;
import com.smartoutlet.auth.entity.User;
import com.smartoutlet.auth.repository.RoleRepository;
import com.smartoutlet.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private Role staffRole;
    private Role adminRole;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Create test roles
        staffRole = new Role("STAFF", "Staff member");
        adminRole = new Role("ADMIN", "Administrator");
        roleRepository.save(staffRole);
        roleRepository.save(adminRole);
    }

    @Test
    @DisplayName("Should register and login user successfully")
    void shouldRegisterAndLoginUserSuccessfully() throws Exception {
        // Given
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("integrationuser")
                .email("integration@example.com")
                .password("password123")
                .firstName("Integration")
                .lastName("User")
                .phoneNumber("1234567890")
                .build();

        // When & Then - Register
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registration successful"))
                .andExpect(jsonPath("$.data.username").value("integrationuser"))
                .andExpect(jsonPath("$.data.email").value("integration@example.com"))
                .andExpect(jsonPath("$.data.firstName").value("Integration"))
                .andExpect(jsonPath("$.data.lastName").value("User"))
                .andExpect(jsonPath("$.data.phoneNumber").value("1234567890"))
                .andExpect(jsonPath("$.data.isActive").value(true))
                .andExpect(jsonPath("$.data.isVerified").value(false))
                .andExpect(jsonPath("$.data.roles").isArray())
                .andExpect(jsonPath("$.data.roles[0]").value("STAFF"));

        // Verify user was saved in database
        User savedUser = userRepository.findByUsername("integrationuser").orElse(null);
        assertNotNull(savedUser);
        assertEquals("integrationuser", savedUser.getUsername());
        assertEquals("integration@example.com", savedUser.getEmail());
        assertTrue(passwordEncoder.matches("password123", savedUser.getPassword()));
        assertEquals("Integration", savedUser.getFirstName());
        assertEquals("User", savedUser.getLastName());
        assertEquals("1234567890", savedUser.getPhoneNumber());
        assertTrue(savedUser.getIsActive());
        assertFalse(savedUser.getIsVerified());
        assertEquals(1, savedUser.getRoles().size());
        assertTrue(savedUser.getRoles().stream().anyMatch(role -> "STAFF".equals(role.getName())));

        // When & Then - Login
        LoginRequest loginRequest = new LoginRequest("integrationuser", "password123");
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.userId").value(savedUser.getId()))
                .andExpect(jsonPath("$.data.username").value("integrationuser"))
                .andExpect(jsonPath("$.data.email").value("integration@example.com"))
                .andExpect(jsonPath("$.data.firstName").value("Integration"))
                .andExpect(jsonPath("$.data.lastName").value("User"))
                .andExpect(jsonPath("$.data.roles").isArray())
                .andExpect(jsonPath("$.data.roles[0]").value("STAFF"))
                .andExpect(jsonPath("$.data.expiresAt").exists());
    }

    @Test
    @DisplayName("Should return 409 when registering duplicate username")
    void shouldReturnConflictWhenRegisteringDuplicateUsername() throws Exception {
        // Given - Create existing user
        User existingUser = new User();
        existingUser.setUsername("existinguser");
        existingUser.setEmail("existing@example.com");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        existingUser.setFirstName("Existing");
        existingUser.setLastName("User");
        existingUser.setIsActive(true);
        existingUser.setIsVerified(false);
        existingUser.setRoles(Set.of(staffRole));
        userRepository.save(existingUser);

        // When & Then - Try to register with same username
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("existinguser")
                .email("newemail@example.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .build();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Should return 409 when registering duplicate email")
    void shouldReturnConflictWhenRegisteringDuplicateEmail() throws Exception {
        // Given - Create existing user
        User existingUser = new User();
        existingUser.setUsername("existinguser");
        existingUser.setEmail("existing@example.com");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        existingUser.setFirstName("Existing");
        existingUser.setLastName("User");
        existingUser.setIsActive(true);
        existingUser.setIsVerified(false);
        existingUser.setRoles(Set.of(staffRole));
        userRepository.save(existingUser);

        // When & Then - Try to register with same email
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("newuser")
                .email("existing@example.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .build();

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Should return 400 when login with invalid credentials")
    void shouldReturnBadRequestWhenLoginWithInvalidCredentials() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest("nonexistent", "wrongpassword");

        // When & Then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return 400 when login with wrong password")
    void shouldReturnBadRequestWhenLoginWithWrongPassword() throws Exception {
        // Given - Create user
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("correctpassword"));
        user.setFirstName("Test");
        user.setLastName("User");
        user.setIsActive(true);
        user.setIsVerified(false);
        user.setRoles(Set.of(staffRole));
        userRepository.save(user);

        // When & Then - Try to login with wrong password
        LoginRequest loginRequest = new LoginRequest("testuser", "wrongpassword");
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 when login with deactivated account")
    void shouldReturnBadRequestWhenLoginWithDeactivatedAccount() throws Exception {
        // Given - Create deactivated user
        User user = new User();
        user.setUsername("deactivateduser");
        user.setEmail("deactivated@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("Deactivated");
        user.setLastName("User");
        user.setIsActive(false);
        user.setIsVerified(false);
        user.setRoles(Set.of(staffRole));
        userRepository.save(user);

        // When & Then
        LoginRequest loginRequest = new LoginRequest("deactivateduser", "password123");
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should validate token successfully")
    void shouldValidateTokenSuccessfully() throws Exception {
        // Given - Create user and get token
        User user = new User();
        user.setUsername("tokenuser");
        user.setEmail("token@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("Token");
        user.setLastName("User");
        user.setIsActive(true);
        user.setIsVerified(false);
        user.setRoles(Set.of(staffRole));
        userRepository.save(user);

        // Login to get token
        LoginRequest loginRequest = new LoginRequest("tokenuser", "password123");
        String response = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract token from response
        String token = objectMapper.readTree(response).get("data").get("token").asText();

        // When & Then - Validate token
        mockMvc.perform(post("/auth/validate-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"" + token + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Token is valid"))
                .andExpect(jsonPath("$.data.username").value("tokenuser"));
    }

    @Test
    @DisplayName("Should return 400 when validating invalid token")
    void shouldReturnBadRequestWhenValidatingInvalidToken() throws Exception {
        // Given
        String invalidToken = "invalid.jwt.token";

        // When & Then
        mockMvc.perform(post("/auth/validate-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"" + invalidToken + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid token"));
    }

    @Test
    @DisplayName("Should return 400 for invalid registration request")
    void shouldReturnBadRequestForInvalidRegistrationRequest() throws Exception {
        // Given
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .username("") // Invalid: empty username
                .email("invalid-email") // Invalid: malformed email
                .password("123") // Invalid: too short password
                .build();

        // When & Then
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 for invalid login request")
    void shouldReturnBadRequestForInvalidLoginRequest() throws Exception {
        // Given
        LoginRequest invalidRequest = new LoginRequest("", ""); // Invalid: empty fields

        // When & Then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle password encryption correctly")
    void shouldHandlePasswordEncryptionCorrectly() throws Exception {
        // Given
        String rawPassword = "password123";
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("encryptionuser")
                .email("encryption@example.com")
                .password(rawPassword)
                .firstName("Encryption")
                .lastName("User")
                .build();

        // When
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Then - Verify password was encrypted
        User savedUser = userRepository.findByUsername("encryptionuser").orElse(null);
        assertNotNull(savedUser);
        assertNotEquals(rawPassword, savedUser.getPassword()); // Password should be encrypted
        assertTrue(passwordEncoder.matches(rawPassword, savedUser.getPassword())); // Should match when verified
    }

    @Test
    @DisplayName("Should assign default STAFF role to new users")
    void shouldAssignDefaultStaffRoleToNewUsers() throws Exception {
        // Given
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("roleuser")
                .email("role@example.com")
                .password("password123")
                .firstName("Role")
                .lastName("User")
                .build();

        // When
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.roles[0]").value("STAFF"));

        // Then - Verify role assignment
        User savedUser = userRepository.findByUsername("roleuser").orElse(null);
        assertNotNull(savedUser);
        assertEquals(1, savedUser.getRoles().size());
        assertTrue(savedUser.getRoles().stream().anyMatch(role -> "STAFF".equals(role.getName())));
    }
} 