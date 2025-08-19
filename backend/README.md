# SmartOutlet POS Backend System

## 🎯 **Project Overview**

SmartOutlet POS is a comprehensive microservices-based Point of Sale system for retail businesses. The backend consists of 8 fully functional microservices built with Spring Boot, each managing a specific business domain. The system supports JWT authentication, real-time inventory tracking, sales processing, recipe management, and comprehensive reporting.

---

## ✅ **Project Status: 100% COMPLETED**

All services are fully implemented, tested, and ready for production use.

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   Auth Service  │    │ Product Service │
│   (Port 8080)   │    │   (Port 8081)   │    │  (Port 8082)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  POS Service    │    │ Outlet Service  │    │Inventory Service│
│  (Port 8083)    │    │  (Port 8084)    │    │  (Port 8086)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Recipe Service   │    │Expense Service  │    │ Common Module   │
│ (Port 8087)     │    │ (Port 8085)     │    │  (Shared)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 **Services Overview**

### **1. API Gateway** ✅ **COMPLETED**
- **Port**: 8080
- **Purpose**: Central entry point for all client requests
- **Features**:
  - Service discovery and routing
  - Load balancing
  - Security filter chain
  - CORS configuration
  - Request/response logging
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/actuator/health`

### **2. Auth Service** ✅ **COMPLETED**
- **Port**: 8081
- **Purpose**: Authentication and authorization
- **Features**:
  - JWT-based authentication
  - User management with roles and permissions
  - Email verification system
  - Password reset functionality
  - Error logging with database persistence
  - 56 API endpoints available
- **Swagger UI**: `http://localhost:8081/swagger-ui/index.html`
- **Health Check**: `http://localhost:8081/actuator/health`

### **3. Product Service** ✅ **COMPLETED**
- **Port**: 8082
- **Purpose**: Product catalog and inventory management
- **Features**:
  - Product CRUD operations
  - Category management
  - Inventory tracking
  - Database migrations with Flyway
  - Error handling and validation
- **Swagger UI**: `http://localhost:8082/swagger-ui.html`
- **Health Check**: `http://localhost:8082/actuator/health`

### **4. POS Service** ✅ **COMPLETED**
- **Port**: 8083
- **Purpose**: Point of Sale transactions
- **Features**:
  - Sales transaction processing
  - Payment handling
  - Customer management
  - Receipt generation
  - Real-time inventory updates
- **Swagger UI**: `http://localhost:8083/swagger-ui.html`
- **Health Check**: `http://localhost:8083/actuator/health`

### **5. Outlet Service** ✅ **COMPLETED**
- **Port**: 8084
- **Purpose**: Outlet and staff management
- **Features**:
  - Outlet CRUD operations
  - Staff management
  - Location tracking
  - Performance metrics
- **Swagger UI**: `http://localhost:8084/swagger-ui.html`
- **Health Check**: `http://localhost:8084/actuator/health`

### **6. Inventory Service** ✅ **COMPLETED**
- **Port**: 8086
- **Purpose**: Advanced inventory management
- **Features**:
  - Inventory CRUD operations
  - Stock tracking and adjustments
  - Batch management
  - Expiry date tracking
  - FIFO/LIFO support
- **Swagger UI**: `http://localhost:8086/api/inventory/swagger-ui.html`
- **Health Check**: `http://localhost:8086/api/inventory/actuator/health`

### **7. Recipe Service** ✅ **COMPLETED**
- **Port**: 8087
- **Purpose**: Recipe and production management
- **Features**:
  - Recipe CRUD operations
  - Ingredient management
  - Production batch tracking
  - Vendor management
  - Cost calculation
- **Swagger UI**: `http://localhost:8087/api/recipe/swagger-ui.html`
- **Health Check**: `http://localhost:8087/api/recipe/actuator/health`

### **8. Expense Service** ✅ **COMPLETED**
- **Port**: 8085
- **Purpose**: Expense tracking and reporting
- **Features**:
  - Expense CRUD operations
  - Category management
  - Reporting functionality
  - Budget tracking
