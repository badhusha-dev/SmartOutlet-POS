# Outlet Service

## Overview

The Outlet Service is a microservice responsible for managing retail outlets in the SmartOutlet POS system. It handles outlet information, staff management, location data, and operational details for each retail location.

## Features

- 🏪 **Outlet Management** - Create, read, update, and delete outlet information
- 👥 **Staff Management** - Manage staff members and their roles at each outlet
- 📍 **Location Services** - Handle outlet addresses, coordinates, and location data
- 📊 **Operational Data** - Store opening hours, contact information, and status
- 🔄 **Event Streaming** - Kafka integration for real-time updates
- 📚 **API Documentation** - OpenAPI/Swagger documentation
- 🛡️ **Security** - JWT-based authentication and authorization

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Messaging**: Apache Kafka
- **Security**: Spring Security + JWT
- **Documentation**: OpenAPI/Swagger
- **Build Tool**: Maven

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Apache Kafka 2.8+
- Docker (optional)

## Quick Start

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE smartoutlet_outlet;

-- Create user (optional)
CREATE USER outlet_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_outlet TO outlet_user;
```

### 2. Kafka Setup

Ensure Kafka is running and create the required topics:

```bash
# Create topics for outlet events
kafka-topics.sh --create --topic outlet-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic outlet-updates --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### 3. Configuration

Create `application.yml` or set environment variables:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smartoutlet_outlet
    username: outlet_user
    password: your_password
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: outlet-service
      auto-offset-reset: earliest
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer

server:
  port: 8082

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
```

### 4. Build and Run

```bash
# Build the project
mvn clean install

# Run the service
mvn spring-boot:run

# Or use the provided script
./run-outlet-service.sh
```

### 5. Docker (Optional)

```bash
# Build Docker image
docker build -t smartoutlet-outlet-service .

# Run container
docker run -p 8082:8082 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/smartoutlet_outlet \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092 \
  smartoutlet-outlet-service
```

## API Endpoints

### Outlet Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/outlets` | Get all outlets |
| GET | `/api/outlets/{id}` | Get outlet by ID |
| POST | `/api/outlets` | Create new outlet |
| PUT | `/api/outlets/{id}` | Update outlet |
| DELETE | `/api/outlets/{id}` | Delete outlet |
| GET | `/api/outlets/search` | Search outlets by criteria |

### Staff Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/outlets/{outletId}/staff` | Get staff for outlet |
| POST | `/api/outlets/{outletId}/staff` | Add staff to outlet |
| PUT | `/api/outlets/{outletId}/staff/{staffId}` | Update staff member |
| DELETE | `/api/outlets/{outletId}/staff/{staffId}` | Remove staff from outlet |

### Location Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/outlets/nearby` | Find outlets near coordinates |
| GET | `/api/outlets/{id}/location` | Get outlet location details |
| PUT | `/api/outlets/{id}/location` | Update outlet location |

### Health & Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/actuator/health` | Service health check |
| GET | `/actuator/info` | Service information |
| GET | `/actuator/metrics` | Service metrics |

### API Documentation

- **Swagger UI**: http://localhost:8082/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8082/v3/api-docs

## Request/Response Examples

### Create Outlet

```bash
curl -X POST http://localhost:8082/api/outlets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Downtown Store",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "phone": "+1-555-0123",
    "email": "downtown@smartoutlet.com",
    "manager": "John Doe",
    "openingHours": "9:00 AM - 9:00 PM",
    "status": "ACTIVE"
  }'
```

### Get Outlets

```bash
curl -X GET http://localhost:8082/api/outlets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "content": [
    {
      "id": 1,
      "name": "Downtown Store",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "status": "ACTIVE",
      "manager": "John Doe",
      "staffCount": 15,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### Search Outlets

```bash
curl -X GET "http://localhost:8082/api/outlets/search?city=New%20York&status=ACTIVE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Kafka Events

The service publishes events to Kafka for real-time updates:

### Event Types

- `OUTLET_CREATED` - When a new outlet is created
- `OUTLET_UPDATED` - When outlet information is updated
- `OUTLET_DELETED` - When an outlet is deleted
- `STAFF_ADDED` - When staff is added to an outlet
- `STAFF_REMOVED` - When staff is removed from an outlet

### Event Schema

```json
{
  "eventType": "OUTLET_CREATED",
  "timestamp": "2024-01-15T10:30:00Z",
  "outletId": 1,
  "data": {
    "name": "Downtown Store",
    "status": "ACTIVE"
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/smartoutlet_outlet` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | Kafka bootstrap servers | `localhost:9092` |
| `SERVER_PORT` | Service port | `8082` |

## Development

### Project Structure

```
src/main/java/com/smartoutlet/outlet/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── exception/      # Custom exceptions
├── kafka/          # Kafka producers and consumers
├── repository/     # Data access layer
├── service/        # Business logic
└── util/           # Utility classes
```

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=OutletControllerTest

# Run with coverage
mvn test jacoco:report
```

### Database Schema

Key entities:
- **Outlet** - Main outlet information
- **Staff** - Staff member details
- **Location** - Geographic and address data
- **OperatingHours** - Business hours

## Monitoring & Health Checks

The service includes Spring Boot Actuator for monitoring:

- **Health Check**: `/actuator/health`
- **Metrics**: `/actuator/metrics`
- **Info**: `/actuator/info`

## Security

- JWT token validation for all endpoints
- Role-based access control
- Input validation and sanitization
- CORS configuration

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **Kafka Connection Failed**
   - Verify Kafka is running
   - Check bootstrap servers configuration
   - Ensure topics exist

3. **JWT Token Issues**
   - Verify token is valid and not expired
   - Check token format and signature
   - Ensure proper authorization headers

### Logs

Logs are written to `logs/outlet-service.log` by default. Check for:
- Application startup errors
- Database connection issues
- Kafka connection problems
- Authentication failures

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure Kafka events are properly handled

## License

This project is part of the SmartOutlet POS system. 