# Product Service

## Overview

The Product Service is a microservice responsible for managing product catalog, inventory, and pricing in the SmartOutlet POS system. It handles product information, categories, stock levels, and pricing strategies.

## Features

- 📦 **Product Catalog** - Manage product information, descriptions, and categories
- 📊 **Inventory Management** - Track stock levels, reorder points, and inventory movements
- 💰 **Pricing Management** - Handle pricing strategies, discounts, and promotions
- 🏷️ **Category Management** - Organize products into categories and subcategories
- 📈 **Stock Alerts** - Low stock notifications and reorder suggestions
- 🔄 **Event Streaming** - Kafka integration for real-time inventory updates
- 📚 **API Documentation** - OpenAPI/Swagger documentation

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
CREATE DATABASE smartoutlet_product;

-- Create user (optional)
CREATE USER product_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_product TO product_user;
```

### 2. Kafka Setup

Ensure Kafka is running and create the required topics:

```bash
# Create topics for product events
kafka-topics.sh --create --topic product-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic inventory-updates --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic price-updates --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### 3. Configuration

Create `application.yml` or set environment variables:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smartoutlet_product
    username: product_user
    password: your_password
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: product-service
      auto-offset-reset: earliest
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer

server:
  port: 8083

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
./run-product-service.sh
```

### 5. Docker (Optional)

```bash
# Build Docker image
docker build -t smartoutlet-product-service .

# Run container
docker run -p 8083:8083 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/smartoutlet_product \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092 \
  smartoutlet-product-service
```

## API Endpoints

### Product Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |
| GET | `/api/products/search` | Search products by criteria |

### Category Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/{id}` | Get category by ID |
| POST | `/api/categories` | Create new category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |
| GET | `/api/categories/{id}/products` | Get products in category |

### Inventory Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get inventory levels |
| GET | `/api/inventory/{productId}` | Get inventory for product |
| PUT | `/api/inventory/{productId}` | Update inventory level |
| POST | `/api/inventory/stock-in` | Record stock in |
| POST | `/api/inventory/stock-out` | Record stock out |
| GET | `/api/inventory/low-stock` | Get low stock alerts |

### Pricing Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pricing/{productId}` | Get product pricing |
| PUT | `/api/pricing/{productId}` | Update product pricing |
| POST | `/api/pricing/bulk-update` | Bulk update pricing |
| GET | `/api/pricing/discounts` | Get active discounts |

### Health & Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/actuator/health` | Service health check |
| GET | `/actuator/info` | Service information |
| GET | `/actuator/metrics` | Service metrics |

### API Documentation

- **Swagger UI**: http://localhost:8083/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8083/v3/api-docs

## Request/Response Examples

### Create Product

```bash
curl -X POST http://localhost:8083/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Premium Coffee Beans",
    "description": "High-quality Arabica coffee beans",
    "sku": "COFFEE-001",
    "categoryId": 1,
    "price": 15.99,
    "costPrice": 10.50,
    "initialStock": 100,
    "reorderPoint": 20,
    "unit": "kg",
    "barcode": "1234567890123",
    "status": "ACTIVE"
  }'
```

### Get Products

```bash
curl -X GET http://localhost:8083/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "content": [
    {
      "id": 1,
      "name": "Premium Coffee Beans",
      "sku": "COFFEE-001",
      "price": 15.99,
      "currentStock": 85,
      "category": "Beverages",
      "status": "ACTIVE"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### Update Inventory

```bash
curl -X PUT http://localhost:8083/api/inventory/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "quantity": 75,
    "reason": "SALE"
  }'
```

### Search Products

```bash
curl -X GET "http://localhost:8083/api/products/search?category=Beverages&minPrice=10&maxPrice=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Kafka Events

The service publishes events to Kafka for real-time updates:

### Event Types

- `PRODUCT_CREATED` - When a new product is created
- `PRODUCT_UPDATED` - When product information is updated
- `PRODUCT_DELETED` - When a product is deleted
- `INVENTORY_UPDATED` - When inventory levels change
- `PRICE_UPDATED` - When product pricing changes
- `LOW_STOCK_ALERT` - When stock falls below reorder point

### Event Schema

```json
{
  "eventType": "INVENTORY_UPDATED",
  "timestamp": "2024-01-15T10:30:00Z",
  "productId": 1,
  "data": {
    "previousStock": 100,
    "newStock": 85,
    "change": -15,
    "reason": "SALE"
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/smartoutlet_product` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | Kafka bootstrap servers | `localhost:9092` |
| `SERVER_PORT` | Service port | `8083` |

## Development

### Project Structure

```
src/main/java/com/smartoutlet/product/
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
mvn test -Dtest=ProductControllerTest

# Run with coverage
mvn test jacoco:report
```

### Database Schema

Key entities:
- **Product** - Product information and details
- **Category** - Product categories and hierarchy
- **Inventory** - Stock levels and movements
- **Pricing** - Price history and strategies
- **StockMovement** - Inventory transaction history

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

3. **Inventory Sync Issues**
   - Check Kafka event processing
   - Verify inventory calculations
   - Review transaction logs

### Logs

Logs are written to `logs/product-service.log` by default. Check for:
- Application startup errors
- Database connection issues
- Kafka connection problems
- Inventory calculation errors

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure Kafka events are properly handled

## License

This project is part of the SmartOutlet POS system. 