- **Swagger UI**: `http://localhost:8085/swagger-ui.html`
- **Health Check**: `http://localhost:8085/actuator/health`

---

## 🛠️ **Technology Stack**

### **Backend Technologies**

#### **Core Framework & Language**
- **Framework**: Spring Boot 3.x
  - *Why*: Industry-standard enterprise framework with excellent microservices support, auto-configuration, and production-ready features out of the box
- **Language**: Java 17+ (LTS)
  - *Why*: Long-term support, excellent performance, strong typing, extensive ecosystem, and enterprise-grade reliability
- **Build Tool**: Maven 3.9+
  - *Why*: Mature dependency management, excellent IDE integration, standardized project structure, and extensive plugin ecosystem

#### **Database & Persistence**
- **Database**: PostgreSQL (All Environments)
  - *Why*: ACID compliance, excellent performance, JSON support, advanced indexing, and proven scalability for enterprise applications
- **Connection Pool**: HikariCP
  - *Why*: Fastest connection pool available, lightweight, zero-overhead, and production-ready with excellent monitoring
- **Database Migration**: Flyway
  - *Why*: Version control for database schemas, automated migrations, rollback support, and team collaboration features

#### **Security & Authentication**
- **Security**: Spring Security + JWT
  - *Why*: Industry-standard security framework, stateless authentication, scalable across microservices, and extensive configuration options
- **JWT Implementation**: Custom token management
  - *Why*: Stateless authentication perfect for microservices, cross-service communication, and horizontal scaling

#### **API Documentation & Testing**
- **Documentation**: OpenAPI 3.0 + Swagger UI
  - *Why*: Interactive API documentation, automatic schema generation, built-in testing interface, and industry-standard specification
- **API Design**: RESTful principles
  - *Why*: Stateless, cacheable, uniform interface, and widely understood by developers and systems

#### **Event Streaming & Communication**
- **Event Streaming**: Apache Kafka (Ready for async communication)
  - *Why*: High-throughput messaging, event sourcing capabilities, horizontal scaling, and fault tolerance
- **Service Communication**: Synchronous REST + Asynchronous Events
  - *Why*: Immediate consistency for critical operations, eventual consistency for non-critical updates
- **Message Format**: JSON-based event schemas
  - *Why*: Human-readable, schema evolution support, and wide language support

### **Infrastructure & DevOps**

#### **Containerization & Deployment**
- **Containerization**: Docker
  - *Why*: Consistent environments across development/staging/production, easy scaling, and simplified deployment
- **Deployment Platform**: Replit (Production Ready)
  - *Why*: Integrated development and deployment, automatic scaling, built-in monitoring, and simplified DevOps

#### **Service Architecture**
- **API Gateway**: Spring Cloud Gateway
  - *Why*: Reactive gateway, excellent performance, built-in security, load balancing, and service discovery integration
- **Service Discovery**: Eureka (Configurable)
  - *Why*: Dynamic service registration, health checking, and automatic failover in distributed environments
- **Configuration**: Spring Cloud Config (Ready)
  - *Why*: Centralized configuration management, environment-specific properties, and runtime configuration updates

#### **Monitoring & Observability**
- **Health Monitoring**: Spring Boot Actuator
  - *Why*: Production-ready metrics, health checks, application insights, and operational endpoints
- **Logging**: Logback with JSON structured logging
  - *Why*: High-performance logging, structured data for analysis, and configurable log levels

#### **Caching & Performance**
- **Caching**: Redis integration (Ready)
  - *Why*: In-memory caching, session storage, distributed caching across services, and excellent performance
- **Load Balancing**: Spring Cloud Gateway + Auto-scaling
  - *Why*: Intelligent request distribution, health-aware routing, and automatic scaling based on demand

---

## 🔄 **Kafka Event Streaming Architecture**

### **How Kafka Works in SmartOutlet POS**

