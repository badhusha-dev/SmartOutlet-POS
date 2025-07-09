# SmartOutlet POS - Production-Ready Full-Stack Application

A modern Point of Sale system built with microservices architecture, featuring real-time event streaming and comprehensive business management capabilities.

## 🧱 Tech Stack

- **Backend:** Spring Boot (Java 17+)
- **Frontend:** React (Vite) + TailwindCSS
- **Database:** MySQL
- **Event Streaming:** Apache Kafka
- **Auth:** JWT-based authentication and role-based authorization
- **Containerization:** Docker + docker-compose

## 🏗️ Architecture

### Backend Services
- **auth-service** - Authentication & authorization with JWT
- **outlet-service** - Outlet management with Kafka events
- **product-service** - Product catalog & inventory management
- **pos-service** - Transaction processing & sales recording
- **expense-service** - Expense tracking & analytics

### Event Streaming (Kafka Topics)
- `outlet-events` - Outlet creation/updates
- `stock-events` - Low stock alerts
- `sales-events` - Transaction events

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+
- Node.js 18+

### Development Setup
```bash
# Clone and setup
git clone <repository-url>
cd smartoutlet-pos

# Start infrastructure (MySQL, Kafka)
docker-compose up -d mysql kafka zookeeper

# Start backend services
cd backend && ./start-services.sh

# Start frontend
cd frontend && npm install && npm run dev
```

### Production Deployment
```bash
# Build and start all services
docker-compose up --build
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
│   └── shared/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔑 Default Credentials

- **Admin:** admin@smartoutlet.com / admin123
- **Staff:** staff@smartoutlet.com / staff123

## 📚 API Documentation

- Auth Service: http://localhost:8081/swagger-ui.html
- Outlet Service: http://localhost:8082/swagger-ui.html
- Product Service: http://localhost:8083/swagger-ui.html
- POS Service: http://localhost:8084/swagger-ui.html
- Expense Service: http://localhost:8085/swagger-ui.html

## 🌐 Frontend

- Development: http://localhost:5173
- Production: http://localhost:3000