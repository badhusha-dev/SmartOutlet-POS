#!/bin/bash

# Expense Service Runner Script
# This script builds the common module and runs the expense service in debug mode with dev profile

echo "🔧 Building common module..."
cd ../common-module || { echo "❌ Failed to navigate to common module"; exit 1; }

mvn clean install || { echo "❌ Failed to build common module"; exit 1; }

echo "✅ Common module built successfully."
echo "=========================================="

cd ../expense-service || { echo "❌ Failed to navigate to auth-service module"; exit 1; }

echo "🚀 Starting Expense Service in Debug Mode..."
echo "============================================"

# Check if port 8084 is already in use
if lsof -Pi :8084 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 8084 is already in use!"
    echo "   Stopping existing process..."
    lsof -ti:8084 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Check if debug port 5009 is already in use
if lsof -Pi :5009 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Debug port 5009 is already in use!"
    echo "   Stopping existing debug process..."
    lsof -ti:5009 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "✅ Ports cleared, starting expense service..."

# Run the expense service with debug mode and dev profile
mvn spring-boot:run \
    -Dspring-boot.run.profiles=dev \
    -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5009"

echo "🏁 Expense service stopped." 