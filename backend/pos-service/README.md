# POS Service

## Overview

The POS (Point of Sale) Service is a microservice responsible for handling sales transactions, payment processing, and receipt generation in the SmartOutlet POS system. It manages the core retail operations including sales, returns, discounts, and payment methods.

## Features

- 💳 **Sales Transactions** - Process sales, returns, and exchanges
- 💰 **Payment Processing** - Handle multiple payment methods (cash, card, digital)
- 🧾 **Receipt Generation** - Generate and print receipts
- 🏷️ **Discount Management** - Apply discounts, promotions, and coupons
- 📊 **Sales Reporting** - Real-time sales analytics and reporting
- 🔄 **Inventory Integration** - Update inventory levels on sales
- 📱 **Mobile POS** - Support for mobile point of sale operations
- 🔐 **Transaction Security** - Secure payment processing and validation

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
CREATE DATABASE smartoutlet_pos;

-- Create user (optional)
CREATE USER pos_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_pos TO pos_user;
```

### 2. Kafka Setup

Ensure Kafka is running and create the required topics:

```bash
# Create topics for POS events
kafka-topics.sh --create --topic sales-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic payment-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic inventory-updates --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### 3. Configuration

Create `application.yml` or set environment variables:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smartoutlet_pos
    username: pos_user
    password: your_password
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: pos-service
      auto-offset-reset: earliest
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer

server:
  port: 8085

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
./run-pos-service.sh
```

### 5. Docker (Optional)

```bash
# Build Docker image
docker build -t smartoutlet-pos-service .

# Run container
docker run -p 8085:8085 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/smartoutlet_pos \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092 \
  smartoutlet-pos-service
```

## API Endpoints

### Sales Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get all sales transactions |
| GET | `/api/sales/{id}` | Get sale by ID |
| POST | `/api/sales` | Create new sale |
| PUT | `/api/sales/{id}` | Update sale |
| DELETE | `/api/sales/{id}` | Delete sale |
| GET | `/api/sales/search` | Search sales by criteria |

### Transaction Processing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/process` | Process a new transaction |
| POST | `/api/transactions/return` | Process a return transaction |
| POST | `/api/transactions/exchange` | Process an exchange transaction |
| GET | `/api/transactions/{id}` | Get transaction details |
| GET | `/api/transactions/outlet/{outletId}` | Get transactions for outlet |

### Payment Processing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/process` | Process payment |
| POST | `/api/payments/refund` | Process refund |
| GET | `/api/payments/{id}` | Get payment details |
| GET | `/api/payments/methods` | Get available payment methods |

### Receipt Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/receipts/{transactionId}` | Generate receipt |
| POST | `/api/receipts/{transactionId}/print` | Print receipt |
| GET | `/api/receipts/{transactionId}/email` | Email receipt |

### Discount Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/discounts` | Get available discounts |
| POST | `/api/discounts/apply` | Apply discount to transaction |
| GET | `/api/discounts/validate` | Validate discount code |

### Reporting

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/sales` | Generate sales report |
| GET | `/api/reports/daily` | Generate daily report |
| GET | `/api/reports/outlet/{outletId}` | Generate outlet report |
| GET | `/api/reports/payment-methods` | Payment method report |

### Health & Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/actuator/health` | Service health check |
| GET | `/actuator/info` | Service information |
| GET | `/actuator/metrics` | Service metrics |

### API Documentation

- **Swagger UI**: http://localhost:8085/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8085/v3/api-docs

## Request/Response Examples

### Process Sale Transaction

```bash
curl -X POST http://localhost:8085/api/transactions/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "outletId": 1,
    "cashierId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "unitPrice": 15.99
      },
      {
        "productId": 2,
        "quantity": 1,
        "unitPrice": 8.50
      }
    ],
    "paymentMethod": "CREDIT_CARD",
    "paymentDetails": {
      "cardNumber": "****-****-****-1234",
      "cardType": "VISA"
    },
    "discountCode": "SAVE10",
    "customerEmail": "customer@example.com"
  }'
```

### Get Sales Transactions

```bash
curl -X GET http://localhost:8085/api/sales \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "content": [
    {
      "id": 1,
      "transactionNumber": "TXN-2024-001",
      "outletId": 1,
      "cashierId": 1,
      "totalAmount": 40.48,
      "paymentMethod": "CREDIT_CARD",
      "status": "COMPLETED",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### Process Return

```bash
curl -X POST http://localhost:8085/api/transactions/return \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "originalTransactionId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 1,
        "reason": "DEFECTIVE"
      }
    ],
    "refundMethod": "ORIGINAL_PAYMENT",
    "notes": "Customer reported defective item"
  }'
```

### Generate Receipt

```bash
curl -X GET http://localhost:8085/api/receipts/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "transactionId": 1,
  "transactionNumber": "TXN-2024-001",
  "outlet": "Downtown Store",
  "cashier": "John Doe",
  "items": [
    {
      "name": "Premium Coffee Beans",
      "quantity": 2,
      "unitPrice": 15.99,
      "total": 31.98
    }
  ],
  "subtotal": 31.98,
  "tax": 2.56,
  "discount": 3.20,
  "total": 31.34,
  "paymentMethod": "CREDIT_CARD",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Kafka Events

The service publishes events to Kafka for real-time updates:

### Event Types

- `SALE_COMPLETED` - When a sale transaction is completed
- `PAYMENT_PROCESSED` - When payment is processed
- `RETURN_PROCESSED` - When a return is processed
- `INVENTORY_UPDATED` - When inventory is updated due to sale
- `RECEIPT_GENERATED` - When a receipt is generated

### Event Schema

```json
{
  "eventType": "SALE_COMPLETED",
  "timestamp": "2024-01-15T10:30:00Z",
  "transactionId": 1,
  "outletId": 1,
  "data": {
    "totalAmount": 40.48,
    "paymentMethod": "CREDIT_CARD",
    "itemsCount": 3
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/smartoutlet_pos` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | Kafka bootstrap servers | `localhost:9092` |
| `SERVER_PORT` | Service port | `8085` |

## Development

### Project Structure

```
src/main/java/com/smartoutlet/pos/
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
mvn test -Dtest=TransactionControllerTest

# Run with coverage
mvn test jacoco:report
```

### Database Schema

Key entities:
- **Transaction** - Sales transaction records
- **TransactionItem** - Items in each transaction
- **Payment** - Payment information
- **Receipt** - Receipt data
- **Discount** - Discount and promotion data

## Monitoring & Health Checks

The service includes Spring Boot Actuator for monitoring:

- **Health Check**: `/actuator/health`
- **Metrics**: `/actuator/metrics`
- **Info**: `/actuator/info`

## Security

- JWT token validation for all endpoints
- Role-based access control
- Payment data encryption
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

3. **Payment Processing Issues**
   - Check payment gateway configuration
   - Verify payment method settings
   - Review transaction logs

### Logs

Logs are written to `logs/pos-service.log` by default. Check for:
- Application startup errors
- Database connection issues
- Kafka connection problems
- Payment processing errors

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure proper transaction handling

## License

This project is part of the SmartOutlet POS system. 