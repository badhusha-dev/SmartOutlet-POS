# SmartOutlet POS - Microservices Architecture

**A comprehensive Point of Sale system built with Spring Boot microservices**

## 🏗️ System Architecture

SmartOutlet POS is built using a microservices architecture with 8 independent services, each handling specific business domains:

### 🔐 **Auth Service** (Port 8081)
- **Purpose**: Authentication and authorization
- **Features**: JWT-based authentication, role-based access control (ADMIN/STAFF)
- **Database**: H2 (dev) / PostgreSQL (prod)
- **API Docs**: http://localhost:8081/swagger-ui/index.html

### 🌐 **API Gateway** (Port 8080)
- **Purpose**: Central routing and service aggregation
- **Features**: Request routing, load balancing, service discovery
- **Dependencies**: All backend services
- **API Docs**: http://localhost:8080/swagger-ui/index.html

### 📦 **Product Service** (Port 8082)
- **Purpose**: Product catalog and inventory management
- **Features**: Product CRUD, category management, pricing, stock tracking
- **Kafka Topics**: product-events, inventory-updates, price-updates
- **API Docs**: http://localhost:8082/swagger-ui/index.html

### 🏪 **Outlet Service** (Port 8083)
- **Purpose**: Multi-outlet management
- **Features**: Outlet CRUD, location management, outlet-specific configurations
- **Kafka Topics**: outlet-events, outlet-updates
- **API Docs**: http://localhost:8083/swagger-ui/index.html

### 💰 **Expense Service** (Port 8084)
- **Purpose**: Expense tracking and financial management
- **Features**: Expense recording, categorization, reporting
- **Kafka Topics**: Consumes sales-events for expense analysis
- **API Docs**: http://localhost:8084/swagger-ui/index.html

### 🛒 **POS Service** (Port 8085)
- **Purpose**: Point of sale transactions
- **Features**: Sales processing, payment handling, receipt generation
- **Kafka Topics**: sales-events, payment-events
- **API Docs**: http://localhost:8085/swagger-ui/index.html

### 📊 **Inventory Service** (Port 8086)
- **Purpose**: Advanced inventory management
- **Features**: Stock levels, reorder points, inventory tracking
- **Dependencies**: Product Service integration
- **API Docs**: http://localhost:8086/swagger-ui/index.html

### 🍽️ **Recipe Service** (Port 8087)
- **Purpose**: Recipe and Bill of Materials (BOM) management
- **Features**: Recipe creation, ingredient tracking, cost calculation
- **Dependencies**: Product Service for ingredients
- **API Docs**: http://localhost:8087/swagger-ui/index.html

## 🚀 Quick Start

### Development Mode (Recommended)
```bash
# Start all 8 services
cd backend
./start-dev-services.sh

# Or use the Run button in Replit
```

### Stop Services
```bash
cd backend
./stop-dev-services.sh
```

## 📋 Service Dependencies

### Infrastructure Services
- **PostgreSQL**: Primary database for production
- **H2 Database**: In-memory database for development/testing
- **Apache Kafka**: Event streaming and service communication
- **Redis**: Caching layer (optional)

### Build Dependencies
- **Java 21**: Runtime environment
- **Maven 3.9+**: Build tool and dependency management
- **Common Module**: Shared DTOs and utilities across services

## 🔗 Service Communication

### Synchronous Communication
- **REST APIs**: Direct service-to-service HTTP calls
- **API Gateway**: Centralized routing for external requests

### Asynchronous Communication
- **Kafka Events**: Event-driven architecture for loose coupling
- **Event Topics**: 
  - `product-events`, `inventory-updates`, `price-updates`
  - `outlet-events`, `outlet-updates`
  - `sales-events`, `payment-events`

## 🛠️ Development Features

### Built-in Capabilities
- **API Documentation**: Swagger/OpenAPI for all services
- **Health Checks**: Service monitoring endpoints
- **Centralized Logging**: Structured JSON logging
- **Exception Handling**: Global error handling with detailed responses
- **Security**: JWT authentication with role-based access
- **Database Migrations**: Flyway for schema management

### Development Tools
- **Hot Reload**: Spring Boot DevTools enabled
- **Debug Support**: Remote debugging ports configured
- **Log Aggregation**: Centralized logs in `backend/logs/`
- **Service Scripts**: Easy start/stop/restart commands

## 📊 Current Status

### ✅ Production Ready Services (6/8)
- Auth Service - Complete JWT implementation
- API Gateway - Full routing configuration
- Product Service - Complete CRUD with Kafka
- Outlet Service - Multi-outlet management
- Expense Service - Financial tracking
- POS Service - Transaction processing

### 🚧 In Development (2/8)
- Inventory Service - Advanced stock management
- Recipe Service - BOM and recipe management

## 🎯 Business Capabilities

### Multi-Tenant Architecture
- **Multi-Outlet Support**: Manage multiple retail locations
- **Role-Based Access**: ADMIN and STAFF role separation
- **Outlet-Specific Data**: Isolated data per outlet

### Real-Time Features
- **Event-Driven Updates**: Real-time inventory and sales updates
- **Live Transaction Processing**: Immediate POS transaction handling
- **Async Communication**: Non-blocking service interactions

### Scalability Features
- **Microservices Architecture**: Independent service scaling
- **Event Streaming**: High-throughput message processing
- **Database Isolation**: Separate schemas per service

## 🔧 Configuration

### Environment Profiles
- **Development**: H2 database, local Kafka, debug logging
- **Testing**: In-memory databases, mock services
- **Production**: PostgreSQL, external Kafka, optimized logging

### Port Configuration
```
Auth Service:      8081
Product Service:   8082  
Outlet Service:    8083
Expense Service:   8084
POS Service:       8085
Inventory Service: 8086
Recipe Service:    8087
API Gateway:       8080
```

## 📈 Performance & Monitoring

### Metrics
- **Application Metrics**: Via Spring Boot Actuator
- **Business Metrics**: Custom metrics per service
- **JVM Metrics**: Memory, GC, thread monitoring
- **Database Metrics**: Connection pool monitoring

### Health Monitoring
- **Service Health**: `/actuator/health` endpoints
- **Dependency Checks**: Database and Kafka connectivity
- **Custom Health Indicators**: Business-specific health checks

## 🚨 Error Handling

### Comprehensive Error Management
- **Global Exception Handlers**: Consistent error responses
- **Validation Errors**: Field-level validation with detailed messages
- **Business Errors**: Domain-specific error handling
- **Technical Errors**: Infrastructure failure handling

### Error Response Format
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input parameters",
  "path": "/products",
  "validationErrors": {
    "name": "Name is required",
    "price": "Price must be positive"
  }
}