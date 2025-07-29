# 🧂 Recipe Service

The Recipe Service is a comprehensive raw materials and recipe management microservice for the SmartOutlet POS system. It provides Bill of Materials (BOM) management, consumption tracking, vendor management, and material forecasting capabilities.

## 🌟 Features

### Raw Materials Management
- **Comprehensive Material Catalog**: Track raw materials with detailed specifications including UOM, expiry, vendor information
- **Multi-UOM Support**: Support for weight, volume, count, and length units
- **Expiry Tracking**: Monitor shelf life and expiration dates
- **Vendor Management**: Track primary and alternative suppliers with rating systems
- **Cost Tracking**: Base costs, average costs, and total inventory valuation
- **Stock Alerts**: Low stock, reorder points, and expiry warnings
- **Wastage Management**: Track and calculate material wastage percentages

### Recipe & BOM Management
- **Recipe Builder**: Create detailed recipes with step-by-step instructions
- **Bill of Materials**: Define ingredient lists with quantities and specifications
- **Cost Analysis**: Calculate recipe costs including materials, labor, and overhead
- **Version Control**: Track recipe versions and approval workflows
- **Yield Calculations**: Account for production yields and wastage
- **Nutritional Information**: Track allergens and nutritional data
- **Quality Standards**: Define quality requirements for ingredients

### Consumption Tracking
- **Real-time Consumption**: Track material usage based on sales
- **FIFO Support**: First-in-first-out inventory consumption
- **Production Batches**: Track production runs and material consumption
- **Waste Tracking**: Monitor and analyze material waste

### Vendor Management
- **Supplier Database**: Comprehensive vendor information and contacts
- **Rating System**: Quality, delivery, and service ratings
- **Lead Time Tracking**: Monitor delivery times and reliability
- **Price Comparison**: Track pricing from multiple suppliers
- **Order Management**: Minimum order quantities and terms

### Forecasting & Analytics
- **Material Forecasting**: Predict raw material needs based on sales projections
- **Reorder Planning**: Intelligent reorder recommendations
- **Cost Analysis**: Analyze material costs and trends
- **Usage Reports**: Detailed consumption and waste reports

## 🏗️ Architecture

### Database Schema

```sql
-- Raw Materials
CREATE TABLE raw_materials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    material_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    base_unit_cost DECIMAL(10,4),
    current_stock DECIMAL(10,3),
    min_stock_level DECIMAL(10,3),
    reorder_point DECIMAL(10,3),
    primary_vendor_id BIGINT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Recipes
CREATE TABLE recipes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    recipe_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    version INT DEFAULT 1,
    batch_size DECIMAL(10,3),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Recipe Ingredients (BOM)
CREATE TABLE recipe_ingredients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recipe_id BIGINT NOT NULL,
    raw_material_id BIGINT NOT NULL,
    quantity DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_cost DECIMAL(10,4),
    total_cost DECIMAL(10,4),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id)
);

-- Vendors
CREATE TABLE vendors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vendor_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    lead_time_days INT DEFAULT 7,
    quality_rating DECIMAL(3,1),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Service Integration

The Recipe Service integrates with:
- **Product Service**: Links recipes to products
- **Auth Service**: User authentication and authorization
- **Inventory Service**: Stock consumption tracking
- **POS Service**: Real-time consumption updates

## 🚀 API Endpoints

### Raw Materials

```bash
# Get raw materials with filtering
GET /api/recipe/raw-materials?category=Grains&status=ACTIVE&search=flour

# Create raw material
POST /api/recipe/raw-materials
{
  "materialCode": "FLR-001",
  "name": "Premium Wheat Flour",
  "category": "Grains & Cereals",
  "unitOfMeasure": "KILOGRAM",
  "baseUnitCost": 2.50,
  "minStockLevel": 50,
  "reorderPoint": 60
}

# Get material details
GET /api/recipe/raw-materials/{id}

# Update material
PUT /api/recipe/raw-materials/{id}
```

### Recipes

```bash
# Get recipes
GET /api/recipe/recipes?productId=1&status=ACTIVE

# Create recipe
POST /api/recipe/recipes
{
  "productId": 1,
  "recipeCode": "RCP-001",
  "name": "Classic Chocolate Cake",
  "batchSize": 10,
  "batchUnit": "PIECE",
  "ingredients": [
    {
      "rawMaterialId": 1,
      "quantity": 2.5,
      "unit": "KILOGRAM"
    }
  ]
}

