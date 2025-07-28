#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Smart Outlet Inventory Service ===${NC}"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Maven is not installed. Please install Maven first.${NC}"
    exit 1
fi

# Set default profile if not provided
PROFILE=${1:-dev}
echo -e "${YELLOW}Starting Inventory Service with profile: $PROFILE${NC}"

# Clean and compile
echo -e "${YELLOW}Cleaning and compiling...${NC}"
mvn clean compile

if [ $? -ne 0 ]; then
    echo -e "${RED}Compilation failed!${NC}"
    exit 1
fi

# Set JVM options
JAVA_OPTS="-Xmx512m -Xms256m"
JAVA_OPTS="$JAVA_OPTS -Dspring.profiles.active=$PROFILE"

# Database connection settings
if [ "$PROFILE" = "prod" ]; then
    JAVA_OPTS="$JAVA_OPTS -DMYSQL_URL=${MYSQL_URL:-jdbc:mysql://mysql:3306/smartoutlet_inventory}"
    JAVA_OPTS="$JAVA_OPTS -DMYSQL_USERNAME=${MYSQL_USERNAME:-root}"
    JAVA_OPTS="$JAVA_OPTS -DMYSQL_PASSWORD=${MYSQL_PASSWORD:-rootpassword}"
else
    JAVA_OPTS="$JAVA_OPTS -DMYSQL_URL=${MYSQL_URL:-jdbc:mysql://localhost:3306/smartoutlet_inventory?createDatabaseIfNotExist=true}"
    JAVA_OPTS="$JAVA_OPTS -DMYSQL_USERNAME=${MYSQL_USERNAME:-smartoutlet_user}"
    JAVA_OPTS="$JAVA_OPTS -DMYSQL_PASSWORD=${MYSQL_PASSWORD:-smartoutlet_password}"
fi

# JWT settings
JAVA_OPTS="$JAVA_OPTS -DJWT_SECRET=${JWT_SECRET:-SmartOutletJWTSecretKeyForDevelopment2024!}"

# Run the service
echo -e "${GREEN}Starting Inventory Service...${NC}"
echo -e "${YELLOW}Service will be available at: http://localhost:8086${NC}"
echo -e "${YELLOW}Swagger UI: http://localhost:8086/api/inventory/swagger-ui.html${NC}"

mvn spring-boot:run -Dspring-boot.run.jvmArguments="$JAVA_OPTS"