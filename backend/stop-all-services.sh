#!/bin/bash

# SmartOutlet POS - Stop All Services Script
# This script stops all running services

echo "🛑 Stopping SmartOutlet POS - All Services..."
echo "============================================="

# Function to stop processes on a port
stop_port() {
    local port=$1
    local service_name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "🛑 Stopping $service_name on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        echo "✅ $service_name stopped"
    else
        echo "ℹ️  $service_name not running on port $port"
    fi
}

# Stop all service ports
echo "🔍 Stopping all services..."
stop_port 8080 "API Gateway"
stop_port 8081 "Auth Service"
stop_port 8082 "Product Service"
stop_port 8083 "Outlet Service"
stop_port 8084 "Expense Service"

# Stop all debug ports
stop_port 5005 "Auth Debug"
stop_port 5006 "API Gateway Debug"
stop_port 5007 "Product Debug"
stop_port 5008 "Outlet Debug"
stop_port 5009 "Expense Debug"

# Kill any remaining Spring Boot processes
echo "🔍 Cleaning up any remaining Spring Boot processes..."
pkill -f "spring-boot:run" 2>/dev/null || echo "ℹ️  No Spring Boot processes found"

# Kill any remaining Maven processes
echo "🔍 Cleaning up any remaining Maven processes..."
pkill -f "mvn" 2>/dev/null || echo "ℹ️  No Maven processes found"

echo ""
echo "✅ All services stopped successfully!"
echo ""
echo "🚀 To start all services again, run: ./run-all-services.sh" 