# Get recipe with ingredients
GET /api/recipe/recipes/{id}

# Recipe cost analysis
GET /api/recipe/recipes/{id}/cost-analysis?batchQuantity=5
```

### Forecasting

```bash
# Material usage forecast
GET /api/recipe/recipes/product/{productId}/forecast?days=30&expectedSales=100

# Vendor reorder planning
GET /api/recipe/vendors/{vendorId}/reorder-planning?planningDays=30
```

### Utilities

```bash
# Get units of measure
GET /api/recipe/units-of-measure

# Get material categories
GET /api/recipe/material-categories

# Get vendors
GET /api/recipe/vendors?materialId=1
```

## ⚙️ Configuration

### Application Properties

```yaml
# Database Configuration
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smartoutlet_recipe
    username: smartoutlet_user
    password: smartoutlet_password

# Business Configuration
recipe:
  consumption:
    default-wastage-percentage: 5.0
    batch-size-multiplier: 1.1
  forecasting:
    default-days-ahead: 30
    historical-data-months: 6
  vendor:
    lead-time-days: 7
    reorder-buffer-days: 3
  costing:
    include-wastage: true
    overhead-percentage: 15.0
```

### Environment Variables

```bash
# Database
MYSQL_URL=jdbc:mysql://localhost:3306/smartoutlet_recipe
MYSQL_USERNAME=smartoutlet_user
MYSQL_PASSWORD=smartoutlet_password

# Security
JWT_SECRET=SmartOutletJWTSecretKeyForDevelopment2024!
JWT_EXPIRATION=86400000

# Service URLs
AUTH_SERVICE_URL=http://localhost:8081
PRODUCT_SERVICE_URL=http://localhost:8083

# Business Configuration
RECIPE_CONSUMPTION_DEFAULT_WASTAGE_PERCENTAGE=5.0
RECIPE_FORECASTING_DEFAULT_DAYS_AHEAD=30
RECIPE_VENDOR_LEAD_TIME_DAYS=7
```

## 🛠️ Getting Started

### Development Setup

1. **Prerequisites**
   ```bash
   # Java 17
   java -version
   
   # Maven 3.6+
   mvn -version
   
   # MySQL 8.0+
   mysql --version
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE smartoutlet_recipe;
   CREATE USER 'smartoutlet_user'@'localhost' IDENTIFIED BY 'smartoutlet_password';
   GRANT ALL PRIVILEGES ON smartoutlet_recipe.* TO 'smartoutlet_user'@'localhost';
   ```

3. **Run Locally**
   ```bash
   # Make script executable
   chmod +x run-recipe-service.sh
   
   # Start the service
   ./run-recipe-service.sh
   ```

### Production Deployment

1. **Build JAR**
   ```bash
   mvn clean package -DskipTests
   ```

2. **Docker Build**
   ```bash
   docker build -t smartoutlet/recipe-service:latest .
   ```

3. **Docker Run**
   ```bash
   docker run -d \
     --name recipe-service \
     -p 8087:8087 \
     -e SPRING_PROFILES_ACTIVE=prod \
     -e MYSQL_URL=jdbc:mysql://mysql:3306/smartoutlet_recipe \
     smartoutlet/recipe-service:latest
   ```

### Docker Compose

The service is included in the main `docker-compose.yml`:

```yaml
recipe-service:
  build:
    context: ./backend/recipe-service
    dockerfile: Dockerfile
  container_name: smartoutlet-recipe-service
  restart: unless-stopped
  depends_on:
    - postgres
    - auth-service
    - product-service
  ports:
    - "8087:8087"
  environment:
    SPRING_PROFILES_ACTIVE: docker
    MYSQL_URL: jdbc:mysql://mysql:3306/smartoutlet_recipe
  networks:
    - smartoutlet-network
```

## 📊 Monitoring

### Health Check

```bash
# Application health
curl http://localhost:8087/api/recipe/actuator/health

# Detailed health with dependencies
curl http://localhost:8087/api/recipe/actuator/health/readiness
```

### Metrics

```bash
# Application metrics
curl http://localhost:8087/api/recipe/actuator/metrics

