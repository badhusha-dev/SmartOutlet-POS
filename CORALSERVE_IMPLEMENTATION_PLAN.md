# 🏝️ CoralServe Implementation Plan
## Technical Specifications & Development Priorities

---

## 📋 Implementation Priority Matrix

### 🔴 High Priority (Phase 1 - Core Business)
1. **Inventory Management System**
2. **Enhanced User Management**
3. **Recipe & BOM System**

### 🟡 Medium Priority (Phase 2 - Operations)
4. **Staff Management**
5. **Tax & Compliance**
6. **Advanced Analytics**

### 🟢 Low Priority (Phase 3 - Advanced Features)
7. **AI & Forecasting**
8. **Online Orders Integration**
9. **Audit & History**

---

## 🏗️ New Services Architecture

### 1. 📦 Inventory Service (Port 8086)
**Purpose**: Advanced stock management with FIFO, expiry tracking, and multi-outlet support

#### Core Features:
- **Stock Tracking**: Real-time inventory levels per outlet
- **FIFO Management**: First-in-first-out stock rotation
- **Expiry Management**: Color-coded expiry warnings
- **Transfer System**: Stock movement between outlets
- **Reorder Alerts**: Automatic reorder notifications

#### Database Schema:
```sql
-- Stock Items
CREATE TABLE stock_items (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    batch_number VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    expiry_date DATE,
    status VARCHAR(20), -- FRESH, NEAR_EXPIRY, EXPIRED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Movements
CREATE TABLE stock_movements (
    id BIGSERIAL PRIMARY KEY,
    stock_item_id BIGINT NOT NULL,
    movement_type VARCHAR(20), -- IN, OUT, TRANSFER, ADJUSTMENT
    quantity INTEGER NOT NULL,
    from_outlet_id BIGINT,
    to_outlet_id BIGINT,
    reason VARCHAR(500),
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API Endpoints:
- `GET /api/inventory/outlet/{outletId}` - Get stock levels
- `POST /api/inventory/transfer` - Transfer stock between outlets
- `GET /api/inventory/expiring-soon` - Get items expiring soon
- `POST /api/inventory/adjustment` - Stock adjustment
- `GET /api/inventory/reorder-alerts` - Get reorder alerts

---

### 2. 🧂 Recipe Service (Port 8087)
**Purpose**: Bill of Materials (BOM) management and recipe-to-product mapping

#### Core Features:
- **Recipe Builder**: Visual recipe creation interface
- **BOM Management**: Ingredient-to-product mapping
- **Consumption Tracking**: Automatic material deduction
- **Vendor Management**: Supplier information and pricing
- **Forecasting**: Material usage prediction

#### Database Schema:
```sql
-- Raw Materials
CREATE TABLE raw_materials (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    unit_of_measure VARCHAR(20),
    cost_per_unit DECIMAL(10,2),
    vendor_id BIGINT,
    min_stock_level INTEGER,
    expiry_days INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes (BOM)
CREATE TABLE recipes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    yield_quantity INTEGER,
    yield_unit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipe Ingredients
CREATE TABLE recipe_ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    quantity DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API Endpoints:
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/{id}/ingredients` - Get recipe ingredients
- `POST /api/recipes/{id}/ingredients` - Add ingredient to recipe
- `GET /api/materials/forecast` - Get material usage forecast

---

### 3. 👥 Staff Service (Port 8088)
**Purpose**: Staff management, task scheduling, and performance tracking

#### Core Features:
- **Staff Profiles**: Complete employee information
- **Role Management**: Position and permission assignment
- **Shift Scheduling**: Work schedule management
- **Task Assignment**: Daily task allocation
- **Attendance Tracking**: Time and attendance
- **Performance Monitoring**: KPI tracking

#### Database Schema:
```sql
-- Staff Members
CREATE TABLE staff_members (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    position VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(10,2),
    status VARCHAR(20), -- ACTIVE, INACTIVE, TERMINATED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shifts
CREATE TABLE shifts (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    shift_date DATE,
    start_time TIME,
    end_time TIME,
    status VARCHAR(20), -- SCHEDULED, IN_PROGRESS, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    outlet_id BIGINT NOT NULL,
    assigned_to BIGINT,
    due_date DATE,
    priority VARCHAR(20), -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(20), -- PENDING, IN_PROGRESS, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API Endpoints:
- `GET /api/staff/outlet/{outletId}` - Get staff by outlet
- `POST /api/staff/shifts` - Create shift schedule
- `GET /api/staff/{id}/tasks` - Get staff tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}/complete` - Mark task complete

---

### 4. 🌍 Tax Service (Port 8089)
**Purpose**: Multi-country tax compliance and dynamic tax calculation

#### Core Features:
- **Tax Configuration**: Country/region-specific tax rules
- **Dynamic Calculation**: Automatic tax computation
- **Tax Reporting**: Period-based tax reports
- **Compliance**: Regulatory compliance tracking

#### Database Schema:
```sql
-- Tax Rules
CREATE TABLE tax_rules (
    id BIGSERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    state_code VARCHAR(10),
    tax_type VARCHAR(50), -- GST, VAT, SERVICE_TAX
    rate DECIMAL(5,4) NOT NULL,
    effective_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Tax Mapping
CREATE TABLE product_tax_mapping (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    tax_rule_id BIGINT NOT NULL,
    is_exempt BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API Endpoints:
- `GET /api/tax/rules` - Get tax rules
- `POST /api/tax/calculate` - Calculate tax for transaction
- `GET /api/tax/reports` - Get tax reports
- `POST /api/tax/rules` - Create tax rule

---

### 5. 📈 Analytics Service (Port 8090)
**Purpose**: Business intelligence, reporting, and AI-powered insights

#### Core Features:
- **KPI Dashboard**: Key performance indicators
- **Sales Analytics**: Revenue and trend analysis
- **Inventory Analytics**: Stock performance metrics
- **Staff Analytics**: Productivity and performance
- **AI Forecasting**: Demand prediction
- **Custom Reports**: Flexible reporting system

#### Database Schema:
```sql
-- Analytics Cache
CREATE TABLE analytics_cache (
    id BIGSERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    outlet_id BIGINT,
    date_range VARCHAR(20), -- DAILY, WEEKLY, MONTHLY
    metric_value JSONB,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forecast Models
CREATE TABLE forecast_models (
    id BIGSERIAL PRIMARY KEY,
    model_type VARCHAR(50), -- SALES, INVENTORY, STAFF
    outlet_id BIGINT,
    model_data JSONB,
    accuracy_score DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API Endpoints:
- `GET /api/analytics/dashboard` - Get KPI dashboard
- `GET /api/analytics/sales` - Get sales analytics
- `GET /api/analytics/forecast` - Get AI forecasts
- `POST /api/analytics/reports` - Generate custom report

---

## 🔧 Technical Implementation Details

### Service Dependencies:
```
Auth Service ← All Services
API Gateway ← All Services
Inventory Service ← Product Service, Outlet Service
Recipe Service ← Product Service, Inventory Service
Staff Service ← Auth Service, Outlet Service
Tax Service ← Product Service, POS Service
Analytics Service ← All Services (Read-only)
```

### Kafka Topics:
- `pos.transactions` - Transaction events
- `inventory.movements` - Stock movement events
- `staff.attendance` - Attendance events
- `analytics.metrics` - Analytics events

### Security Implementation:
- JWT tokens for authentication
- Role-based access control (RBAC)
- API rate limiting
- Audit logging for all operations

### Database Strategy:
- PostgreSQL for primary data
- Redis for caching
- Elasticsearch for search functionality
- MongoDB for analytics data

---

## 🎯 Development Timeline

### Week 1-2: Inventory Service
- Database schema design
- Core CRUD operations
- Stock movement logic
- Basic API endpoints

### Week 3-4: Recipe Service
- BOM management
- Recipe builder
- Material tracking
- Consumption calculation

### Week 5-6: Staff Service
- Staff management
- Shift scheduling
- Task assignment
- Attendance tracking

### Week 7-8: Tax Service
- Tax rule configuration
- Dynamic calculation
- Compliance reporting
- Multi-country support

### Week 9-10: Analytics Service
- KPI dashboard
- Sales analytics
- AI forecasting
- Custom reports

### Week 11-12: Integration & Testing
- Service integration
- End-to-end testing
- Performance optimization
- Documentation

---

## 🧪 Testing Strategy

### Unit Testing:
- Service layer business logic
- Repository data access
- Controller API endpoints

### Integration Testing:
- Service-to-service communication
- Database operations
- Kafka event processing

### End-to-End Testing:
- Complete user workflows
- Cross-service operations
- Performance under load

### API Testing:
- Swagger documentation validation
- Request/response validation
- Error handling scenarios

---

## 📊 Success Metrics

### Technical Metrics:
- API response time < 200ms
- Service uptime > 99.9%
- Zero data loss
- < 1% error rate

### Business Metrics:
- 20% reduction in waste
- 15% improvement in staff productivity
- 30% faster order processing
- 95% inventory accuracy

---

## 🚀 Deployment Strategy

### Development Environment:
- Docker Compose for local development
- H2 database for testing
- Mock external services

### Staging Environment:
- Kubernetes deployment
- PostgreSQL database
- Real external service integration

### Production Environment:
- Kubernetes with auto-scaling
- High-availability database
- Load balancers and CDN
- Monitoring and alerting

---

*This implementation plan provides a comprehensive roadmap for building CoralServe on top of the existing SmartOutlet POS foundation.* 