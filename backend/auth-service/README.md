# Auth Service

## Overview

The Auth Service is a microservice responsible for handling authentication and authorization in the SmartOutlet POS system. It provides JWT-based authentication, user management, and role-based access control.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **User Management** - User registration, login, and profile management
- 🔑 **Role-Based Access Control** - Role and permission management
- 🛡️ **Security** - Password encryption, token validation, and security headers
- 📊 **Actuator** - Health checks and monitoring endpoints
- 🗄️ **Database Migration** - Flyway for schema management
- 📚 **API Documentation** - OpenAPI/Swagger documentation

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Documentation**: OpenAPI/Swagger
- **Migration**: Flyway
- **Build Tool**: Maven

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Docker (optional)

## Quick Start

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE smartoutlet_auth;

-- Create user (optional)
CREATE USER auth_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_auth TO auth_user;
```

### 2. Configuration

Create `application.yml` or set environment variables:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smartoutlet_auth
    username: auth_user
    password: your_password
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  flyway:
    enabled: true
    baseline-on-migrate: true

server:
  port: 8081

jwt:
  secret: your-super-secret-jwt-key-here
  expiration: 86400000 # 24 hours

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the service
mvn spring-boot:run

# Or use the provided script
./run-auth-service.sh
```

### 4. Docker (Optional)

```bash
# Build Docker image
docker build -t smartoutlet-auth-service .

# Run container
docker run -p 8081:8081 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/smartoutlet_auth \
  -e SPRING_DATASOURCE_USERNAME=auth_user \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  smartoutlet-auth-service
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user and get JWT token |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/auth/logout` | Logout user (invalidate token) |
| GET | `/api/auth/me` | Get current user profile |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (Admin only) |
| GET | `/api/users/{id}` | Get user by ID |
| PUT | `/api/users/{id}` | Update user profile |
| DELETE | `/api/users/{id}` | Delete user (Admin only) |

### Health & Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/actuator/health` | Service health check |
| GET | `/actuator/info` | Service information |
| GET | `/actuator/metrics` | Service metrics |

### API Documentation

- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8081/v3/api-docs

## Request/Response Examples

### Register User

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "MANAGER"
  }'
```

### Login

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "password": "securePassword123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh-token-here",
  "user": {
    "id": 1,
    "username": "john.doe",
    "email": "john@example.com",
    "role": "MANAGER"
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/smartoutlet_auth` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRATION` | Token expiration time (ms) | `86400000` |
| `SERVER_PORT` | Service port | `8081` |

## Development

### Project Structure

```
src/main/java/com/smartoutlet/auth/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── exception/      # Custom exceptions
├── flyway/         # Database migrations
├── repository/     # Data access layer
├── service/        # Business logic
└── util/           # Utility classes
```

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthControllerTest

# Run with coverage
mvn test jacoco:report
```

### Database Migrations

Migrations are located in `src/main/resources/db/migration/` and use Flyway for version control.

```bash
# Check migration status
mvn flyway:info

# Run migrations
mvn flyway:migrate

# Clean database (development only)
mvn flyway:clean
```

## Monitoring & Health Checks

The service includes Spring Boot Actuator for monitoring:

- **Health Check**: `/actuator/health`
- **Metrics**: `/actuator/metrics`
- **Info**: `/actuator/info`

## Security

- JWT tokens for stateless authentication
- Password encryption using BCrypt
- CORS configuration
- Security headers
- Rate limiting (configurable)

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **JWT Token Invalid**
   - Check JWT secret configuration
   - Verify token expiration
   - Ensure proper token format

3. **Migration Failed**
   - Check database permissions
   - Verify migration scripts
   - Review Flyway logs

### Logs

Logs are written to `logs/auth-service.log` by default. Check for:
- Application startup errors
- Database connection issues
- Authentication failures

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Create database migrations for schema changes

## License

This project is part of the SmartOutlet POS system. 