Apache Kafka serves as the backbone for asynchronous communication between microservices, enabling real-time data synchronization and event-driven architecture patterns.

#### **Kafka Architecture Overview**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Producers     │    │  Kafka Broker   │    │   Consumers     │
│                 │    │                 │    │                 │
│ • Auth Service  │───▶│ Topic: auth     │───▶│ • All Services  │
│ • POS Service   │───▶│ Topic: sales    │───▶│ • Analytics     │
│ • Product Svc   │───▶│ Topic: products │───▶│ • Inventory     │
│ • Inventory Svc │───▶│ Topic: inventory│───▶│ • Reporting     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### **Event Flow Patterns**

**1. Sales Transaction Flow**
```
POS Service → sales-events → [Inventory Service, Expense Service, Analytics]
```

**2. Inventory Update Flow**
```
Product Service → inventory-updates → [POS Service, Recipe Service, Alert Service]
```

**3. User Authentication Flow**
```
Auth Service → auth-events → [All Services for JWT validation cache updates]
```

### **Kafka Topics & Event Types**

#### **Core Business Topics**

| Topic | Producer | Consumers | Event Types | Purpose |
|-------|----------|-----------|-------------|---------|
| `sales-events` | POS Service | Inventory, Expense, Analytics | SALE_COMPLETED, PAYMENT_PROCESSED, RETURN_PROCESSED | Transaction processing |
| `inventory-updates` | Product, Inventory | POS, Recipe, Analytics | STOCK_UPDATED, LOW_STOCK_ALERT, REORDER_POINT | Inventory management |
| `product-events` | Product Service | POS, Inventory, Recipe | PRODUCT_CREATED, PRODUCT_UPDATED, PRICE_CHANGED | Product lifecycle |
| `auth-events` | Auth Service | All Services | USER_CREATED, USER_UPDATED, LOGIN_SUCCESS | User management |
| `outlet-events` | Outlet Service | All Services | OUTLET_CREATED, OUTLET_UPDATED, STAFF_ASSIGNED | Outlet operations |

#### **Event Schema Examples**

**Sales Event Schema**
```json
{
  "eventId": "uuid-string",
  "eventType": "SALE_COMPLETED",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "pos-service",
  "version": "1.0",
  "data": {
    "transactionId": 12345,
    "outletId": 1,
    "customerId": 456,
    "items": [
      {
        "productId": 789,
        "quantity": 2,
        "unitPrice": 15.99,
        "total": 31.98
      }
    ],
    "paymentMethod": "CREDIT_CARD",
    "totalAmount": 31.98,
    "taxAmount": 2.56,
    "discount": 0.00
  }
}
```

**Inventory Update Schema**
```json
{
  "eventId": "uuid-string",
  "eventType": "STOCK_UPDATED",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "inventory-service",
  "version": "1.0",
  "data": {
    "productId": 789,
    "outletId": 1,
    "previousStock": 100,
    "newStock": 85,
    "changeAmount": -15,
    "reason": "SALE",
    "userId": 123
  }
}
```

### **Data Flow Scenarios**

#### **Scenario 1: Customer Purchase**
```
1. Customer makes purchase at POS
   ├─ POS Service processes transaction
   ├─ POS Service publishes SALE_COMPLETED event
   │
2. Event consumers react:
   ├─ Inventory Service: Updates stock levels
   ├─ Expense Service: Records revenue
   ├─ Analytics Service: Updates sales metrics
   └─ Receipt Service: Generates receipt
   │
3. Secondary events triggered:
   ├─ Inventory Service publishes STOCK_UPDATED
   └─ If low stock: LOW_STOCK_ALERT event
```

#### **Scenario 2: Product Price Update**
```
1. Admin updates product price
   ├─ Product Service updates database
   ├─ Product Service publishes PRICE_CHANGED event
   │
2. Event consumers react:
   ├─ POS Service: Updates local price cache
   ├─ Inventory Service: Recalculates inventory value
   └─ Analytics Service: Records price history
```

