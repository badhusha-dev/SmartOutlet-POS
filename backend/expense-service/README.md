# Expense Service

## Overview

The Expense Service is a microservice responsible for managing financial expenses, budgets, and cost tracking in the SmartOutlet POS system. It handles expense recording, categorization, approval workflows, and financial reporting.

## Features

- 💰 **Expense Management** - Record, track, and manage business expenses
- 📊 **Budget Tracking** - Monitor budget allocations and spending limits
- 🏷️ **Expense Categories** - Organize expenses into categories and subcategories
- ✅ **Approval Workflows** - Multi-level approval processes for expenses
- 📈 **Financial Reporting** - Generate expense reports and analytics
- 🧾 **Receipt Management** - Store and manage expense receipts
- 📱 **Mobile Support** - Mobile-friendly expense submission
- 📚 **API Documentation** - OpenAPI/Swagger documentation

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Documentation**: OpenAPI/Swagger
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
CREATE DATABASE smartoutlet_expense;

-- Create user (optional)
CREATE USER expense_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_expense TO expense_user;
```

### 2. Configuration

Create `application.yml` or set environment variables:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smartoutlet_expense
    username: expense_user
    password: your_password
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
  port: 8084

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
./run-expense-service.sh
```

### 4. Docker (Optional)

```bash
# Build Docker image
docker build -t smartoutlet-expense-service .

# Run container
docker run -p 8084:8084 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/smartoutlet_expense \
  -e SPRING_DATASOURCE_USERNAME=expense_user \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  smartoutlet-expense-service
```

## API Endpoints

### Expense Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/{id}` | Get expense by ID |
| POST | `/api/expenses` | Create new expense |
| PUT | `/api/expenses/{id}` | Update expense |
| DELETE | `/api/expenses/{id}` | Delete expense |
| GET | `/api/expenses/search` | Search expenses by criteria |

### Budget Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get all budgets |
| GET | `/api/budgets/{id}` | Get budget by ID |
| POST | `/api/budgets` | Create new budget |
| PUT | `/api/budgets/{id}` | Update budget |
| DELETE | `/api/budgets/{id}` | Delete budget |
| GET | `/api/budgets/{id}/expenses` | Get expenses for budget |

### Category Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all expense categories |
| GET | `/api/categories/{id}` | Get category by ID |
| POST | `/api/categories` | Create new category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

### Approval Workflows

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/approvals/pending` | Get pending approvals |
| POST | `/api/expenses/{id}/submit` | Submit expense for approval |
| POST | `/api/expenses/{id}/approve` | Approve expense |
| POST | `/api/expenses/{id}/reject` | Reject expense |
| GET | `/api/approvals/history` | Get approval history |

### Receipt Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses/{id}/receipt` | Upload receipt |
| GET | `/api/expenses/{id}/receipt` | Download receipt |
| DELETE | `/api/expenses/{id}/receipt` | Delete receipt |

### Reporting

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/expenses` | Generate expense report |
| GET | `/api/reports/budget` | Generate budget report |
| GET | `/api/reports/category` | Generate category report |
| GET | `/api/reports/approval` | Generate approval report |

### Health & Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/actuator/health` | Service health check |
| GET | `/actuator/info` | Service information |
| GET | `/actuator/metrics` | Service metrics |

### API Documentation

- **Swagger UI**: http://localhost:8084/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8084/v3/api-docs

## Request/Response Examples

### Create Expense

```bash
curl -X POST http://localhost:8084/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Office supplies purchase",
    "amount": 125.50,
    "categoryId": 1,
    "budgetId": 1,
    "outletId": 1,
    "expenseDate": "2024-01-15",
    "paymentMethod": "CREDIT_CARD",
    "vendor": "Office Depot",
    "notes": "Monthly office supplies"
  }'
```

### Get Expenses

```bash
curl -X GET http://localhost:8084/api/expenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "content": [
    {
      "id": 1,
      "description": "Office supplies purchase",
      "amount": 125.50,
      "category": "Office Supplies",
      "status": "PENDING_APPROVAL",
      "submittedBy": "john.doe",
      "expenseDate": "2024-01-15",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### Submit for Approval

```bash
curl -X POST http://localhost:8084/api/expenses/1/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Approve Expense

```bash
curl -X POST http://localhost:8084/api/expenses/1/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "comments": "Approved - within budget"
  }'
```

### Upload Receipt

```bash
curl -X POST http://localhost:8084/api/expenses/1/receipt \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@receipt.jpg"
```

### Generate Report

```bash
curl -X GET "http://localhost:8084/api/reports/expenses?startDate=2024-01-01&endDate=2024-01-31&format=PDF" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/smartoutlet_expense` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |
| `SERVER_PORT` | Service port | `8084` |
| `FILE_UPLOAD_PATH` | Receipt storage path | `/tmp/receipts` |

## Development

### Project Structure

```
src/main/java/com/smartoutlet/expense/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── exception/      # Custom exceptions
├── repository/     # Data access layer
├── service/        # Business logic
├── util/           # Utility classes
└── workflow/       # Approval workflow logic
```

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ExpenseControllerTest

# Run with coverage
mvn test jacoco:report
```

### Database Schema

Key entities:
- **Expense** - Expense records and details
- **Budget** - Budget allocations and limits
- **Category** - Expense categories
- **Approval** - Approval workflow records
- **Receipt** - Receipt file storage
- **ExpenseReport** - Generated reports

## Monitoring & Health Checks

The service includes Spring Boot Actuator for monitoring:

- **Health Check**: `/actuator/health`
- **Metrics**: `/actuator/metrics`
- **Info**: `/actuator/info`

## Security

- JWT token validation for all endpoints
- Role-based access control
- File upload security
- Input validation and sanitization
- CORS configuration

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Ensure proper file format

3. **Approval Workflow Issues**
   - Check user permissions
   - Verify approval chain configuration
   - Review workflow rules

### Logs

Logs are written to `logs/expense-service.log` by default. Check for:
- Application startup errors
- Database connection issues
- File upload problems
- Approval workflow errors

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure proper approval workflows

## License

This project is part of the SmartOutlet POS system. 