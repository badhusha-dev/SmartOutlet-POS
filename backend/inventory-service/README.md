# SmartOutlet Inventory Service

A comprehensive inventory management service for SmartOutlet POS system with advanced features including FIFO tracking, expiry management, and multi-outlet stock control.

## 🚀 Features

### Core Inventory Management
- **Multi-Outlet Stock Tracking**: Track inventory across multiple outlet locations
- **Batch-Level Management**: Detailed tracking with batch numbers and supplier references
- **FIFO (First In, First Out)**: Automatic allocation of oldest stock first
- **Real-time Stock Levels**: Live inventory levels with reserved quantity tracking

### Expiry Management
- **Automated Expiry Tracking**: Monitor product expiry dates with configurable warnings
- **Color-Coded Alerts**: 🟢 Fresh | 🟡 Near Expiry | 🔴 Expired | ⚫ Overdue
- **Expiry Status Monitoring**: Categorized tracking (Fresh, Warning, Critical, Expired)
- **Automated Cleanup**: Background processes to mark expired items

### Stock Operations
- **Stock Receiving**: Receive new inventory with complete batch information
- **Inter-Outlet Transfers**: Transfer stock between outlets with FIFO compliance
- **Stock Adjustments**: Manual adjustments for damage, waste, theft, etc.
- **Stock Reservations**: Reserve stock for pending orders with automatic release

### Alert System
- **Low Stock Alerts**: Configurable minimum stock level warnings
- **Out of Stock Notifications**: Immediate alerts for zero stock items
- **Expiry Warnings**: Proactive alerts for items approaching expiry
- **Reorder Suggestions**: Intelligent reorder recommendations

## 🏗️ Architecture

### Database Schema
```
inventory_items
├── id (Primary Key)
├── product_id (Foreign Key to Product Service)
├── outlet_id (Foreign Key to Outlet Service)
├── batch_number (Unique per product/outlet)
├── quantity
├── reserved_quantity
├── unit_cost
├── expiry_date
├── manufactured_date
├── received_date
├── supplier_reference
├── location_code
├── status (AVAILABLE, RESERVED, DAMAGED, etc.)
└── timestamps

stock_transactions
├── id (Primary Key)
├── inventory_item_id (Foreign Key)
├── transaction_type (RECEIVE, SALE, TRANSFER, etc.)
├── quantity
├── previous_quantity
├── new_quantity
├── reason
├── reference_id
├── user_id
└── timestamp

stock_alerts
├── id (Primary Key)
├── product_id
├── outlet_id
├── alert_type (LOW_STOCK, EXPIRY_WARNING, etc.)
├── priority (LOW, MEDIUM, HIGH, CRITICAL)
├── status (ACTIVE, ACKNOWLEDGED, RESOLVED)
└── timestamps
```

### Service Integration
- **Product Service**: Retrieve product information and minimum stock levels
- **Outlet Service**: Validate outlet operations and locations
- **Auth Service**: User authentication and authorization
- **API Gateway**: Centralized routing and security

## 📡 API Endpoints

### Stock Operations
```http
POST /api/inventory/receive
Content-Type: application/json

{
  "productId": 1,
  "outletId": 1,
  "batchNumber": "BATCH-2024-001",
  "quantity": 100,
  "unitCost": 15.50,
  "expiryDate": "2024-12-31",
  "receivedDate": "2024-01-15",
  "supplierReference": "PO-12345"
}
```

```http
POST /api/inventory/transfer
Content-Type: application/json

{
  "productId": 1,
  "sourceOutletId": 1,
  "destinationOutletId": 2,
  "quantity": 50,
  "reason": "Restocking downtown branch"
}
```

### Stock Levels
```http
GET /api/inventory/outlets/{outletId}/stock-levels
GET /api/inventory/products/{productId}/stock-levels
GET /api/inventory/products/{productId}/outlets/{outletId}/stock-level
```

### Expiry Management
```http
GET /api/inventory/outlets/{outletId}/expiring?days=30
GET /api/inventory/outlets/{outletId}/expired
```

### Search and Filtering
```http
GET /api/inventory/items?outletId=1&status=AVAILABLE&page=0&size=20
```

## 🔧 Configuration

### Application Properties
```yaml
inventory:
  expiry:
    warning-days: 30      # Days before expiry to show warning
    critical-days: 7      # Days before expiry to show critical alert
  reorder:
    check-schedule: "0 0 8 * * ?"  # Daily at 8 AM
  fifo:
    enabled: true
    enforce-strict: false # If true, prevents selling newer stock before older
```

