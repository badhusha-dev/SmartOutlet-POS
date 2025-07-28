#!/bin/bash

# Recipe Service Startup Script
echo "🧂 Starting Recipe Service..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven first."
    exit 1
fi

# Set environment variables
export SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-dev}

echo "📦 Building Recipe Service..."
mvn clean compile -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for compilation errors."
    exit 1
fi

echo "🚀 Starting Recipe Service on port 8087..."

# Set JVM options for development
export JAVA_OPTS="-Xmx1024m -Xms512m -XX:+UseG1GC"

# Database configuration
export MYSQL_URL=${MYSQL_URL:-"jdbc:mysql://localhost:3306/smartoutlet_recipe?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"}
export MYSQL_USERNAME=${MYSQL_USERNAME:-"smartoutlet_user"}
export MYSQL_PASSWORD=${MYSQL_PASSWORD:-"smartoutlet_password"}

# JWT configuration
export JWT_SECRET=${JWT_SECRET:-"SmartOutletJWTSecretKeyForDevelopment2024!"}
export JWT_EXPIRATION=${JWT_EXPIRATION:-86400000}

# Service URLs
export AUTH_SERVICE_URL=${AUTH_SERVICE_URL:-"http://localhost:8081"}
export PRODUCT_SERVICE_URL=${PRODUCT_SERVICE_URL:-"http://localhost:8083"}

# Business configuration
export RECIPE_CONSUMPTION_DEFAULT_WASTAGE_PERCENTAGE=${RECIPE_CONSUMPTION_DEFAULT_WASTAGE_PERCENTAGE:-5.0}
export RECIPE_FORECASTING_DEFAULT_DAYS_AHEAD=${RECIPE_FORECASTING_DEFAULT_DAYS_AHEAD:-30}
export RECIPE_VENDOR_LEAD_TIME_DAYS=${RECIPE_VENDOR_LEAD_TIME_DAYS:-7}

echo "📋 Configuration:"
echo "  Profile: $SPRING_PROFILES_ACTIVE"
echo "  Database: $MYSQL_URL"
echo "  Auth Service: $AUTH_SERVICE_URL"
echo "  Product Service: $PRODUCT_SERVICE_URL"
echo ""

# Run the application
mvn spring-boot:run \
  -Dspring-boot.run.jvmArguments="$JAVA_OPTS" \
  -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE

echo "✅ Recipe Service stopped."