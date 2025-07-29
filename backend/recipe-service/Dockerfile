FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the jar file
COPY target/recipe-service-1.0.0.jar app.jar

# Expose port
EXPOSE 8087

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8087/api/recipe/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]