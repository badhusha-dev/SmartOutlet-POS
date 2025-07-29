package com.smartoutlet.auth.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI authServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartOutlet Authentication Service API")
                        .description("""
                                ## Authentication & Authorization Service
                                
                                This service provides comprehensive authentication, authorization, and user management capabilities for the SmartOutlet POS system.
                                
                                ### Key Features:
                                - **JWT Authentication**: Secure token-based authentication system
                                - **User Management**: User registration, profile management, and account operations
                                - **Role-Based Access Control**: Granular permission management with roles and permissions
                                - **Password Security**: BCrypt password encryption and secure password policies
                                - **Token Management**: JWT token generation, validation, and refresh mechanisms
                                - **Session Management**: Stateless session management with secure token storage
                                
                                ### Authentication Flow:
                                1. **Register**: Create a new user account
                                2. **Login**: Authenticate and receive JWT token
                                3. **Validate**: Verify token validity and extract user information
                                4. **Refresh**: Renew expired tokens
                                5. **Logout**: Invalidate tokens and end sessions
                                
                                ### Security Features:
                                - JWT tokens expire in 24 hours (configurable)
                                - Passwords are BCrypt encrypted
                                - Rate limiting on authentication endpoints
                                - CORS configuration for frontend integration
                                
                                ### Rate Limiting:
                                Authentication endpoints are limited to 10 requests per minute per IP address.
                                
                                ### Error Handling:
                                The API returns standardized error responses with appropriate HTTP status codes.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SmartOutlet Development Team")
                                .email("dev@smartoutlet.com")
                                .url("https://smartoutlet.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8081").description("Development Server"),
                        new Server().url("https://api.smartoutlet.com/auth").description("Production Server")
                ))
                .tags(List.of(
                        new Tag().name("Authentication").description("User authentication operations"),
                        new Tag().name("Users").description("User management operations"),
                        new Tag().name("Roles").description("Role and permission management"),
                        new Tag().name("Tokens").description("JWT token management operations"),
                        new Tag().name("Security").description("Security and access control operations"),
                        new Tag().name("Health").description("Service health and monitoring endpoints")
                ));
    }
} 