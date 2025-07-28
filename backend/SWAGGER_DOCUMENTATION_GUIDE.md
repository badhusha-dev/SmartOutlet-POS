# SmartOutlet POS - Advanced Swagger Documentation Guide

## Overview

This guide documents the comprehensive Swagger/OpenAPI implementation across all SmartOutlet POS microservices, including advanced configurations, mock data examples, and testing capabilities.

## 🎯 Implementation Summary

### ✅ Completed Features

1. **Advanced OpenAPI Configurations** - Custom configurations for each service
2. **Comprehensive DTOs with Mock Data** - Rich examples for all API endpoints
3. **Enhanced Swagger Annotations** - Detailed schema descriptions and examples
4. **Service-Specific Documentation** - Tailored documentation for each microservice
5. **Mock Data Examples** - Realistic test data for API testing

## 📋 Service Documentation URLs

### Development Environment
- **Auth Service**: http://localhost:8081/swagger-ui.html
- **Product Service**: http://localhost:8082/swagger-ui.html
- **Outlet Service**: http://localhost:8083/swagger-ui.html
- **Expense Service**: http://localhost:8084/swagger-ui.html
- **API Gateway**: http://localhost:8080/swagger-ui.html

### Production Environment
- **Auth Service**: https://api.smartoutlet.com/auth/swagger-ui.html
- **Product Service**: https://api.smartoutlet.com/products/swagger-ui.html
- **Outlet Service**: https://api.smartoutlet.com/outlets/swagger-ui.html
- **Expense Service**: https://api.smartoutlet.com/expenses/swagger-ui.html

## 🔧 OpenAPI Configurations

### Auth Service Configuration
```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI authServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartOutlet Authentication Service API")
                        .description("Comprehensive authentication and authorization service")
                        .version("1.0.0"))
                .servers(List.of(
                        new Server().url("http://localhost:8081").description("Development"),
                        new Server().url("https://api.smartoutlet.com/auth").description("Production")
                ))
                .tags(List.of(
                        new Tag().name("Authentication").description("User authentication operations"),
                        new Tag().name("Users").description("User management operations"),
                        new Tag().name("Roles").description("Role and permission management")
                ));
    }
}
```

### Product Service Configuration
```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI productServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartOutlet Product Service API")
                        .description("Product catalog and inventory management service")
                        .version("1.0.0"))
                .servers(List.of(
                        new Server().url("http://localhost:8082").description("Development"),
                        new Server().url("https://api.smartoutlet.com/products").description("Production")
                ))
                .tags(List.of(
                        new Tag().name("Products").description("Product catalog management"),
                        new Tag().name("Categories").description("Product category management"),
                        new Tag().name("Inventory").description("Stock level management"),
                        new Tag().name("Stock Movements").description("Inventory transactions")
                ));
    }
}
```

## 📊 DTOs with Mock Data Examples

### Product DTO Example
```java
@Schema(description = "Product information")
public class ProductDto {
    
    @Schema(description = "Unique product identifier", example = "1")
    private Long id;
    
    @Schema(description = "Product name", example = "Premium Coffee Beans")
    private String name;
    
    @Schema(description = "Product description", example = "High-quality Arabica coffee beans sourced from Colombia")
    private String description;
    
    @Schema(description = "Stock Keeping Unit", example = "COFFEE-001")
    private String sku;
    
    @Schema(description = "Selling price", example = "15.99")
    private BigDecimal price;
    
    @Schema(description = "Current stock quantity", example = "100")
    private Integer stockQuantity;
    
    @Schema(description = "Product status", example = "ACTIVE", 
            allowableValues = {"ACTIVE", "INACTIVE", "DISCONTINUED"})
    private String status;
}
```

### Outlet DTO Example
```java
@Schema(description = "Outlet information")
public class OutletDto {
    
    @Schema(description = "Unique outlet identifier", example = "1")
    private Long id;
    
    @Schema(description = "Outlet name", example = "Downtown Coffee Shop")
    private String name;
    
    @Schema(description = "Street address", example = "123 Main Street")
    private String address;
    
    @Schema(description = "City", example = "New York")
    private String city;
    
    @Schema(description = "Phone number", example = "+1-555-0123")
    private String phone;
    
    @Schema(description = "Outlet status", example = "ACTIVE", 
            allowableValues = {"ACTIVE", "INACTIVE", "MAINTENANCE", "CLOSED"})
    private String status;
    
    @Schema(description = "Monthly revenue", example = "45000.00")
    private BigDecimal monthlyRevenue;
}
```

### Expense DTO Example
```java
@Schema(description = "Expense information")
public class ExpenseDto {
    
    @Schema(description = "Unique expense identifier", example = "1")
    private Long id;
    
    @Schema(description = "Expense description", example = "Office supplies purchase")
    private String description;
    
    @Schema(description = "Expense amount", example = "125.50")
    private BigDecimal amount;
    
    @Schema(description = "Payment method", example = "CREDIT_CARD", 
            allowableValues = {"CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER"})
    private String paymentMethod;
    
    @Schema(description = "Vendor/supplier name", example = "Office Depot")
    private String vendor;
    
    @Schema(description = "Expense status", example = "PENDING_APPROVAL", 
            allowableValues = {"PENDING_APPROVAL", "APPROVED", "REJECTED", "PAID"})
    private String status;
}
```