#### **Scenario 3: New User Registration**
```
1. User registers in system
   ├─ Auth Service creates user account
   ├─ Auth Service publishes USER_CREATED event
   │
2. Event consumers react:
   ├─ Outlet Service: Sets up user permissions
   ├─ Analytics Service: Updates user metrics
   └─ Notification Service: Sends welcome email
```

### **Kafka Configuration**

#### **Producer Configuration**
```yaml
spring:
  kafka:
    producer:
      bootstrap-servers: localhost:9092
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all
      retries: 3
      properties:
        enable.idempotence: true
```

#### **Consumer Configuration**
```yaml
spring:
  kafka:
    consumer:
      bootstrap-servers: localhost:9092
      group-id: ${spring.application.name}
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "com.smartoutlet.*"
```

### **Event Processing Patterns**

#### **1. At-Least-Once Delivery**
- Events are guaranteed to be delivered but may be duplicated
- Services implement idempotent processing
- Uses event IDs for deduplication

#### **2. Event Sourcing**
- Critical business events are stored as immutable log
- System state can be reconstructed from events
- Supports audit trails and debugging

#### **3. CQRS (Command Query Responsibility Segregation)**
- Write operations produce events
- Read models are updated from events
- Separates read and write concerns

### **Monitoring & Observability**

#### **Kafka Metrics**
- **Producer Metrics**: Message send rate, error rate, batch size
- **Consumer Metrics**: Lag, throughput, processing time
- **Broker Metrics**: Disk usage, network I/O, partition count

#### **Event Tracking**
```java
// Example event tracking in service
@EventListener
public void handleSalesEvent(SalesEvent event) {
    log.info("Processing sales event: {}", event.getEventId());
    try {
        // Process event
        inventoryService.updateStock(event.getData());
        log.info("Successfully processed sales event: {}", event.getEventId());
    } catch (Exception e) {
        log.error("Failed to process sales event: {}", event.getEventId(), e);
        // Publish error event or retry logic
    }
}
```

### **Error Handling & Resilience**

#### **Dead Letter Topic Pattern**
```
Failed Event → Retry (3 times) → Dead Letter Topic → Manual Investigation
```

#### **Circuit Breaker Pattern**
- Prevents cascade failures
- Falls back to local data when Kafka is unavailable
- Automatically recovers when Kafka is healthy

#### **Event Replay Capability**
- Events stored with retention policy
- Can replay events for service recovery
- Supports data migration and testing

### **Development & Testing**

#### **Local Kafka Setup**
```bash
# Start Kafka with Docker Compose
docker-compose up -d kafka zookeeper

# Create topics
kafka-topics.sh --create --topic sales-events --bootstrap-server localhost:9092
kafka-topics.sh --create --topic inventory-updates --bootstrap-server localhost:9092
kafka-topics.sh --create --topic product-events --bootstrap-server localhost:9092
```

#### **Event Testing**
```bash
# Produce test event
kafka-console-producer.sh --topic sales-events --bootstrap-server localhost:9092

# Consume events
kafka-console-consumer.sh --topic sales-events --bootstrap-server localhost:9092 --from-beginning
```

---

## 📋 **Prerequisites**

### **System Requirements**
- **Java**: JDK 17 or higher
- **Maven**: 3.6+ (or use provided PowerShell scripts)
- **PostgreSQL**: 12+ (required for all environments)
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: 2GB free space

### **Database Setup**
- **PostgreSQL**: Required for all services
- **Database Creation**: Use `setup-postgresql.ps1` script to create all required databases
- **Flyway**: Automatically manages database schema and migrations
- **Local Development**: Each service uses its own database with drop/create on startup

---

## 🚀 **Quick Start Guide**

### **Option 1: Setup PostgreSQL and Start All Services**

```bash
# Navigate to the backend directory
cd D:\project\SmartOutlet-POS\backend

# Setup PostgreSQL databases (run once)
.\setup-postgresql.ps1

# Run the script to start all services
.\run-all-services.sh
```

