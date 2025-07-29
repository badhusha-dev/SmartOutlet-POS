package com.smartoutlet.expense.config;

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
    public OpenAPI expenseServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartOutlet Expense Service API")
                        .description("""
                                ## Expense Management Service
                                
                                This service provides comprehensive expense tracking, budget management, and financial reporting capabilities for the SmartOutlet POS system.
                                
                                ### Key Features:
                                - **Expense Tracking**: Record, categorize, and track business expenses
                                - **Budget Management**: Set and monitor budget allocations and spending limits
                                - **Approval Workflows**: Multi-level approval processes for expense management
                                - **Receipt Management**: Store and manage expense receipts and documentation
                                - **Financial Reporting**: Generate comprehensive expense reports and analytics
                                - **Vendor Management**: Track vendor information and payment history
                                
                                ### Authentication:
                                All endpoints require JWT authentication. Include the token in the Authorization header:
                                ```
                                Authorization: Bearer <your-jwt-token>
                                ```
                                
                                ### Rate Limiting:
                                API calls are limited to 100 requests per minute per user.
                                
                                ### File Upload:
                                Receipt images can be uploaded with a maximum file size of 10MB.
                                
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
                        new Server().url("http://localhost:8084").description("Development Server"),
                        new Server().url("https://api.smartoutlet.com/expenses").description("Production Server")
                ))
                .tags(List.of(
                        new Tag().name("Expenses").description("Expense management operations"),
                        new Tag().name("Budgets").description("Budget management and tracking"),
                        new Tag().name("Categories").description("Expense category management"),
                        new Tag().name("Approvals").description("Expense approval workflows"),
                        new Tag().name("Receipts").description("Receipt upload and management"),
                        new Tag().name("Reports").description("Financial reporting and analytics"),
                        new Tag().name("Vendors").description("Vendor management operations"),
                        new Tag().name("Health").description("Service health and monitoring endpoints")
                ));
    }
} 