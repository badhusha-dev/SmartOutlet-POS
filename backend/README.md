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
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Build Tool**: Maven
- **Database**: PostgreSQL (All Environments)
- **Security**: Spring Security + JWT
- **Documentation**: OpenAPI 3.0 + Swagger UI
- **Database Migration**: Flyway
- **Connection Pool**: HikariCP

### **Infrastructure**
- **Containerization**: Docker
- **API Gateway**: Spring Cloud Gateway
- **Service Discovery**: Eureka (if needed)
- **Configuration**: Spring Cloud Config (if needed)

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