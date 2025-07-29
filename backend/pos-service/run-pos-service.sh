#!/bin/bash

# Initialize SDKMAN for Maven
source "/Users/admin/.sdkman/bin/sdkman-init.sh"

echo "Starting SmartOutlet POS Service..."

# Check if Maven wrapper exists, otherwise use maven
if [ -f "./mvnw" ]; then
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
else
    mvn spring-boot:run -Dspring-boot.run.profiles=local
fi 