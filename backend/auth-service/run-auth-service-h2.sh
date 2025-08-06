
#!/bin/bash

# Auth Service H2 Deployment Runner Script
# This script builds the common module and runs the auth service with H2 database

echo "🔧 Building common module..."
cd ../common-module || { echo "❌ Failed to navigate to common module"; exit 1; }

mvn clean install || { echo "❌ Failed to build common module"; exit 1; }

echo "✅ Common module built successfully."
echo "=========================================="

cd ../auth-service || { echo "❌ Failed to navigate to auth-service module"; exit 1; }

echo "🚀 Starting Auth Service with H2 Database..."
echo "=========================================="
echo "📊 H2 Console will be available at: http://0.0.0.0:8081/h2-console"
echo "📊 JDBC URL: jdbc:h2:mem:smartoutlet_auth"
echo "📊 Username: sa"
echo "📊 Password: (leave empty)"
echo "📊 API Documentation: http://0.0.0.0:8081/swagger-ui.html"
echo "=========================================="

# Check if port 8081 is already in use
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 8081 is already in use!"
    echo "   Stopping existing process..."
    lsof -ti:8081 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "✅ Port cleared, starting auth service with H2..."

# Run the auth service with H2 profile
mvn spring-boot:run \
    -Dspring-boot.run.profiles=h2

echo "🏁 Auth service stopped."