### Environment Variables
```bash
# Database
MYSQL_URL=jdbc:mysql://localhost:3306/smartoutlet_inventory
MYSQL_USERNAME=smartoutlet_user
MYSQL_PASSWORD=smartoutlet_password

# Security
JWT_SECRET=your-jwt-secret-key

# Service URLs
PRODUCT_SERVICE_URL=http://localhost:8083
OUTLET_SERVICE_URL=http://localhost:8082

# Business Rules
INVENTORY_EXPIRY_WARNING_DAYS=30
INVENTORY_EXPIRY_CRITICAL_DAYS=7
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Redis (optional, for caching)

### Running the Service

#### Development Mode
```bash
# Navigate to service directory
cd backend/inventory-service

# Start the service
./run-inventory-service.sh dev
```

#### Production Mode
```bash
# Build the service
mvn clean package

# Run with production profile
java -jar target/inventory-service-1.0.0.jar --spring.profiles.active=prod
```

#### Docker
```bash
# Build image
docker build -t smartoutlet/inventory-service .

# Run container
docker run -p 8086:8086 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e MYSQL_URL=jdbc:mysql://host:3306/smartoutlet_inventory \
  smartoutlet/inventory-service
```

### Service URLs
- **Application**: http://localhost:8086
- **Swagger UI**: http://localhost:8086/api/inventory/swagger-ui.html
- **Health Check**: http://localhost:8086/api/inventory/actuator/health

## 📊 Monitoring and Analytics

### Health Checks
- Database connectivity
- Service dependencies
- Memory usage
- Background job status

### Metrics
- Stock movement rates
- Expiry prediction accuracy
- Transfer efficiency
- Alert response times

### Logging
- All stock transactions logged with audit trail
- User actions tracked for accountability
- Performance metrics captured
- Error tracking with stack traces

## 🔐 Security

### Authentication
- JWT token-based authentication
- Integration with Auth Service
- User context tracking

### Authorization
- Role-based access control (RBAC)
- Permission levels:
  - `INVENTORY_READ`: View stock levels and items
  - `INVENTORY_WRITE`: Perform stock operations
  - `INVENTORY_ADMIN`: Manage system settings

### Data Protection
- Sensitive data encryption at rest
- Audit logging for compliance
- Input validation and sanitization
- SQL injection prevention

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn test -Pintegration
```

### API Testing
Use the provided Postman collection or curl commands:
```bash
# Health check
curl -X GET http://localhost:8086/api/inventory/actuator/health

# Get stock levels
curl -X GET http://localhost:8086/api/inventory/outlets/1/stock-levels \
  -H "Authorization: Bearer your-jwt-token"
```

## 📈 Performance Optimization

### Database Optimization
- Indexed queries for fast lookups
- Optimized batch operations
- Connection pooling
- Query result caching

### Caching Strategy
- Redis for frequently accessed data
- Product information caching
- Stock level caching with TTL
- User session management

### Background Processing
- Async stock movement processing
- Scheduled expiry checks
- Batch alert generation
- Historical data archival

## 🔄 Integration Points

### Event Publishing
The service publishes events to Kafka for real-time updates:
- `stock.received`: When new stock is received
- `stock.transferred`: When stock moves between outlets
- `stock.adjusted`: When manual adjustments are made
- `stock.expired`: When items expire
- `stock.low`: When stock falls below minimum levels

### Event Consumption
Listens for events from other services:
- `order.completed`: Update stock levels after sale
- `product.created`: Initialize stock tracking
- `outlet.created`: Set up outlet inventory

## 🚨 Troubleshooting

### Common Issues

#### Service Won't Start
1. Check database connectivity
2. Verify environment variables
3. Ensure no port conflicts
4. Check dependency services status

#### Stock Discrepancies
1. Review transaction logs
2. Check for concurrent operations
3. Verify FIFO allocation logic
4. Audit manual adjustments

#### Performance Issues
1. Monitor database query performance
2. Check cache hit rates
3. Review background job efficiency
4. Analyze memory usage

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
java -jar inventory-service.jar
```

## 📝 Contributing

1. Follow the existing code style
2. Add unit tests for new features
3. Update API documentation
4. Test integration scenarios
5. Update this README if needed

## 📄 License

This project is part of the SmartOutlet POS system.