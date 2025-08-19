
# SmartOutlet POS - Complete Microservices Point of Sale System

A comprehensive, production-ready Point of Sale system built with modern microservices architecture, featuring 8 independent Spring Boot services and a React frontend with advanced features.

## 🎯 Project Overview

SmartOutlet POS is a full-featured retail management system designed for multi-outlet businesses. Built with microservices architecture, it provides scalable, maintainable, and robust solutions for modern retail operations.

## 🏗️ System Architecture

### Backend Microservices (8 Services)
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
│ Outlet Service  │    │  POS Service    │    │Inventory Service│
│  (Port 8083)    │    │  (Port 8085)    │    │  (Port 8086)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Recipe Service   │    │Expense Service  │    │ Common Module   │
│ (Port 8087)     │    │ (Port 8084)     │    │  (Shared)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Backend Technologies
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Build Tool**: Maven 3.9+
- **Database**: H2 (Development) / PostgreSQL (Production)
- **Security**: Spring Security + JWT Authentication
- **Documentation**: OpenAPI 3.0 + Swagger UI
- **Database Migration**: Flyway
- **Connection Pool**: HikariCP
- **Event Streaming**: Apache Kafka (Ready for async communication)

### Frontend Technologies
- **Framework**: React 18 with modern hooks
- **Build Tool**: Vite (Fast development and building)
- **Styling**: TailwindCSS with custom coral theme
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Tables**: AG Grid React (Enterprise features)
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **PDF Generation**: @react-pdf/renderer
- **Date Handling**: date-fns

### Development Tools
- **Code Quality**: ESLint + Prettier
- **Hot Reload**: Spring Boot DevTools + Vite HMR
- **API Testing**: Swagger UI integration
- **Health Monitoring**: Spring Boot Actuator
- **Logging**: Logback with structured JSON

### Infrastructure Ready
- **Containerization**: Docker support
- **Service Discovery**: Eureka (configurable)
- **Configuration**: Spring Cloud Config (ready)
- **Caching**: Redis integration ready
- **Load Balancing**: Spring Cloud Gateway

## ✅ Current Implementation Status

### 🎯 Production Ready (100% Complete)
- **🔐 Auth Service** - Complete JWT authentication with role-based access
- **🌐 API Gateway** - Full service routing and security integration
- **🏪 Outlet Service** - Multi-outlet management with staff roles
- **📦 Product Service** - Complete product catalog with categories
- **💰 Expense Service** - Expense tracking with categorization
- **🛒 POS Service** - Transaction processing and sales management
- **📊 Inventory Service** - Advanced stock management with tracking
- **👨‍🍳 Recipe Service** - Recipe and BOM management
- **🎨 React Frontend** - Complete UI with role-based access control

### 🔑 Key Features Implemented

#### Authentication & Security
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Staff, Outlet Manager, etc.)
- Protected routes and API endpoints
- Session management with localStorage persistence

#### Business Management
- **Multi-outlet Operations** with role-based permissions
- **Product Catalog** with categories and inventory tracking
- **Point of Sale** with real-time transaction processing
- **Expense Tracking** with approval workflows
- **Staff Management** with role assignments
- **Recipe Management** with Bill of Materials (BOM)

#### Advanced UI Features
- **Dark/Light Theme** toggle with system preference
- **Responsive Design** for all devices (mobile-first)
- **AG Grid Integration** with advanced data management
- **PDF Report Generation** with multiple report types
- **Real-time Updates** with 30-second auto-refresh
- **Export Functionality** (CSV, Excel, PDF, Print)

#### Data Management
- **Advanced Filtering** and sorting capabilities
- **Pagination** with customizable page sizes
- **Custom Cell Renderers** for rich data display
- **Real-time Validation** with error handling
- **Optimistic Updates** for better UX

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (Required for backend services)
- **Node.js 18+** (Required for frontend)
- **Maven 3.9+** (Automatically downloaded if not available)

### Option 1: Complete System Startup
```bash
# Clone and navigate to project
cd SmartOutlet-POS

# Start all backend services (8 services)
cd backend
./start-all-services.sh

# In another terminal, start frontend
cd frontend
npm install
npm run dev
```

### Option 2: Individual Service Management
```bash
# Backend services individually
cd backend/auth-service && mvn spring-boot:run
cd backend/api-gateway && mvn spring-boot:run
cd backend/product-service && mvn spring-boot:run
# ... and so on for each service

# Frontend development server
cd frontend
./scripts/frontend.sh dev
```

## 🌐 Service Access Points

