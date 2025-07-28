FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the jar file
COPY target/inventory-service-1.0.0.jar app.jar

# Expose the port
EXPOSE 8086

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8086/api/inventory/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]