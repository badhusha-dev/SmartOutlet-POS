package com.smartoutlet.auth.controller;

import com.smartoutlet.auth.dto.*;
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
    public ResponseEntity<AuthResponseDTO<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getUsernameOrEmail());

        AuthResponse authResponse = userService.authenticate(loginRequest);
        return ResponseEntity.ok(
            AuthResponseDTO.success("Login successful", authResponse)
        );
    }
    
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Registration successful"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })
    public ResponseEntity<AuthResponseDTO<UserResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("Registration attempt for user: {}", registerRequest.getUsername());

        UserResponse userResponse = userService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            AuthResponseDTO.success("Registration successful", userResponse)
        );
    }
    
    @PostMapping("/validate-token")
    @Operation(summary = "Validate JWT token", description = "Validate a JWT token and return user info if valid")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token is valid"),
        @ApiResponse(responseCode = "400", description = "Invalid token")
    })
    public ResponseEntity<AuthResponseDTO<UserResponse>> validateToken(@Valid @RequestBody ValidationRequest validationRequest) {
        log.info("Token validation request");
        
        Boolean isValid = userService.validateToken(validationRequest.getToken());
        
        if (!isValid) {
            return ResponseEntity.badRequest().body(
                AuthResponseDTO.error("Invalid token")
            );
        }
        
        UserResponse userResponse = userService.getUserFromToken(validationRequest.getToken());
        
        return ResponseEntity.ok(
            AuthResponseDTO.success("Token is valid", userResponse)
        );
    }
    
    @GetMapping("/user/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve user information by user ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<AuthResponseDTO<UserResponse>> getUserById(@PathVariable Long id) {
        log.info("Get user by ID: {}", id);
        
        UserResponse userResponse = userService.getUserById(id);
        
        return ResponseEntity.ok(
            AuthResponseDTO.success("User found", userResponse)
        );
    }
    
    @GetMapping("/user/username/{username}")
    @Operation(summary = "Get user by username", description = "Retrieve user information by username")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<AuthResponseDTO<UserResponse>> getUserByUsername(@PathVariable String username) {
        log.info("Get user by username: {}", username);
        
        UserResponse userResponse = userService.getUserByUsername(username);
        
        return ResponseEntity.ok(
            AuthResponseDTO.success("User found", userResponse)
        );
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the auth service is running")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    public ResponseEntity<AuthResponseDTO<String>> healthCheck() {
        return ResponseEntity.ok(
            AuthResponseDTO.success("Auth service is running", "OK")
        );
    }
}