| Service | Port | Context | Swagger UI | Health Check |
|---------|------|---------|------------|--------------|
| **API Gateway** | 8080 | `/` | [Swagger](http://localhost:8080/swagger-ui.html) | [Health](http://localhost:8080/actuator/health) |
| **Auth Service** | 8081 | `/` | [Swagger](http://localhost:8081/swagger-ui.html) | [Health](http://localhost:8081/actuator/health) |
| **Product Service** | 8082 | `/` | [Swagger](http://localhost:8082/swagger-ui.html) | [Health](http://localhost:8082/actuator/health) |
| **Outlet Service** | 8083 | `/` | [Swagger](http://localhost:8083/swagger-ui.html) | [Health](http://localhost:8083/actuator/health) |
| **Expense Service** | 8084 | `/` | [Swagger](http://localhost:8084/swagger-ui.html) | [Health](http://localhost:8084/actuator/health) |
| **POS Service** | 8085 | `/` | [Swagger](http://localhost:8085/swagger-ui.html) | [Health](http://localhost:8085/actuator/health) |
| **Inventory Service** | 8086 | `/api/inventory` | [Swagger](http://localhost:8086/api/inventory/swagger-ui.html) | [Health](http://localhost:8086/api/inventory/actuator/health) |
| **Recipe Service** | 8087 | `/api/recipe` | [Swagger](http://localhost:8087/api/recipe/swagger-ui.html) | [Health](http://localhost:8087/api/recipe/actuator/health) |
| **Frontend** | 3000 | `/` | - | - |

## 📱 Frontend Features

### Role-Based Access Control
- **Admin**: Full system access, outlet management, user administration
- **Outlet Manager**: Outlet-specific management, staff oversight
- **Outlet Staff**: Limited operations, task management
- **Viewer**: Read-only access to assigned outlets

### Advanced UI Components
- **AG Grid Data Tables** with enterprise features
- **PDF Report Generation** with custom templates
- **Interactive Dashboards** with real-time analytics
- **Modal Forms** with validation and error handling
- **Toast Notifications** for user feedback
- **Loading States** and skeleton screens

### Modern Design System
- **Coral Theme** with custom TailwindCSS configuration
- **Typography**: Inter font family with proper hierarchy
- **Components**: Consistent button variants, form styling
- **Responsive**: Mobile-first approach with touch-friendly interactions

## 🔧 Configuration

### Environment Profiles
```bash
# Development (Default)
spring.profiles.active=local    # H2 database, debug logging

# Production
spring.profiles.active=prod     # PostgreSQL, optimized settings

# Testing
spring.profiles.active=test     # In-memory database, fast startup
```

### Database Configuration
- **Development**: H2 in-memory database (auto-created)
- **Production**: PostgreSQL with connection pooling
- **Migrations**: Flyway for schema management

### Frontend Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_DEV_MODE=true
VITE_DISABLE_AUTH=false
```

## 📊 API Documentation

Each service provides comprehensive API documentation via Swagger UI:
- **OpenAPI 3.0** specification
- **Interactive Testing** directly from browser
- **Request/Response Examples** with mock data
- **Schema Documentation** with field descriptions

## 🛡️ Security Features

### Authentication
- **JWT Tokens** with configurable expiration
- **Role-Based Access** with granular permissions
- **Session Management** with automatic logout
- **Password Security** with BCrypt hashing

### API Security
- **CORS Configuration** for cross-origin requests
- **Input Validation** on all endpoints
- **Error Handling** without information leakage
- **Audit Logging** for security events

## 📈 Performance & Monitoring

### Health Monitoring
- **Actuator Endpoints** for service health
- **Custom Health Indicators** for business logic
- **JVM Metrics** monitoring (memory, threads, GC)
- **Database Connection** monitoring

### Performance Optimizations
- **Connection Pooling** with HikariCP
- **Caching Ready** with Redis integration
- **Async Processing** with Kafka events
- **Optimized Queries** with JPA/Hibernate

## 🎯 Business Capabilities

### Multi-Tenant Support
- **Multi-Outlet Management** with isolated data
- **Role-Based Permissions** per outlet
- **Outlet-Specific Reporting** and analytics

### Real-Time Features
- **Live Data Updates** every 30 seconds
- **Event-Driven Architecture** with Kafka
- **Real-Time Inventory** tracking
- **Live Transaction Processing**

### Reporting & Analytics
- **Comprehensive Reports** with PDF generation
- **Sales Analytics** with charts and trends
- **Performance Metrics** and KPIs
- **Custom Date Ranges** and filtering

## 🚧 Future Enhancements

### Short Term
- **WebSocket Integration** for real-time notifications
- **Advanced Analytics** with predictive insights
- **Mobile App** with React Native
- **Offline Support** with service workers

### Long Term
- **AI-Powered Forecasting** for inventory and sales
- **Multi-Language Support** with i18n
- **Advanced Reporting** with custom dashboards
- **Integration APIs** for third-party systems

## 📝 Development Workflow

### Code Quality
- **ESLint Configuration** for code standards
- **Prettier Formatting** for consistency
- **Custom Hooks** for reusable logic
- **Error Boundaries** for graceful handling

### Testing Strategy
- **Unit Tests** with JUnit 5 + Mockito
- **Integration Tests** with Spring Boot Test
- **Frontend Tests** with React Testing Library
- **API Tests** via Swagger UI

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines
- Follow existing code patterns
- Add tests for new features
- Update documentation
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Project Status

**✅ PRODUCTION READY** - All 8 microservices and frontend are fully implemented, tested, and ready for deployment.

---

**SmartOutlet POS** - A modern, scalable, and feature-rich Point of Sale system built with cutting-edge technologies for the retail industry.
