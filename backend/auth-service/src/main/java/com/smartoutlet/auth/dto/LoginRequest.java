package com.smartoutlet.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "User login request")
public class LoginRequest {
    
    @Schema(description = "Username or email address", example = "john.doe@smartoutlet.com", required = true)
    @NotBlank(message = "Username or email is required")
    private String usernameOrEmail;
    
    @Schema(description = "Password", example = "securePassword123", required = true)
    @NotBlank(message = "Password is required")
    private String password;
}