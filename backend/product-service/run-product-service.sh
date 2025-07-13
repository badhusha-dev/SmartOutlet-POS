#!/bin/bash

# Product Service Runner Script
# This script runs the product service in debug mode with dev profile

echo "🚀 Starting Product Service in Debug Mode..."
echo "============================================"

# Check if port 8082 is already in use
if lsof -Pi :8082 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 8082 is already in use!"
    echo "   Stopping existing process..."
    lsof -ti:8082 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Check if debug port 5007 is already in use
if lsof -Pi :5007 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Debug port 5007 is already in use!"
    echo "   Stopping existing debug process..."
    lsof -ti:5007 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "✅ Ports cleared, starting product service..."

# Run the product service with debug mode and dev profile
mvn spring-boot:run \
    -Dspring-boot.run.profiles=dev \
    -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5007"

echo "🏁 Product service stopped." 