## 🧪 Testing with Mock Data

### Authentication Testing
```bash
# Register a new user
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "email": "john.doe@smartoutlet.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1-555-0123"
  }'

# Login with credentials
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "john.doe@smartoutlet.com",
    "password": "securePassword123"
  }'
```

### Product Management Testing
```bash
# Create a new product
curl -X POST http://localhost:8082/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Premium Coffee Beans",
    "description": "High-quality Arabica coffee beans sourced from Colombia",
    "sku": "COFFEE-001",
    "price": 15.99,
    "costPrice": 10.50,
    "stockQuantity": 100,
    "minStockLevel": 20,
    "categoryId": 1,
    "unitOfMeasure": "KG",
    "status": "ACTIVE"
  }'

# Get all products
curl -X GET http://localhost:8082/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Outlet Management Testing
```bash
# Create a new outlet
curl -X POST http://localhost:8083/outlets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Downtown Coffee Shop",
    "code": "DT001",
    "description": "Premium coffee shop in downtown area",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1-555-0123",
    "email": "downtown@smartoutlet.com",
    "managerId": 1,
    "openingHours": "9:00 AM - 9:00 PM",
    "status": "ACTIVE",
    "type": "COFFEE_SHOP"
  }'
```

### Expense Management Testing
```bash
# Create a new expense
curl -X POST http://localhost:8084/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Office supplies purchase",
    "amount": 125.50,
    "categoryId": 1,
    "budgetId": 1,
    "outletId": 1,
    "expenseDate": "2024-01-15",
    "paymentMethod": "CREDIT_CARD",
    "vendor": "Office Depot",
    "notes": "Monthly office supplies including paper, pens, and printer ink"
  }'
```

## 🔐 Authentication & Security

### JWT Token Usage
All protected endpoints require JWT authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Default Test Users
- **Admin User**: `admin@smartoutlet.com` / `admin123`
- **Staff User**: `staff@smartoutlet.com` / `staff123`

### Token Validation
```bash
# Validate JWT token
curl -X POST http://localhost:8081/auth/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📈 API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Premium Coffee Beans",
    "sku": "COFFEE-001",
    "price": 15.99,
    "stockQuantity": 100,
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Product with SKU COFFEE-001 already exists",
  "errorCode": "DUPLICATE_SKU",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Paginated Response
```json
{
  "content": [
    {
      "id": 1,
      "name": "Premium Coffee Beans",
      "sku": "COFFEE-001",
      "price": 15.99
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 20,
  "number": 0,
  "hasNext": false,
  "hasPrevious": false
}
```

## 🚀 Quick Start Guide

### 1. Start All Services
```bash
cd backend
./restart-all-services.sh
```

### 2. Access Swagger UI
- Open your browser and navigate to any service's Swagger UI
- Example: http://localhost:8081/swagger-ui.html

### 3. Test Authentication
1. Use the `/auth/login` endpoint to get a JWT token
2. Copy the token from the response
3. Click the "Authorize" button in Swagger UI
4. Enter: `Bearer YOUR_TOKEN_HERE`
5. Test protected endpoints

### 4. Test API Endpoints
- Use the "Try it out" button for each endpoint
- Modify the request body with the provided mock data examples
- Execute requests and view responses

## 🔧 Configuration Options

### Swagger UI Customization
```properties
# Customize Swagger UI path
springdoc.swagger-ui.path=/swagger-ui.html

# Enable/disable Swagger UI
springdoc.swagger-ui.enabled=true

# Customize API docs path
springdoc.api-docs.path=/v3/api-docs

# Enable/disable API docs
springdoc.api-docs.enabled=true
```

### Rate Limiting Configuration
```properties
# Rate limiting for authentication endpoints
app.rate-limit.auth.max-requests=10
app.rate-limit.auth.window-size=60

# Rate limiting for general endpoints
app.rate-limit.general.max-requests=100
app.rate-limit.general.window-size=60
```

## 📝 Best Practices

### 1. Mock Data Guidelines
- Use realistic but fictional data
- Include edge cases and boundary values
- Provide examples for all possible enum values
- Use consistent formatting across services

### 2. Documentation Standards
- Provide clear descriptions for all fields
- Include validation rules in descriptions
- Use consistent naming conventions
- Group related endpoints with tags

### 3. Testing Recommendations
- Test all CRUD operations
- Verify error handling scenarios
- Test authentication and authorization
- Validate response formats

## 🐛 Troubleshooting

### Common Issues

1. **Swagger UI not loading**
   - Check if the service is running
   - Verify the correct port number
   - Check browser console for errors

2. **Authentication errors**
   - Ensure JWT token is valid and not expired
   - Check token format: `Bearer <token>`
   - Verify user has required permissions

3. **CORS errors**
   - Check CORS configuration in security settings
   - Verify frontend origin is allowed

4. **Rate limiting errors**
   - Wait for rate limit window to reset
   - Check rate limiting configuration

### Debug Commands
```bash
# Check service health
curl http://localhost:8081/actuator/health

# Check service logs
tail -f backend/logs/auth-service.log

# Test database connection
curl http://localhost:8081/actuator/info
```

## 📚 Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [SpringDoc Documentation](https://springdoc.org/)
- [JWT Token Guide](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Note**: This documentation is automatically generated and updated with the latest API changes. For the most current information, always refer to the live Swagger UI for each service. 