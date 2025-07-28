package com.smartoutlet.pos.config;

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
    public OpenAPI posServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartOutlet POS Service API")
                        .description("""
                                ## Point of Sale (POS) Service
                                
                                This service provides comprehensive point of sale functionality for the SmartOutlet POS system, including transaction processing, customer management, and sales analytics.
                                
                                ### Key Features:
                                - **Transaction Processing**: Complete sales transaction management with multiple payment methods
                                - **Customer Management**: Customer profiles, loyalty programs, and purchase history
                                - **Receipt Generation**: Automated receipt generation and printing
                                - **Payment Processing**: Support for cash, cards, mobile payments, and gift cards
                                - **Sales Analytics**: Real-time sales reports and performance metrics
                                - **Inventory Integration**: Automatic stock updates and low stock alerts
                                - **Loyalty Program**: Points earning, redemption, and customer rewards
                                
                                ### Transaction Flow:
                                1. **Create Transaction**: Start a new sales transaction
                                2. **Add Items**: Add products with quantities and prices
                                3. **Apply Discounts**: Apply promotional codes or loyalty discounts
                                4. **Process Payment**: Accept payment through various methods
                                5. **Generate Receipt**: Create and print customer receipt
                                6. **Update Inventory**: Automatically update stock levels
                                7. **Award Points**: Add loyalty points to customer account
                                
                                ### Payment Methods:
                                - **Cash**: Traditional cash payments with change calculation
                                - **Credit Card**: EMV chip and contactless payments
                                - **Debit Card**: PIN-based debit transactions
                                - **Mobile Payment**: Apple Pay, Google Pay, Samsung Pay
                                - **Gift Card**: Store-issued gift card redemption
                                - **Loyalty Points**: Points-based payment system
                                
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
                        new Server().url("http://localhost:8085").description("Development Server"),
                        new Server().url("https://api.smartoutlet.com/pos").description("Production Server")
                ))
                .tags(List.of(
                        new Tag().name("Transactions").description("Sales transaction management operations"),
                        new Tag().name("Customers").description("Customer management and loyalty operations"),
                        new Tag().name("Payments").description("Payment processing and method management"),
                        new Tag().name("Receipts").description("Receipt generation and printing operations"),
                        new Tag().name("Analytics").description("Sales analytics and reporting operations"),
                        new Tag().name("Health").description("Service health and monitoring endpoints")
                ));
    }
} 