# Custom business metrics
curl http://localhost:8087/api/recipe/actuator/metrics/recipe.materials.total
curl http://localhost:8087/api/recipe/actuator/metrics/recipe.lowstock.count
```

### Service URLs

- **Development**: http://localhost:8087
- **Swagger UI**: http://localhost:8087/api/recipe/swagger-ui.html
- **API Docs**: http://localhost:8087/api/recipe/api-docs
- **Health Check**: http://localhost:8087/api/recipe/actuator/health

## 🔒 Security

### Authentication

The service uses JWT-based authentication:
- **Bearer Token**: Include in `Authorization` header
- **User ID**: Include in `X-User-ID` header for audit logging

### Authorization

Role-based access control:
- **RECIPE_READ**: View materials, recipes, and forecasts
- **RECIPE_WRITE**: Create, update, and delete materials and recipes
- **RECIPE_ADMIN**: Full administrative access

### Data Protection

- **Audit Logging**: All operations are logged with user information
- **Input Validation**: Comprehensive validation on all endpoints
- **SQL Injection Prevention**: Parameterized queries and JPA
- **XSS Protection**: Input sanitization and output encoding

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
mvn test

# With coverage
mvn test jacoco:report
```

### Integration Tests

```bash
# Run integration tests
mvn verify -P integration-tests

# With test containers
mvn verify -P testcontainers
```

### API Testing

```bash
# Test raw materials endpoint
curl -X GET "http://localhost:8087/api/recipe/raw-materials" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "X-User-ID: 1"

# Test recipe creation
curl -X POST "http://localhost:8087/api/recipe/recipes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "X-User-ID: 1" \
  -d '{
    "productId": 1,
    "recipeCode": "RCP-TEST-001",
    "name": "Test Recipe",
    "batchSize": 5,
    "batchUnit": "PIECE"
  }'
```

## 🚀 Performance

### Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: HikariCP with optimized settings
- **Caching**: Redis cache for frequently accessed data
- **Pagination**: Server-side pagination for large datasets

### Monitoring

- **Response Times**: Target < 200ms for read operations
- **Throughput**: Support 1000+ requests per minute
- **Memory Usage**: < 1GB heap size in production
- **Database Connections**: Pool size optimized per environment

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database status
   systemctl status mysql
   
   # Test connection
   mysql -h localhost -u smartoutlet_user -p smartoutlet_recipe
   ```

2. **Service Won't Start**
   ```bash
   # Check port availability
   netstat -tlnp | grep 8087
   
   # Check logs
   tail -f logs/recipe-service.log
   ```

3. **Authentication Errors**
   ```bash
   # Verify JWT secret matches auth service
   echo $JWT_SECRET
   
   # Test token validation
   curl -X GET "http://localhost:8081/api/auth/validate" \
     -H "Authorization: Bearer $JWT_TOKEN"
   ```

### Debug Mode

```bash
# Enable debug logging
export LOGGING_LEVEL_COM_SMARTOUTLET_RECIPE=DEBUG

# Run with debug
./run-recipe-service.sh
```

### Performance Issues

```bash
# Check JVM memory
jmap -heap <pid>

# Monitor garbage collection
jstat -gc <pid> 1s

# Database query analysis
EXPLAIN SELECT * FROM raw_materials WHERE category = 'Grains';
```

## 📚 Integration

### Event Publishing

The service publishes events for:
- Material stock updates
- Recipe changes
- Cost calculations
- Consumption tracking

### Event Consumption

Consumes events from:
- Product updates (Product Service)
- Sales transactions (POS Service)
- Stock movements (Inventory Service)

### API Clients

Generate client libraries:
```bash
# OpenAPI Generator
openapi-generator-cli generate \
  -i http://localhost:8087/api/recipe/api-docs \
  -g typescript-axios \
  -o ./generated/recipe-client
```

## 🤝 Contributing

1. **Code Style**: Follow Google Java Style Guide
2. **Testing**: Minimum 80% code coverage
3. **Documentation**: Update API docs and README
4. **Security**: Follow OWASP guidelines

## 📝 License

This project is part of the SmartOutlet POS system and is proprietary software.

---

**Recipe Service** - Part of SmartOutlet POS Microservices Architecture