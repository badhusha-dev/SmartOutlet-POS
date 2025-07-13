# SmartOutlet API Gateway

This is the API Gateway for the SmartOutlet POS microservices system, built with Spring Cloud Gateway.

## Features
- **Routing**: Proxies requests to backend services:
  - `/auth/**` → auth-service (`http://localhost:8081`)
  - `/outlets/**` → outlet-service (`http://localhost:8082`)
  - `/products/**` → product-service (`http://localhost:8084`)
  - `/sales/**` → sales-service (`http://localhost:8085`)
  - `/expenses/**` → expense-service (`http://localhost:8083`)
- **Global CORS**: Allows all origins, methods, and headers (for development).
- **JWT Token Forwarding**: Forwards the `Authorization` header to downstream services via a global filter.
- **Request Logging**: Logs all incoming requests (method, path, headers).

## Configuration
- Routes and service URIs are configured in `src/main/resources/application.properties`.
- CORS and filters are configured in the Java package `com.smartoutlet.gateway.config` and `com.smartoutlet.gateway.filter`.

## Running the Gateway
1. Make sure all backend services are running on their respective ports.
2. Build and run the gateway:
   ```sh
   cd backend/api-gateway
   mvn clean package
   java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
   ```
   Or use your preferred Spring Boot run method.

## Development Notes
- The gateway runs on port `8080` by default.
- For production, restrict CORS and secure the gateway as needed.
- JWT authentication is forwarded but not validated at the gateway; validation is handled by downstream services.

---

For more details, see the main project README or the documentation for each microservice. 