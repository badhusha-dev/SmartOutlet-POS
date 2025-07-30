package com.smartoutlet.auth.api.controller;

import com.smartoutlet.auth.application.service.AuthService;
import com.smartoutlet.auth.application.service.RefreshTokenService;
import com.smartoutlet.auth.application.service.EmailService;
import com.smartoutlet.auth.application.service.VerificationTokenService;
import com.smartoutlet.auth.application.service.PasswordResetTokenService;
import com.smartoutlet.auth.domain.entity.RefreshToken;
import com.smartoutlet.auth.domain.entity.User;
import com.smartoutlet.auth.domain.entity.VerificationToken;
import com.smartoutlet.auth.domain.entity.PasswordResetToken;
import com.smartoutlet.auth.dto.request.LoginRequest;
import com.smartoutlet.auth.dto.request.RegisterRequest;
import com.smartoutlet.auth.dto.request.PasswordResetRequest;
import com.smartoutlet.auth.dto.request.PasswordResetTokenRequest;
import com.smartoutlet.auth.dto.request.PasswordChangeRequest;
import com.smartoutlet.auth.dto.response.AuthResponse;
import com.smartoutlet.auth.dto.response.RefreshTokenResponse;
import com.smartoutlet.auth.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final VerificationTokenService verificationTokenService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @Operation(
        summary = "User Login",
        description = "Authenticate user and return JWT token with user details and permissions"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for username: {}", loginRequest.getUsername());
        
        AuthResponse authResponse = authService.login(loginRequest);
        
        log.info("Login successful for username: {}", loginRequest.getUsername());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    @Operation(
        summary = "User Registration",
        description = "Register a new user and return JWT token"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Registration successful"),
        @ApiResponse(responseCode = "400", description = "Invalid request data or user already exists"),
        @ApiResponse(responseCode = "409", description = "Username or email already exists")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("Registration attempt for username: {}", registerRequest.getUsername());
        
        AuthResponse authResponse = authService.register(registerRequest);
        
        log.info("Registration successful for username: {}", registerRequest.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping("/refresh-token")
    @Operation(
        summary = "Refresh JWT Token",
        description = "Refresh access token using a valid refresh token"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid or expired refresh token")
    })
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody Map<String, String> request) {
        String refreshTokenStr = request.get("refreshToken");
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        if (refreshTokenService.isExpired(refreshToken)) {
            refreshTokenService.deleteByUser(refreshToken.getUser());
            throw new RuntimeException("Refresh token expired. Please login again.");
        }
        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateToken(user);
        return ResponseEntity.ok(RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .build());
    }

    @PostMapping("/send-verification-email")
    @Operation(
        summary = "Send Verification Email",
        description = "Send a verification email to the current user"
    )
    public ResponseEntity<?> sendVerificationEmail() {
        User user = authService.getCurrentUser();
        VerificationToken token = verificationTokenService.createVerificationToken(user);
        String verificationUrl = "http://your-frontend-url/verify-email?token=" + token.getToken();
        emailService.sendEmail(user.getEmail(), "Verify your email", "Click the link to verify your email: " + verificationUrl);
        return ResponseEntity.ok(Map.of("message", "Verification email sent"));
    }

    @GetMapping("/verify-email")
    @Operation(
        summary = "Verify Email",
        description = "Verify a user's email using a token"
    )
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        VerificationToken verificationToken = verificationTokenService.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));
        if (verificationTokenService.isExpired(verificationToken)) {
            verificationTokenService.deleteByUser(verificationToken.getUser());
            throw new RuntimeException("Verification token expired");
        }
        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        // Save user (assume userRepository is available via authService)
        authService.saveUser(user);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @PostMapping("/request-password-reset")
    @Operation(
        summary = "Request Password Reset",
        description = "Send a password reset email to the user"
    )
    public ResponseEntity<?> requestPasswordReset(@RequestBody @Valid PasswordResetRequest request) {
        User user = authService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with this email"));
        PasswordResetToken token = passwordResetTokenService.createPasswordResetToken(user);
        String resetUrl = "http://your-frontend-url/reset-password?token=" + token.getToken();
        emailService.sendEmail(user.getEmail(), "Password Reset", "Click the link to reset your password: " + resetUrl);
        return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
    }

    @PostMapping("/reset-password")
    @Operation(
        summary = "Reset Password",
        description = "Reset password using a valid token"
    )
    public ResponseEntity<?> resetPassword(@RequestBody @Valid PasswordResetTokenRequest request) {
        PasswordResetToken token = passwordResetTokenService.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));
        if (passwordResetTokenService.isExpired(token)) {
            passwordResetTokenService.deleteByUser(token.getUser());
            throw new RuntimeException("Password reset token expired");
        }
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        authService.saveUser(user);
        passwordResetTokenService.deleteByUser(user);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @PostMapping("/change-password")
    @Operation(
        summary = "Change Password",
        description = "Change password for the current user"
    )
    public ResponseEntity<?> changePassword(@RequestBody @Valid PasswordChangeRequest request) {
        User user = authService.getCurrentUser();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        authService.saveUser(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @GetMapping("/me")
    @Operation(
        summary = "Get Current User",
        description = "Get details of the currently authenticated user"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User details retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        try {
            var user = authService.getCurrentUser();
            
            Map<String, Object> userInfo = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "department", user.getDepartment() != null ? user.getDepartment() : "",
                "position", user.getPosition() != null ? user.getPosition() : "",
                "roles", user.getRoleNames(),
                "permissions", user.getPermissionNames(),
                "lastLoginAt", user.getLastLoginAt()
            );
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            log.error("Error getting current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/check-permission")
    @Operation(
        summary = "Check Permission",
        description = "Check if the current user has a specific permission"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Permission check completed"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<Map<String, Object>> checkPermission(@RequestBody Map<String, String> request) {
        String permission = request.get("permission");
        boolean hasPermission = authService.hasPermission(permission);
        
        Map<String, Object> response = Map.of(
            "permission", permission,
            "hasPermission", hasPermission
        );
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-role")
    @Operation(
        summary = "Check Role",
        description = "Check if the current user has a specific role"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Role check completed"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<Map<String, Object>> checkRole(@RequestBody Map<String, String> request) {
        String role = request.get("role");
        boolean hasRole = authService.hasRole(role);
        
        Map<String, Object> response = Map.of(
            "role", role,
            "hasRole", hasRole
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin-only")
    @PreAuthorize("@permissionService.hasRole('ADMIN')")
    @Operation(
        summary = "Admin Only Endpoint",
        description = "Example endpoint that requires ADMIN role"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Access granted"),
        @ApiResponse(responseCode = "403", description = "Access denied - insufficient privileges")
    })
    public ResponseEntity<Map<String, String>> adminOnly() {
        return ResponseEntity.ok(Map.of(
            "message", "This endpoint is accessible only to ADMIN users",
            "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }

    @GetMapping("/manager-or-admin")
    @PreAuthorize("@permissionService.hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(
        summary = "Manager or Admin Endpoint",
        description = "Example endpoint that requires ADMIN or MANAGER role"
    )
    public ResponseEntity<Map<String, String>> managerOrAdmin() {
        return ResponseEntity.ok(Map.of(
            "message", "This endpoint is accessible to ADMIN and MANAGER users",
            "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }

    @GetMapping("/sale-access")
    @PreAuthorize("@permissionService.canAccess('SALE_CREATE')")
    @Operation(
        summary = "Sale Access Endpoint",
        description = "Example endpoint that requires SALE_CREATE permission"
    )
    public ResponseEntity<Map<String, String>> saleAccess() {
        return ResponseEntity.ok(Map.of(
            "message", "This endpoint requires SALE_CREATE permission",
            "timestamp", String.valueOf(System.currentTimeMillis())
        ));
    }
}