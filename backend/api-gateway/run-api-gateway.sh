#!/bin/bash

# API Gateway Runner Script
# This script builds the common module and runs the API gateway service in debug mode with dev profile

echo "🔧 Building common module..."
cd ../common-module || { echo "❌ Failed to navigate to common module"; exit 1; }

mvn clean install || { echo "❌ Failed to build common module"; exit 1; }

echo "✅ Common module built successfully."
echo "=========================================="

cd ../api-gateway || { echo "❌ Failed to navigate to api-gateway module"; exit 1; }

echo "🚀 Starting API Gateway in Debug Mode..."
echo "========================================"

# Check if server is already running and restart if needed
SERVER_RUNNING=false

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "🔄 API Gateway is already running on port 8080!"
    echo "   Restarting server..."
    SERVER_RUNNING=true
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    sleep 3
fi

if lsof -Pi :5006 -sTCP:LISTEN -t >/dev/null ; then
    echo "🔄 Debug service is already running on port 5006!"
    echo "   Stopping existing debug process..."
    lsof -ti:5006 | xargs kill -9 2>/dev/null
    sleep 2
fi

if [ "$SERVER_RUNNING" = true ]; then
    echo "✅ Server restarted, starting API gateway..."
else
    echo "✅ Ports cleared, starting API gateway..."
fi

# Run the API gateway with debug mode and dev profile
mvn spring-boot:run \
    -Dspring-boot.run.profiles=dev \
    -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5006"

echo "🏁 API gateway stopped." 