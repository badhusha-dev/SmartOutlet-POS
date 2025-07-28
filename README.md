# 🏪 SmartOutlet POS System

A modern, cloud-native Point of Sale (POS) system built with microservices architecture using Spring Boot, React, MySQL, Kafka, and Docker.

## 🚀 Application Front Page Preview

[![Watch the demo](media/preview.png)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

> Click the image above to watch a short video demo of the application's front page in action!

## 🏗️ Architecture

### Microservices
- **Auth Service** (Port 8081) - Authentication & JWT management
- **Outlet Service** (Port 8082) - Outlet management with Kafka events
- **Product Service** (Port 8083) - Product catalog & inventory
- **POS Service** (Port 8084) - Sales transactions & receipt generation
- **Expense Service** (Port 8085) - Expense tracking & reporting
- **API Gateway** (Port 8080) - Centralized routing & CORS

### Infrastructure
- **MySQL** - Primary database for all services
- **Apache Kafka** - Event streaming for microservices communication
- **Redis** - Caching and session management
- **React Frontend** (Port 3000) - Modern web interface
- **Kafka UI** (Port 8090) - Kafka monitoring dashboard

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 11+ (for local development)
- Node.js 16+ (for frontend development)

### 1. Start the Complete System
```bash
# Clone the repository
git clone <repository-url>
cd smartoutlet-pos

# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Access the Applications
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Kafka UI**: http://localhost:8090
- **Individual Services**: 
  - Auth: http://localhost:8081/auth
  - Outlets: http://localhost:8082/outlets
  - Products: http://localhost:8083/products
  - POS: http://localhost:8084/pos
  - Expenses: http://localhost:8085/expenses

### 3. Health Checks
```bash
# Check all services status
curl http://localhost:8080/actuator/health

# Individual service health
curl http://localhost:8081/auth/actuator/health
curl http://localhost:8082/outlets/actuator/health
curl http://localhost:8083/products/actuator/health
curl http://localhost:8084/pos/actuator/health
curl http://localhost:8085/expenses/actuator/health
```

## 📁 Project Structure

```
smartoutlet-pos/
├── backend/
│   ├── auth-service/
│   ├── outlet-service/
│   ├── product-service/
│   ├── pos-service/
│   ├── expense-service/
│   └── api-gateway/
├── frontend/
├── scripts/
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Environment Variables
All services support both development and Docker environments through application.properties profiles.

#### Auth Service
```properties
# JWT Configuration
APP_JWT_SECRET=smartoutletSecretKey...
APP_JWT_EXPIRATION=86400000

# Database
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/smartoutlet_auth
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=smartoutlet123
```

#### Product Service
```properties
# Stock Configuration
APP_PRODUCT_LOW_STOCK_THRESHOLD=10
APP_PRODUCT_ENABLE_STOCK_ALERTS=true
```

#### POS Service
```properties
# Receipt Configuration
APP_POS_RECEIPT_NUMBER_PREFIX=RCP
APP_POS_AUTO_PRINT_RECEIPT=false
```

### Database Configuration
Each service has its own database:
- `smartoutlet_auth` - User management
- `smartoutlet_outlet` - Outlet data
- `smartoutlet_product` - Product catalog & inventory
- `smartoutlet_pos` - Sales transactions
- `smartoutlet_expense` - Expense records

## 🔐 Authentication & Security

### JWT Authentication
1. Register/Login through Auth Service
2. Receive JWT token in response
3. Include token in Authorization header: `Bearer <token>`
4. All services validate tokens through Auth Service

### User Roles
- **ADMIN** - Full system access
- **STAFF** - Limited access to POS and basic operations

### API Security
- CORS enabled for frontend origins
- JWT validation on protected endpoints
- Input validation and sanitization
- Rate limiting (configurable)

## 📊 API Documentation

### Auth Service (`/auth/*`)
```bash
# Register new user
POST /auth/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "ADMIN"
}

# Login
POST /auth/login
{
  "username": "admin",
  "password": "password123"
}
```

### Product Service (`/products/*`)
```bash
# Add product
POST /products
{
  "name": "Coca Cola",
  "barcode": "123456789",
  "price": 2.50,
  "categoryId": 1
}

# Update stock
PUT /products/{id}/stock
{
  "outletId": 1,
  "quantity": 100
}
```

### POS Service (`/pos/*`)
```bash
# Create sale
POST /pos/sales
{
  "outletId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 2.50
    }
  ],
  "paymentMethod": "CASH",
  "totalAmount": 5.00
}
```

## 🔄 Event-Driven Architecture

### Kafka Topics
- `outlet-events` - Outlet creation/updates
- `stock-events` - Low stock alerts
- `sales-events` - Transaction events

### Event Flow
1. **Outlet Created** → Stock initialization
2. **Sale Completed** → Stock reduction, Analytics update
3. **Low Stock** → Alert notifications

## 🛠️ Development

### Local Development Setup
```bash
# Start infrastructure only
docker-compose up mysql kafka zookeeper redis -d

# Run services locally
cd backend/auth-service && ./gradlew bootRun
cd backend/product-service && ./gradlew bootRun
# ... repeat for other services

# Run frontend
cd frontend && npm install && npm start
```

### Build & Test
```bash
# Build all services
./scripts/build-all.sh

# Run tests
./scripts/test-all.sh

# Build Docker images
docker-compose build
```

## 🏃‍♂️ Monitoring & Observability

### Health Checks
- Spring Boot Actuator endpoints
- Database connectivity checks
- Kafka connectivity validation
- Redis connectivity verification

### Logging
- Structured JSON logging
- Centralized log aggregation ready
- Debug/Info/Error level configuration
- Request/Response tracing

### Metrics
- Application metrics via Actuator
- Custom business metrics
- JVM metrics
- Database connection pool metrics

## 🚨 Exception Handling

### Global Exception Handlers
All services implement comprehensive exception handling:

- **Validation Errors** - 400 Bad Request with field details
- **Authentication Errors** - 401 Unauthorized
- **Authorization Errors** - 403 Forbidden
- **Not Found Errors** - 404 Not Found
- **Conflict Errors** - 409 Conflict (duplicates)
- **Server Errors** - 500 Internal Server Error

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
```

## 🔧 Troubleshooting

### Common Issues

#### Services Won't Start
```bash
# Check Docker resources
docker system df
docker system prune

# Restart with fresh volumes
docker-compose down -v
docker-compose up -d
```

#### Database Connection Issues
```bash
# Check MySQL logs
docker-compose logs mysql

# Verify database creation
docker exec -it smartoutlet-mysql mysql -u root -p
SHOW DATABASES;
```

#### Kafka Connection Issues
```bash
# Check Kafka logs
docker-compose logs kafka

# Verify topics
docker exec -it smartoutlet-kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### Performance Tuning
- Adjust JVM heap size in Dockerfile
- Configure connection pool sizes
- Tune Kafka consumer/producer settings
- Optimize database queries

## 📈 Scalability

### Horizontal Scaling
- Each service can be scaled independently
- Load balancer integration ready
- Stateless service design

### Database Scaling
- Read replicas for reporting
- Database sharding strategies
- Connection pooling optimization

### Caching Strategy
- Redis for session management
- Application-level caching
- Database query result caching

## 🔒 Security Best Practices

- JWT tokens with expiration
- Password hashing with BCrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot Community
- React Community
- Apache Kafka
- Docker Community

---

**Happy coding! 🚀**