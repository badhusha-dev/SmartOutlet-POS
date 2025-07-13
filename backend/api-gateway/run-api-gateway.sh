#!/bin/bash

# API Gateway Runner Script
# This script runs the API gateway service in debug mode with dev profile

echo "🚀 Starting API Gateway in Debug Mode..."
echo "========================================"

# Check if port 8080 is already in use
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 8080 is already in use!"
    echo "   Stopping existing process..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Check if debug port 5006 is already in use
if lsof -Pi :5006 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Debug port 5006 is already in use!"
    echo "   Stopping existing debug process..."
    lsof -ti:5006 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "✅ Ports cleared, starting API gateway..."

# Run the API gateway with debug mode and dev profile
mvn spring-boot:run \
    -Dspring-boot.run.profiles=dev \
    -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5006"

echo "🏁 API gateway stopped." 