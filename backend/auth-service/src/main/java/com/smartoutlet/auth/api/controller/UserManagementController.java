package com.smartoutlet.auth.api.controller;

import com.smartoutlet.auth.domain.entity.User;
import com.smartoutlet.auth.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "CRUD operations for user management")
@SecurityRequirement(name = "bearer-key")
public class UserManagementController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("@permissionService.canAccess('USER_READ')")
    @Operation(summary = "Get All Users", description = "Retrieve all users with pagination")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<Map<String, Object>>> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        
        Page<Map<String, Object>> userResponses = users.map(this::convertToUserResponse);
        
        return ResponseEntity.ok(userResponses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@permissionService.canAccess('USER_READ') or @permissionService.isOwnerOrAdmin(#id)")
    @Operation(summary = "Get User by ID", description = "Retrieve a specific user by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(this::convertToUserResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/enable")
    @PreAuthorize("@permissionService.canAccess('USER_UPDATE')")
    @Operation(summary = "Enable User", description = "Enable a user account")
    public ResponseEntity<Map<String, String>> enableUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setIsEnabled(true);
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "User enabled successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/disable")
    @PreAuthorize("@permissionService.canAccess('USER_UPDATE')")
    @Operation(summary = "Disable User", description = "Disable a user account")
    public ResponseEntity<Map<String, String>> disableUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setIsEnabled(false);
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("message", "User disabled successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@permissionService.canAccess('USER_DELETE')")
    @Operation(summary = "Delete User", description = "Delete a user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User deleted successfully"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/search")
    @PreAuthorize("@permissionService.canAccess('USER_READ')")
    @Operation(summary = "Search Users", description = "Search users by username or email")
    public ResponseEntity<List<Map<String, Object>>> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email) {
        
        List<User> users;
        
        if (username != null && !username.trim().isEmpty()) {
            users = userRepository.findByUsername(username)
                    .map(List::of)
                    .orElse(List.of());
        } else if (email != null && !email.trim().isEmpty()) {
            users = userRepository.findByEmail(email)
                    .map(List::of)
                    .orElse(List.of());
        } else {
            users = List.of();
        }
        
        List<Map<String, Object>> userResponses = users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userResponses);
    }

    private Map<String, Object> convertToUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("fullName", user.getFullName());
        response.put("employeeId", user.getEmployeeId() != null ? user.getEmployeeId() : "");
        response.put("department", user.getDepartment() != null ? user.getDepartment() : "");
        response.put("position", user.getPosition() != null ? user.getPosition() : "");
        response.put("isEnabled", user.getIsEnabled());
        response.put("roles", user.getRoleNames());
        response.put("permissions", user.getPermissionNames());
        response.put("lastLoginAt", user.getLastLoginAt());
        response.put("createdAt", user.getCreatedAt());
        return response;
    }
}