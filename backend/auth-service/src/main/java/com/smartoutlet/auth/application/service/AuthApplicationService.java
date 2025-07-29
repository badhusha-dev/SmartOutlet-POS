package com.smartoutlet.auth.application.service;

import java.util.List;

import com.smartoutlet.auth.dto.AuthResponse;
import com.smartoutlet.auth.dto.LoginRequest;
import com.smartoutlet.auth.dto.RegisterRequest;
import com.smartoutlet.auth.dto.UserResponse;
import com.smartoutlet.auth.dto.ValidationRequest;

@SuppressWarnings("hiding")
public interface AuthApplicationService<AuthApplicationService> {
    
    AuthResponse login(LoginRequest request);
    
    AuthResponse register(RegisterRequest request);
    
    AuthResponse validateToken(ValidationRequest request);
    
    UserResponse getUserById(Long id);
    
    UserResponse getUserByUsername(String username);
    
    List<UserResponse> getAllUsers();
    
    UserResponse updateUser(Long id, RegisterRequest request);
    
    void deleteUser(Long id);
    
    void logout(String token);
    
    AuthResponse refreshToken(String refreshToken);
} 