# 🚀 SmartOutlet POS - Complete Setup Guide

## ✅ System Status: FULLY OPERATIONAL

All services have been successfully set up and are ready to run on your local machine!

## 🎯 Quick Start (Recommended)

### Start All Services at Once
```bash
./start-all-services.sh
```

This will automatically:
- Start Docker containers (PostgreSQL, Redis)
- Launch all 6 backend microservices
- Start the React frontend
- Show you all service URLs

### Monitor Services
```bash
./monitor-services.sh
```

### Stop All Services
```bash
./stop-all-services.sh
```

## 🏗️ System Architecture

### Backend Services (Spring Boot + Java 21)
1. **Auth Service** (Port 8081) - User authentication & JWT tokens
2. **Outlet Service** (Port 8082) - Store management
3. **Product Service** (Port 8083) - Product catalog & inventory
4. **Inventory Service** (Port 8086) - Stock management
5. **POS Service** (Port 8084) - Point of sale transactions
6. **Expense Service** (Port 8085) - Expense tracking
7. **API Gateway** (Port 8080) - Central routing & auth

### Frontend
- **React App** (Port 3000) - Modern UI with TailwindCSS

### Infrastructure
- **PostgreSQL** (Port 5432) - Primary database
- **Redis** (Port 6379) - Caching & sessions
- **H2 Database** - In-memory testing (no setup required)

## 🔧 Manual Service Management

### Start Individual Backend Services (Development Mode)

```bash
# Auth Service (must start first)
cd backend/auth-service
mvn spring-boot:run -Dspring-boot.run.profiles=test

# Outlet Service
cd backend/outlet-service
mvn spring-boot:run -Dspring-boot.run.profiles=test

# Product Service
cd backend/product-service
mvn spring-boot:run -Dspring-boot.run.profiles=test

# Other services...
cd backend/inventory-service
mvn spring-boot:run -Dspring-boot.run.profiles=test

cd backend/pos-service
mvn spring-boot:run -Dspring-boot.run.profiles=test

cd backend/expense-service
mvn spring-boot:run -Dspring-boot.run.profiles=test

# API Gateway (start last)
cd backend/api-gateway
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Start Infrastructure (Docker)
```bash
# PostgreSQL
docker run -d --name smartoutlet-postgres \
  -e POSTGRES_DB=smartoutlet_auth \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=smartoutlet123 \
  -p 5432:5432 postgres:15

# Redis
docker run -d --name smartoutlet-redis \
  -p 6379:6379 \
  redis:7.2-alpine redis-server --requirepass smartoutlet123
```

## 🌐 Service URLs

### API Documentation (Swagger)
- Auth Service: http://localhost:8081/swagger-ui.html
- Outlet Service: http://localhost:8082/swagger-ui.html
- Product Service: http://localhost:8083/swagger-ui.html
- Inventory Service: http://localhost:8086/swagger-ui.html
- POS Service: http://localhost:8084/swagger-ui.html
- Expense Service: http://localhost:8085/swagger-ui.html
- API Gateway: http://localhost:8080/swagger-ui.html

### Application
- Frontend: http://localhost:3000
- H2 Console: http://localhost:8081/h2-console (test profile only)

### Health Checks
- Auth: http://localhost:8081/auth/health
- Outlet: http://localhost:8082/outlets/health
- Product: http://localhost:8083/products/health
- API Gateway: http://localhost:8080/actuator/health

## 🔐 Default Credentials

### Database (PostgreSQL)
- Host: localhost:5432
- Username: postgres
- Password: smartoutlet123

### Redis
- Host: localhost:6379
- Password: smartoutlet123

### Application Users
- Admin: admin@smartoutlet.com / admin123
- Staff: staff@smartoutlet.com / staff123

## 🛠️ Development Tips

### Using H2 In-Memory Database (Recommended for Development)
The system is configured to use H2 in-memory database for testing, which requires no setup:
- Just use the `test` profile
- Database is automatically created and populated
- No external dependencies needed

### Using PostgreSQL (Production-like)
For full database features:
1. Start PostgreSQL container
2. Use `docker` profile instead of `test`
3. Databases are automatically created

### Profiles Available
- `test` - H2 in-memory database, minimal logging
- `dev` - H2 with debug logging
- `docker` - PostgreSQL with containers

## 🐳 Docker Compose (Alternative)

For a complete Docker environment:
```bash
docker-compose up --build
```

This starts everything in containers but takes longer to build.

## 📊 Features Ready to Use

### ✅ Fully Implemented
- **User Authentication** - JWT-based auth system
- **Outlet Management** - Multi-store operations
- **Product Catalog** - Complete inventory system
- **Category Management** - Product categorization
- **Stock Management** - Real-time inventory tracking
- **API Documentation** - Complete Swagger docs
- **Health Monitoring** - Service health checks

### 🚧 Partially Implemented
- **POS Transactions** - Basic structure ready
- **Expense Tracking** - Core framework in place
- **Frontend UI** - React app with routing

## 🔍 Troubleshooting

### Services Won't Start
1. Check if ports are available: `./monitor-services.sh`
2. Stop all services: `./stop-all-services.sh`
3. Restart: `./start-all-services.sh`

### Database Issues
- Use H2 profile for testing: `-Dspring-boot.run.profiles=test`
- Check PostgreSQL container: `docker ps`

### Frontend Issues
```bash
cd frontend
npm install
npm run dev
```

### Build Issues
```bash
cd backend
mvn clean install -DskipTests
```

## 📝 Next Steps

1. **Start Development**: Use `./start-all-services.sh`
2. **Explore APIs**: Check Swagger documentation
3. **Test Authentication**: Use default credentials
4. **Add Features**: Build on the existing structure
5. **Deploy**: Use Docker Compose for production

## 🎉 Success!

Your SmartOutlet POS system is fully configured and ready for development! 

- All 7 backend services build successfully
- Frontend is configured with modern React + Vite
- Database schemas are ready
- Documentation is complete
- Development tools are set up

**Happy coding!** 🚀