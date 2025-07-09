package com.smartoutlet.auth.service;

import com.smartoutlet.auth.dto.*;
import com.smartoutlet.auth.entity.Role;
import com.smartoutlet.auth.entity.User;
import com.smartoutlet.auth.exception.UserNotFoundException;
import com.smartoutlet.auth.exception.UserAlreadyExistsException;
import com.smartoutlet.auth.repository.RoleRepository;
import com.smartoutlet.auth.repository.UserRepository;
import com.smartoutlet.auth.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthResponse authenticate(LoginRequest loginRequest) {
        log.info("Authenticating user: {}", loginRequest.getUsernameOrEmail());
        
        User user = userRepository.findByUsernameOrEmailWithRoles(loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with username or email: " + loginRequest.getUsernameOrEmail()));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        if (!user.getIsActive()) {
            throw new RuntimeException("User account is deactivated");
        }
        
        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate JWT token
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getId(), roleNames);
        LocalDateTime expiresAt = jwtUtil.getExpirationLocalDateTimeFromToken(token);
        
        log.info("User {} authenticated successfully", user.getUsername());
        
        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roleNames,
                expiresAt
        );
    }
    
    public UserResponse register(RegisterRequest registerRequest) {
        log.info("Registering new user: {}", registerRequest.getUsername());
        
        // Check if user already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists: " + registerRequest.getUsername());
        }
        
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists: " + registerRequest.getEmail());
        }
        
        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setIsActive(true);
        user.setIsVerified(false);
        
        // Assign default role (STAFF)
        Role defaultRole = roleRepository.findByName("STAFF")
                .orElseThrow(() -> new RuntimeException("Default role STAFF not found"));
        
        Set<Role> roles = new HashSet<>();
        roles.add(defaultRole);
        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        log.info("User {} registered successfully", savedUser.getUsername());
        
        return convertToUserResponse(savedUser);
    }
    
    public Boolean validateToken(String token) {
        try {
            return jwtUtil.validateToken(token);
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
    
    public UserResponse getUserFromToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsernameWithRoles(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        
        return convertToUserResponse(user);
    }
    
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        return convertToUserResponse(user);
    }
    
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsernameWithRoles(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        
        return convertToUserResponse(user);
    }
    
    private UserResponse convertToUserResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getIsActive(),
                user.getIsVerified(),
                user.getLastLogin(),
                user.getCreatedAt(),
                roleNames
        );
    }
}