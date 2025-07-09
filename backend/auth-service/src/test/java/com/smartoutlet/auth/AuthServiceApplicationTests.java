package com.smartoutlet.auth;

import com.smartoutlet.auth.dto.LoginRequest;
import com.smartoutlet.auth.dto.RegisterRequest;
import com.smartoutlet.auth.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceApplicationTests {

    @Autowired
    private UserService userService;

    @Test
    void contextLoads() {
        assertNotNull(userService);
    }

    @Test
    void testUserRegistrationAndLogin() {
        // Test registration
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("Test");
        registerRequest.setLastName("User");

        var userResponse = userService.register(registerRequest);
        assertNotNull(userResponse);
        assertEquals("testuser", userResponse.getUsername());

        // Test login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("testuser");
        loginRequest.setPassword("password123");

        var authResponse = userService.authenticate(loginRequest);
        assertNotNull(authResponse);
        assertNotNull(authResponse.getToken());
        assertEquals("testuser", authResponse.getUsername());
    }
}