package com.smartoutlet.auth.controller;

import com.smartoutlet.auth.dto.AuthResponse;
import com.smartoutlet.auth.dto.LoginRequest;
import com.smartoutlet.auth.dto.RegisterRequest;
import com.smartoutlet.auth.dto.UserResponse;
import com.smartoutlet.auth.dto.ValidationRequest;
import com.smartoutlet.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "400", description = "Invalid credentials"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<com.smartoutlet.auth.dto.ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getUsernameOrEmail());

        AuthResponse authResponse = userService.authenticate(loginRequest);
        return ResponseEntity.ok(
            com.smartoutlet.auth.dto.ApiResponse.success("Login successful", authResponse)
        );
    }
    
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Registration successful"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })
    public ResponseEntity<com.smartoutlet.auth.dto.ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("Registration attempt for user: {}", registerRequest.getUsername());

        UserResponse userResponse = userService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            com.smartoutlet.auth.dto.ApiResponse.success("Registration successful", userResponse)
        );
    }
    
    @PostMapping("/validate-token")
    @Operation(summary = "Validate JWT token", description = "Validate a JWT token and return user info if valid")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token is valid"),
        @ApiResponse(responseCode = "400", description = "Invalid token")
    })
    public ResponseEntity<com.smartoutlet.auth.dto.ApiResponse<UserResponse>> validateToken(@Valid @RequestBody ValidationRequest validationRequest) {
        log.info("Token validation request");
        
        Boolean isValid = userService.validateToken(validationRequest.getToken());
        
        if (!isValid) {
            return ResponseEntity.badRequest().body(
                com.smartoutlet.auth.dto.ApiResponse.error("Invalid token")
            );
        }
        
        UserResponse userResponse = userService.getUserFromToken(validationRequest.getToken());
        
        return ResponseEntity.ok(
            com.smartoutlet.auth.dto.ApiResponse.success("Token is valid", userResponse)
        );
    }
    
    @GetMapping("/user/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve user information by user ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<com.smartoutlet.auth.dto.ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        log.info("Get user by ID: {}", id);
        
        UserResponse userResponse = userService.getUserById(id);
        
        return ResponseEntity.ok(
            com.smartoutlet.auth.dto.ApiResponse.success("User found", userResponse)
        );
    }
    
    @GetMapping("/user/username/{username}")
    @Operation(summary = "Get user by username", description = "Retrieve user information by username")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<com.smartoutlet.auth.dto.ApiResponse<UserResponse>> getUserByUsername(@PathVariable String username) {
        log.info("Get user by username: {}", username);
        
        UserResponse userResponse = userService.getUserByUsername(username);
        
        return ResponseEntity.ok(
            com.smartoutlet.auth.dto.ApiResponse.success("User found", userResponse)
        );
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the auth service is running")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    public ResponseEntity<com.smartoutlet.auth.dto.ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
            com.smartoutlet.auth.dto.ApiResponse.success("Auth service is running", "OK")
        );
    }
}