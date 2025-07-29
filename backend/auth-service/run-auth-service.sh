#!/bin/bash

# Auth Service Runner Script
# This script runs the auth service in debug mode with dev profile

echo "🚀 Starting Auth Service in Debug Mode..."
echo "=========================================="

# Check if port 8081 is already in use
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 8081 is already in use!"
    echo "   Stopping existing process..."
    lsof -ti:8081 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Check if debug port 5005 is already in use
if lsof -Pi :5005 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Debug port 5005 is already in use!"
    echo "   Stopping existing debug process..."
    lsof -ti:5005 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "✅ Ports cleared, starting auth service..."

# Run the auth service with debug mode and dev profile
mvn spring-boot:run \
    -Dspring-boot.run.profiles=dev \
    -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

echo "🏁 Auth service stopped." 