### **Option 2: Start Services Individually**

```bash
# Start each service in separate terminals
cd auth-service && powershell -ExecutionPolicy Bypass -File download-maven.ps1
cd api-gateway && powershell -ExecutionPolicy Bypass -File download-maven.ps1
cd product-service && powershell -ExecutionPolicy Bypass -File download-maven.ps1
cd outlet-service && powershell -ExecutionPolicy Bypass -File download-maven.ps1
cd pos-service && powershell -ExecutionPolicy Bypass -File download-maven.ps1
cd inventory-service && powershell -ExecutionPolicy Bypass -File download-maven.ps1
cd recipe-service && powershell -ExecutionPolicy Bypass -File download-maven.ps1
cd expense-service && powershell -ExecutionPolicy Bypass -File download-maven.ps1
```

### **Option 3: Manual Maven Build**

```bash
# For each service directory
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

---

## 🌐 **Service Access Points**

| Service | Port | Context Path | Swagger UI | Health Check |
|---------|------|--------------|------------|--------------|
| API Gateway | 8080 | `/` | `http://localhost:8080/swagger-ui.html` | `http://localhost:8080/actuator/health` |
| Auth Service | 8081 | `/` | `http://localhost:8081/swagger-ui/index.html` | `http://localhost:8081/actuator/health` |
| Product Service | 8082 | `/` | `http://localhost:8082/swagger-ui.html` | `http://localhost:8082/actuator/health` |
| POS Service | 8083 | `/` | `http://localhost:8083/swagger-ui.html` | `http://localhost:8083/actuator/health` |
| Outlet Service | 8084 | `/` | `http://localhost:8084/swagger-ui.html` | `http://localhost:8084/actuator/health` |
| Expense Service | 8085 | `/` | `http://localhost:8085/swagger-ui.html` | `http://localhost:8085/actuator/health` |
| Inventory Service | 8086 | `/api/inventory` | `http://localhost:8086/api/inventory/swagger-ui.html` | `http://localhost:8086/api/inventory/actuator/health` |
| Recipe Service | 8087 | `/api/recipe` | `http://localhost:8087/api/recipe/swagger-ui.html` | `http://localhost:8087/api/recipe/actuator/health` |

---

## 🔧 **Configuration**

### **Environment Profiles**
- **local**: H2 in-memory database, detailed logging
- **dev**: MySQL database, development settings
- **prod**: Production settings with external database

### **Database Configuration**
- **All Environments**: PostgreSQL with connection pooling
- **Local Development**: Each service uses its own database with Flyway drop/create
- **Production**: PostgreSQL with proper connection pooling and security
- **Migrations**: Flyway for schema management and version control

### **Security Configuration**
- **JWT Secret**: Configurable via environment variables
- **Token Expiration**: 24 hours (configurable)
- **CORS**: Configured for cross-origin requests
- **Swagger UI**: Accessible without authentication

---

## 📊 **API Documentation**

All services include comprehensive API documentation via Swagger UI:

1. **Start any service** using the methods above
2. **Navigate to the Swagger UI URL** for that service
3. **Explore available endpoints** and test them directly
4. **View request/response schemas** and examples

### **Key API Categories**
- **Authentication**: Login, registration, password reset
- **Products**: CRUD operations, categories, inventory
- **Sales**: Transactions, payments, receipts
- **Inventory**: Stock management, adjustments, tracking
- **Recipes**: Recipe management, ingredients, production
- **Expenses**: Expense tracking, categories, reporting
- **Outlets**: Outlet management, staff, locations

---

## 🔍 **Monitoring & Health Checks**

### **Health Endpoints**
Each service provides health check endpoints:
- **Actuator Health**: `/actuator/health`
- **Application Info**: `/actuator/info`
- **Metrics**: `/actuator/metrics` (if enabled)

