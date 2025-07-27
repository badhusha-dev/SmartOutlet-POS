package com.smartoutlet.outlet.config;

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
    public OpenAPI outletServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartOutlet Outlet Service API")
                        .description("""
                                ## Outlet Management Service
                                
                                This service provides comprehensive outlet and staff management capabilities for the SmartOutlet POS system.
                                
                                ### Key Features:
                                - **Outlet Management**: Create, update, and manage retail outlets
                                - **Staff Management**: Assign and manage staff members across outlets
                                - **Location Services**: Geographic location and mapping capabilities
                                - **Performance Tracking**: Outlet performance metrics and analytics
                                - **Capacity Management**: Monitor and manage outlet capacity
                                - **Amenities Tracking**: Track available amenities and services
                                
                                ### Authentication:
                                All endpoints require JWT authentication. Include the token in the Authorization header:
                                ```
                                Authorization: Bearer <your-jwt-token>
                                ```
                                
                                ### Rate Limiting:
                                API calls are limited to 100 requests per minute per user.
                                
                                ### Event Publishing:
                                This service publishes outlet lifecycle events to Kafka topics for real-time updates.
                                
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
                        new Server().url("http://localhost:8083").description("Development Server"),
                        new Server().url("https://api.smartoutlet.com/outlets").description("Production Server")
                ))
                .tags(List.of(
                        new Tag().name("Outlets").description("Outlet management operations"),
                        new Tag().name("Staff").description("Staff management and assignment operations"),
                        new Tag().name("Locations").description("Geographic location and mapping operations"),
                        new Tag().name("Performance").description("Outlet performance and analytics"),
                        new Tag().name("Events").description("Outlet lifecycle events and notifications"),
                        new Tag().name("Health").description("Service health and monitoring endpoints")
                ));
    }
} 