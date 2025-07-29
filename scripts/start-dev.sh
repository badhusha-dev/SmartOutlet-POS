#!/bin/bash

# SmartOutlet POS System - Development Startup Script
echo "🏪 Starting SmartOutlet POS System - Development Environment"
echo "=============================================================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check required ports
echo "🔍 Checking required ports..."
ports=(3000 3306 6379 8080 8081 8082 8083 8084 8085 9092 2181 8090)
for port in "${ports[@]}"; do
    if ! check_port $port; then
        echo "❌ Port $port is required but already in use"
        echo "Please stop the service using port $port or change the configuration"
        exit 1
    fi
done
echo "✅ All required ports are available"

# Start infrastructure services first
echo "🚀 Starting infrastructure services..."
docker-compose up -d postgres redis zookeeper kafka

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec smartoutlet-postgres pg_isready -U postgres; do
    echo "   PostgreSQL is starting up..."
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Wait for Kafka to be ready
echo "⏳ Waiting for Kafka to be ready..."
until docker exec smartoutlet-kafka kafka-broker-api-versions --bootstrap-server localhost:9092 >/dev/null 2>&1; do
    echo "   Kafka is starting up..."
    sleep 2
done
echo "✅ Kafka is ready"

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
until docker exec smartoutlet-redis redis-cli ping >/dev/null 2>&1; do
    echo "   Redis is starting up..."
    sleep 1
done
echo "✅ Redis is ready"

# Start application services
echo "🚀 Starting application services..."
docker-compose up -d auth-service outlet-service product-service pos-service expense-service api-gateway

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
services=("auth-service:8081" "outlet-service:8082" "product-service:8083" "pos-service:8084" "expense-service:8085" "api-gateway:8080")

for service_info in "${services[@]}"; do
    service_name=$(echo $service_info | cut -d: -f1)
    port=$(echo $service_info | cut -d: -f2)
    
    echo "   Checking $service_name..."
    retries=30
    while [ $retries -gt 0 ]; do
        if curl -f http://localhost:$port/actuator/health >/dev/null 2>&1; then
            echo "   ✅ $service_name is healthy"
            break
        fi
        retries=$((retries-1))
        sleep 2
    done
    
    if [ $retries -eq 0 ]; then
        echo "   ⚠️  $service_name is not responding after 60 seconds"
    fi
done

# Start monitoring services
echo "🚀 Starting monitoring services..."
docker-compose up -d kafka-ui

# Start frontend (if package.json exists)
if [ -f "frontend/package.json" ]; then
    echo "🚀 Starting frontend..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    npm start &
    FRONTEND_PID=$!
    cd ..
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
else
    echo "⚠️  Frontend not found, starting containerized version..."
    docker-compose up -d frontend
fi

echo ""
echo "🎉 SmartOutlet POS System is starting up!"
echo "============================================="
echo ""
echo "📱 Applications:"
echo "   Frontend:        http://localhost:3000"
echo "   API Gateway:     http://localhost:8080"
echo "   Kafka UI:        http://localhost:8090"
echo ""
echo "🔧 Individual Services:"
echo "   Auth Service:    http://localhost:8081/auth"
echo "   Outlet Service:  http://localhost:8082/outlets"
echo "   Product Service: http://localhost:8083/products"
echo "   POS Service:     http://localhost:8084/pos"
echo "   Expense Service: http://localhost:8085/expenses"
echo ""
echo "🔍 Health Checks:"
echo "   All Services:    curl http://localhost:8080/actuator/health"
echo "   Individual:      curl http://localhost:808X/actuator/health"
echo ""
echo "📊 Infrastructure:"
echo "   PostgreSQL:      localhost:5432"
echo "   Redis:           localhost:6379"
echo "   Kafka:           localhost:9092"
echo ""
echo "📝 View Logs:"
echo "   All services:    docker-compose logs -f"
echo "   Specific:        docker-compose logs -f <service-name>"
echo ""
echo "🛑 Stop Everything:"
echo "   ./scripts/stop-dev.sh"
echo ""
echo "⏰ Please wait a few moments for all services to fully initialize..."
echo "   You can monitor the logs with: docker-compose logs -f"
echo ""
echo "🚀 Happy coding!"