# API Gateway

## Overview

The API Gateway is the entry point for all client requests to the SmartOutlet POS microservices system. Built with Spring Cloud Gateway, it provides routing, load balancing, security, and cross-cutting concerns for the entire system.

## Features

- 🛣️ **Intelligent Routing** - Route requests to appropriate microservices
- 🔐 **Security Gateway** - JWT token validation and forwarding
- 🌐 **CORS Management** - Cross-origin resource sharing configuration
- 📊 **Request Logging** - Comprehensive request/response logging
- ⚡ **Load Balancing** - Distribute traffic across service instances
- 🛡️ **Rate Limiting** - Protect services from excessive requests
- 📈 **Monitoring** - Health checks and metrics collection
- 🔄 **Circuit Breaker** - Fault tolerance and resilience

## Technology Stack

- **Framework**: Spring Cloud Gateway
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Monitoring**: Spring Boot Actuator
- **Build Tool**: Maven

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- All backend services running
- Docker (optional)

## Quick Start

### 1. Configuration

Create `application.yml` or set environment variables:

```yaml
server:
  port: 8080

spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/auth/**
          filters:
            - StripPrefix=1

        - id: outlet-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/outlets/**
          filters:
            - StripPrefix=1

        - id: product-service
          uri: http://localhost:8083
          predicates:
            - Path=/api/products/**
          filters:
            - StripPrefix=1

        - id: expense-service
          uri: http://localhost:8084
          predicates:
            - Path=/api/expenses/**
          filters:
            - StripPrefix=1

        - id: sales-service
          uri: http://localhost:8085
          predicates:
            - Path=/api/sales/**
          filters:
            - StripPrefix=1

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,gateway
  endpoint:
    health:
      show-details: always
```

### 2. Build and Run

```bash
# Build the project
mvn clean install

# Run the gateway
mvn spring-boot:run

# Or use the provided script
./run-api-gateway.sh
```

### 3. Docker (Optional)

```bash
# Build Docker image
docker build -t smartoutlet-api-gateway .

# Run container
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  smartoutlet-api-gateway
```

## Service Routing

| Service | Path | Port | Description |
|---------|------|------|-------------|
| Auth Service | `/api/auth/**` | 8081 | Authentication and user management |
| Outlet Service | `/api/outlets/**` | 8082 | Outlet and staff management |
| Product Service | `/api/products/**` | 8083 | Product catalog and inventory |
| Expense Service | `/api/expenses/**` | 8084 | Expense tracking and budgets |
| Sales Service | `/api/sales/**` | 8085 | Sales transactions and reporting |

## API Endpoints

### Gateway Health & Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/actuator/health` | Gateway health check |
| GET | `/actuator/info` | Gateway information |
| GET | `/actuator/metrics` | Gateway metrics |
| GET | `/actuator/gateway/routes` | Route definitions |

### Service Endpoints

All service endpoints are accessible through the gateway:

```bash
# Auth Service
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "password"}'

# Outlet Service
curl -X GET http://localhost:8080/api/outlets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Product Service
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expense Service
curl -X GET http://localhost:8080/api/expenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Configuration

### JWT Token Forwarding

The gateway automatically forwards JWT tokens to downstream services:

```java
@Component
public class JwtForwardingFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token != null) {
            exchange.getRequest().mutate()
                .header("Authorization", token)
                .build();
        }
        return chain.filter(exchange);
    }
}
```

### CORS Configuration

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsWebFilter(source);
    }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Gateway port | `8080` |
| `AUTH_SERVICE_URL` | Auth service URL | `http://localhost:8081` |
| `OUTLET_SERVICE_URL` | Outlet service URL | `http://localhost:8082` |
| `PRODUCT_SERVICE_URL` | Product service URL | `http://localhost:8083` |
| `EXPENSE_SERVICE_URL` | Expense service URL | `http://localhost:8084` |
| `SALES_SERVICE_URL` | Sales service URL | `http://localhost:8085` |

## Development

### Project Structure

```
src/main/java/com/smartoutlet/gateway/
├── config/          # Gateway configuration
├── filter/          # Custom filters
├── exception/       # Exception handling
└── util/            # Utility classes
```

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=GatewayConfigTest

# Run with coverage
mvn test jacoco:report
```

### Custom Filters

The gateway supports custom filters for:
- Request/Response logging
- JWT token forwarding
- Rate limiting
- Request transformation

## Monitoring & Health Checks

The gateway includes comprehensive monitoring:

- **Health Check**: `/actuator/health`
- **Metrics**: `/actuator/metrics`
- **Routes**: `/actuator/gateway/routes`
- **Info**: `/actuator/info`

## Troubleshooting

### Common Issues

1. **Service Unavailable**
   - Verify all backend services are running
   - Check service URLs in configuration
   - Review service health endpoints

2. **CORS Issues**
   - Check CORS configuration
   - Verify allowed origins and methods
   - Review browser console for errors

3. **JWT Token Issues**
   - Verify token forwarding filter
   - Check token format and validity
   - Review downstream service logs

### Logs

Gateway logs include:
- Request/response details
- Routing decisions
- Error information
- Performance metrics

## Production Considerations

### Security

- Restrict CORS origins
- Implement rate limiting
- Add request validation
- Enable HTTPS
- Configure proper logging

### Performance

- Enable caching where appropriate
- Configure connection pooling
- Monitor response times
- Set up load balancing

### Monitoring

- Set up health check alerts
- Monitor error rates
- Track response times
- Configure log aggregation

## Contributing

1. Follow the existing code style
2. Add tests for new filters
3. Update documentation
4. Ensure proper error handling

## License

This project is part of the SmartOutlet POS system. 