### **Logging**
- **Log Level**: Configurable per service
- **Log Format**: Structured JSON (production) or console (development)
- **Error Tracking**: Centralized error logging in Auth Service

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Service Won't Start**
```bash
# Check if port is already in use
netstat -ano | findstr :8080

# Kill process using the port
taskkill /PID <PID> /F
```

#### **Database Connection Issues**
- Ensure PostgreSQL is running and accessible
- Run `.\setup-postgresql.ps1` to create required databases
- Check database URL in `application-local.properties`
- Verify PostgreSQL credentials (default: postgres/postgres)
- Check Flyway migration logs for schema issues

#### **Swagger UI Not Accessible**
- Ensure service is running
- Check context path configuration
- Verify security configuration allows Swagger access

#### **JWT Authentication Issues**
- Check JWT secret configuration
- Verify token expiration settings
- Ensure proper Authorization header format

### **Debug Mode**
Enable debug logging by setting in `application-local.properties`:
```properties
logging.level.com.smartoutlet=DEBUG
logging.level.org.springframework.security=DEBUG
```

---

## 📁 **Project Structure**

```
backend/
├── api-gateway/          # API Gateway Service
├── auth-service/         # Authentication Service
├── product-service/      # Product Management
├── outlet-service/       # Outlet Management
├── pos-service/          # Point of Sale
├── inventory-service/    # Inventory Management
├── recipe-service/       # Recipe Management
├── expense-service/      # Expense Tracking
├── common-module/        # Shared Components
├── run-all-services.sh   # Start all services
├── restart-all-services.sh # Restart all services
└── .gitignore           # Git ignore rules
```

---

## 🔄 **Development Workflow**

### **Adding New Features**
1. **Create feature branch** from main
2. **Implement changes** in appropriate service
3. **Update API documentation** in Swagger
4. **Test locally** using provided scripts
5. **Create pull request** for review

### **Database Changes**
1. **Create Flyway migration** in `db/migration/`
2. **Update entity classes** if needed
3. **Test migration** locally
4. **Deploy to staging** for validation

### **Service Communication**
- **Synchronous**: REST APIs between services
- **Asynchronous**: Kafka events (currently disabled for local dev)
- **Security**: JWT tokens for service-to-service communication

---

## 🚀 **Deployment**

### **Local Development**
- Use provided PowerShell scripts
- H2 in-memory database
- Detailed logging enabled

### **Production Deployment**
- Use Docker containers
- MySQL database
- External configuration management
- Load balancer configuration

### **Docker Deployment**
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📈 **Performance & Scalability**

### **Current Configuration**
- **Connection Pool**: HikariCP with optimized settings
- **Caching**: Redis (configurable)
- **Load Balancing**: Round-robin (configurable)
- **Monitoring**: Actuator endpoints

### **Scaling Options**
- **Horizontal Scaling**: Deploy multiple instances
- **Database Scaling**: Read replicas, sharding
- **Caching**: Redis cluster
- **Load Balancing**: Nginx, HAProxy

---

## 🤝 **Contributing**

### **Code Standards**
- **Java**: Follow Google Java Style Guide
- **Spring Boot**: Use Spring Boot conventions
- **API Design**: RESTful principles
- **Documentation**: Include Swagger annotations

### **Testing**
- **Unit Tests**: JUnit 5 + Mockito
- **Integration Tests**: Spring Boot Test
- **API Tests**: Postman collections (if available)

---

## 📞 **Support**

### **Documentation**
- **API Documentation**: Swagger UI for each service
- **Code Comments**: Inline documentation
- **README**: This file

### **Issues**
- **Bug Reports**: Create GitHub issue
- **Feature Requests**: Submit enhancement proposal
- **Questions**: Check documentation first

---

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 **Acknowledgments**

- **Spring Boot Team**: For the excellent framework
- **Open Source Community**: For various libraries and tools
- **Development Team**: For building this comprehensive system

---

**🎯 SmartOutlet POS Backend is 100% COMPLETE and ready for production use!** 