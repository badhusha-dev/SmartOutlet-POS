package com.smartoutlet.auth.application.service;

import com.smartoutlet.auth.domain.entity.Role;
import com.smartoutlet.auth.domain.entity.User;
import com.smartoutlet.auth.dto.request.LoginRequest;
import com.smartoutlet.auth.dto.request.RegisterRequest;
import com.smartoutlet.auth.dto.response.AuthResponse;
import com.smartoutlet.auth.repository.RoleRepository;
import com.smartoutlet.auth.repository.UserRepository;
import com.smartoutlet.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        User user = (User) authentication.getPrincipal();
        
        // Update last login time
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return AuthResponse.builder()
                .token(jwt)
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoleNames())
                .permissions(user.getPermissionNames())
                .expiresAt(tokenProvider.getExpirationLocalDateTimeFromJWT(jwt))
                .issuedAt(tokenProvider.getIssuedAtLocalDateTimeFromJWT(jwt))
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if username exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Check if employee ID exists (if provided)
        if (registerRequest.getEmployeeId() != null && 
            userRepository.existsByEmployeeId(registerRequest.getEmployeeId())) {
            throw new RuntimeException("Employee ID is already in use!");
        }

        // Create new user
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .employeeId(registerRequest.getEmployeeId())
                .phoneNumber(registerRequest.getPhoneNumber())
                .department(registerRequest.getDepartment())
                .position(registerRequest.getPosition())
                .passwordChangedAt(LocalDateTime.now())
                .build();

        // Assign roles
        Set<Role> roles = new HashSet<>();
        if (registerRequest.getRoleNames() != null && !registerRequest.getRoleNames().isEmpty()) {
            roles = roleRepository.findByNameIn(registerRequest.getRoleNames());
        } else {
            // Assign default role if no roles specified
            Role defaultRole = roleRepository.findByName("STAFF")
                    .orElseThrow(() -> new RuntimeException("Default role STAFF not found"));
            roles.add(defaultRole);
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String jwt = tokenProvider.generateToken(savedUser);

        return AuthResponse.builder()
                .token(jwt)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .roles(savedUser.getRoleNames())
                .permissions(savedUser.getPermissionNames())
                .expiresAt(tokenProvider.getExpirationLocalDateTimeFromJWT(jwt))
                .issuedAt(tokenProvider.getIssuedAtLocalDateTimeFromJWT(jwt))
                .build();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        throw new RuntimeException("No authenticated user found");
    }

    public boolean hasPermission(String permission) {
        try {
            User user = getCurrentUser();
            return user.getPermissionNames().contains(permission);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasRole(String role) {
        try {
            User user = getCurrentUser();
            return user.getRoleNames().contains(role);
        } catch (Exception e) {
            return false;
        }
    }
}