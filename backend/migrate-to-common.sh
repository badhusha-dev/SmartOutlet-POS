#!/bin/bash

echo "=== SmartOutlet Common Module Migration Script ==="
echo "This script will help you migrate existing services to use the common module."
echo ""

# Build the common module first
echo "1. Building common module..."
cd common-module
mvn clean install -DskipTests
if [ $? -ne 0 ]; then
    echo "Failed to build common module. Please check the errors above."
    exit 1
fi
cd ..

echo ""
echo "2. Common module built successfully!"
echo ""

# List services that can be migrated
echo "3. Available services for migration:"
echo "   - auth-service"
echo "   - outlet-service" 
echo "   - product-service"
echo "   - pos-service"
echo "   - expense-service"
echo ""

echo "4. To migrate a service, add the following dependency to its pom.xml:"
echo "   <dependency>"
echo "       <groupId>com.smartoutlet</groupId>"
echo "       <artifactId>common-module</artifactId>"
echo "   </dependency>"
echo ""

echo "5. Then you can replace existing DTOs with common ones:"
echo "   - Replace local ApiResponse with com.smartoutlet.common.dto.ApiResponse"
echo "   - Replace local UserDto with com.smartoutlet.common.dto.UserDto"
echo "   - Use com.smartoutlet.common.constants.Constants for common values"
echo "   - Use com.smartoutlet.common.util.DateUtils for date operations"
echo ""

echo "6. Example migration for auth-service:"
echo "   - Update AuthController to use common ApiResponse"
echo "   - Update UserResponse to extend common UserDto"
echo "   - Use common constants for error codes"
echo ""

echo "Migration script completed!"
echo "Run 'mvn clean install' in the backend directory to build all modules." 