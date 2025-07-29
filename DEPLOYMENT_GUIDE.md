# 🚀 SmartOutlet POS - Deployment Guide

## 📋 Prerequisites

### System Requirements
- **OS**: Linux, macOS, or Windows with WSL2
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Java**: JDK 17+ (for local development)
- **Node.js**: Version 18+ (for frontend development)
- **Memory**: Minimum 8GB RAM recommended
- **Storage**: 10GB available space

### Network Ports
- **3306** - MySQL Database
- **9092** - Apache Kafka
- **2181** - Zookeeper
- **6379** - Redis
- **8081** - Auth Service
- **8082** - Outlet Service  
- **8083** - Product Service
- **8084** - POS Service
- **8085** - Expense Service
- **3000** - Frontend (Production)
- **5173** - Frontend (Development)

---

## 🐳 Production Deployment (Docker)

### 1. Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd smartoutlet-pos

# Start the complete system
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Production Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_DATABASE=smartoutlet_auth

# JWT Configuration  
JWT_SECRET=your_very_long_jwt_secret_key_here
JWT_EXPIRATION=86400000

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=kafka:9092

# Service URLs (for frontend)
REACT_APP_AUTH_SERVICE_URL=http://your-domain.com:8081
REACT_APP_OUTLET_SERVICE_URL=http://your-domain.com:8082
REACT_APP_PRODUCT_SERVICE_URL=http://your-domain.com:8083
REACT_APP_POS_SERVICE_URL=http://your-domain.com:8084
REACT_APP_EXPENSE_SERVICE_URL=http://your-domain.com:8085
```

### 3. Production Docker Compose Override
Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  mysql:
    restart: always
    volumes:
      - /opt/smartoutlet/mysql:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}

  auth-service:
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: production
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      APP_JWT_SECRET: ${JWT_SECRET}

  outlet-service:
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: production
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_ROOT_PASSWORD}

  product-service:
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: production
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_ROOT_PASSWORD}
```

Deploy with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 💻 Development Setup

### 1. Infrastructure Only
Start just the infrastructure components:

```bash
# Start databases and messaging
docker-compose up -d mysql kafka zookeeper redis

# Verify services are running
docker-compose ps
```

### 2. Backend Services (Local Development)
```bash
# Navigate to backend directory
cd backend

# Start all services with Maven
./start-services.sh

# Or start individual services
cd auth-service && mvn spring-boot:run
cd outlet-service && mvn spring-boot:run
cd product-service && mvn spring-boot:run
```

### 3. Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🔧 Configuration

### Database Configuration
Each service uses its own database. Default configuration:

```properties
# Auth Service
spring.datasource.url=jdbc:mysql://localhost:3306/smartoutlet_auth

# Outlet Service  
spring.datasource.url=jdbc:mysql://localhost:3306/smartoutlet_outlet

# Product Service
spring.datasource.url=jdbc:mysql://localhost:3306/smartoutlet_product
```

### Kafka Topics
Automatically created topics:
- `outlet-events` - Outlet lifecycle events
- `stock-events` - Inventory alerts
- `sales-events` - Transaction events

### Security Configuration
- JWT tokens expire in 24 hours (configurable)
- Passwords are BCrypt encrypted
- CORS enabled for frontend integration

---

## 🧪 Testing

### Health Checks
Verify all services are running:

```bash
# Test service health endpoints
curl http://localhost:8081/auth/health
curl http://localhost:8082/outlets/health  
curl http://localhost:8083/products/health
```

### API Testing
Use the Swagger UI interfaces:
- Auth Service: http://localhost:8081/swagger-ui.html
- Outlet Service: http://localhost:8082/swagger-ui.html
- Product Service: http://localhost:8083/swagger-ui.html

### Sample API Calls
```bash
# Login (get JWT token)
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin@smartoutlet.com","password":"admin123"}'

# Create a product (use token from login)
curl -X POST http://localhost:8083/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Product",
    "sku": "TEST-001", 
    "price": 9.99,
    "stockQuantity": 100
  }'

# Get all products
curl http://localhost:8083/products
```

---

## 📊 Monitoring

### Application Metrics
Each service exposes actuator endpoints:
- `/actuator/health` - Health status
- `/actuator/metrics` - Application metrics
- `/actuator/info` - Application information

### Log Monitoring
```bash
# View service logs
docker-compose logs -f auth-service
docker-compose logs -f outlet-service
docker-compose logs -f product-service

# View all logs
docker-compose logs -f
```

### Database Monitoring
```bash
# Connect to MySQL
docker-compose exec mysql mysql -u root -p

# Show databases
SHOW DATABASES;

# Check table structures
USE smartoutlet_product;
SHOW TABLES;
DESCRIBE products;
```

---

## 🔒 Security Considerations

### Production Security
1. **Change Default Passwords**
   - Update MySQL root password
   - Generate new JWT secret key
   - Update default user passwords

2. **Network Security**
   - Use reverse proxy (nginx/traefik)
   - Enable HTTPS/SSL certificates
   - Restrict database access
   - Configure firewall rules

3. **Environment Variables**
   - Never commit secrets to version control
   - Use Docker secrets or external secret management
   - Rotate credentials regularly

### SSL/HTTPS Setup
Example nginx configuration:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /auth/ {
        proxy_pass http://localhost:8081/;
    }
    
    location /outlets/ {
        proxy_pass http://localhost:8082/;
    }
    
    location /products/ {
        proxy_pass http://localhost:8083/;
    }
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### Services Won't Start
```bash
# Check port conflicts
netstat -tulpn | grep :8081

# Check Docker logs
docker-compose logs auth-service

# Restart specific service
docker-compose restart auth-service
```

#### Database Connection Issues
```bash
# Check MySQL is running
docker-compose ps mysql

# Verify database exists
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"

# Check connection from service
docker-compose logs auth-service | grep -i mysql
```

#### Kafka Issues
```bash
# Check Kafka is running
docker-compose ps kafka

# List Kafka topics
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Check consumer groups
docker-compose exec kafka kafka-consumer-groups --bootstrap-server localhost:9092 --list
```

### Service Startup Order
Services have dependencies. Recommended startup order:
1. MySQL, Kafka, Zookeeper, Redis
2. Auth Service
3. Outlet Service, Product Service
4. POS Service, Expense Service  
5. Frontend

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Each service can be scaled independently
- Use load balancers for multiple service instances
- Kafka partitions can be increased for higher throughput

### Database Scaling
- Consider read replicas for high-read workloads
- Implement database connection pooling
- Monitor query performance and add indexes

### Monitoring & Alerting
- Set up application monitoring (Prometheus + Grafana)
- Configure log aggregation (ELK stack)
- Implement health check monitoring
- Set up alerts for critical failures

---

## 🎯 Performance Optimization

### Database Optimization
- Enable connection pooling
- Add database indexes for frequently queried fields
- Implement database query caching

### Application Optimization  
- Enable JVM optimization flags
- Configure appropriate heap sizes
- Use application-level caching (Redis)

### Network Optimization
- Use nginx for static file serving
- Enable gzip compression
- Implement CDN for static assets

---

The SmartOutlet POS system is designed for easy deployment and scalability. Follow this guide for a smooth production deployment experience!