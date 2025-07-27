package com.smartoutlet.product.config;

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
    public OpenAPI productServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartOutlet Product Service API")
                        .description("""
                                ## Product Management Service
                                
                                This service provides comprehensive product catalog and inventory management capabilities for the SmartOutlet POS system.
                                
                                ### Key Features:
                                - **Product Management**: Create, update, and manage product catalog
                                - **Category Management**: Organize products into categories and subcategories
                                - **Inventory Tracking**: Real-time stock level monitoring and alerts
                                - **Stock Movements**: Track all inventory movements (in, out, adjustments)
                                - **Pricing Management**: Flexible pricing and discount management
                                - **Barcode Management**: Support for various barcode formats
                                
                                ### Authentication:
                                All endpoints require JWT authentication. Include the token in the Authorization header:
                                ```
                                Authorization: Bearer <your-jwt-token>
                                ```
                                
                                ### Rate Limiting:
                                API calls are limited to 100 requests per minute per user.
                                
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
                        new Server().url("http://localhost:8082").description("Development Server"),
                        new Server().url("https://api.smartoutlet.com/products").description("Production Server")
                ))
                .tags(List.of(
                        new Tag().name("Products").description("Product catalog management operations"),
                        new Tag().name("Categories").description("Product category management operations"),
                        new Tag().name("Inventory").description("Stock level and inventory management"),
                        new Tag().name("Stock Movements").description("Track inventory movements and transactions"),
                        new Tag().name("Pricing").description("Product pricing and discount management"),
                        new Tag().name("Health").description("Service health and monitoring endpoints")
                ));
    }
} 