# 🏝️ CoralServe Database Schema
## Complete Database Design for All Services

---

## 📊 Database Overview

### Current Databases (SmartOutlet POS):
- `smartoutlet_auth` - Authentication and user management
- `smartoutlet_product` - Product and category management
- `smartoutlet_outlet` - Outlet and staff management
- `smartoutlet_expense` - Expense tracking
- `smartoutlet_pos` - Transaction processing

### New Databases (CoralServe):
- `coralserve_inventory` - Stock management
- `coralserve_recipe` - Recipe and BOM management
- `coralserve_staff` - Staff and task management
- `coralserve_tax` - Tax and compliance
- `coralserve_analytics` - Analytics and reporting
- `coralserve_audit` - Audit trails and history

---

## 📦 Inventory Service Database (`coralserve_inventory`)

### Core Tables

#### 1. Stock Items
```sql
CREATE TABLE stock_items (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    batch_number VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_cost DECIMAL(10,2),
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'FRESH' CHECK (status IN ('FRESH', 'NEAR_EXPIRY', 'EXPIRED')),
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    reorder_point INTEGER,
    supplier_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_stock_product FOREIGN KEY (product_id) REFERENCES smartoutlet_product.products(id),
    CONSTRAINT fk_stock_outlet FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id)
);

CREATE INDEX idx_stock_items_outlet ON stock_items(outlet_id);
CREATE INDEX idx_stock_items_product ON stock_items(product_id);
CREATE INDEX idx_stock_items_expiry ON stock_items(expiry_date);
CREATE INDEX idx_stock_items_status ON stock_items(status);
```

#### 2. Stock Movements
```sql
CREATE TABLE stock_movements (
    id BIGSERIAL PRIMARY KEY,
    stock_item_id BIGINT NOT NULL,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'WASTE')),
    quantity INTEGER NOT NULL,
    from_outlet_id BIGINT,
    to_outlet_id BIGINT,
    reason VARCHAR(500),
    reference_id BIGINT, -- Transaction ID, Order ID, etc.
    reference_type VARCHAR(50), -- 'TRANSACTION', 'ORDER', 'ADJUSTMENT'
    unit_cost DECIMAL(10,2),
    total_value DECIMAL(10,2),
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_movement_stock FOREIGN KEY (stock_item_id) REFERENCES stock_items(id),
    CONSTRAINT fk_movement_from_outlet FOREIGN KEY (from_outlet_id) REFERENCES smartoutlet_outlet.outlets(id),
    CONSTRAINT fk_movement_to_outlet FOREIGN KEY (to_outlet_id) REFERENCES smartoutlet_outlet.outlets(id),
    CONSTRAINT fk_movement_created_by FOREIGN KEY (created_by) REFERENCES smartoutlet_auth.users(id)
);

CREATE INDEX idx_stock_movements_stock_item ON stock_movements(stock_item_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
```

#### 3. Suppliers
```sql
CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    payment_terms VARCHAR(100),
    credit_limit DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_status ON suppliers(status);
```

#### 4. Purchase Orders
```sql
CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ORDERED', 'RECEIVED', 'CANCELLED')),
    total_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    CONSTRAINT fk_po_outlet FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id),
    CONSTRAINT fk_po_created_by FOREIGN KEY (created_by) REFERENCES smartoutlet_auth.users(id)
);

CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_outlet ON purchase_orders(outlet_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
```

#### 5. Purchase Order Items
```sql
CREATE TABLE purchase_order_items (
    id BIGSERIAL PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_poi_purchase_order FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
    CONSTRAINT fk_poi_product FOREIGN KEY (product_id) REFERENCES smartoutlet_product.products(id)
);

CREATE INDEX idx_purchase_order_items_po ON purchase_order_items(purchase_order_id);
```

---

## 🧂 Recipe Service Database (`coralserve_recipe`)

### Core Tables

#### 1. Raw Materials
```sql
CREATE TABLE raw_materials (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    description TEXT,
    unit_of_measure VARCHAR(20) NOT NULL,
    cost_per_unit DECIMAL(10,2),
    supplier_id BIGINT,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    expiry_days INTEGER,
    storage_conditions VARCHAR(200),
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_material_supplier FOREIGN KEY (supplier_id) REFERENCES coralserve_inventory.suppliers(id)
);

CREATE INDEX idx_raw_materials_sku ON raw_materials(sku);
CREATE INDEX idx_raw_materials_category ON raw_materials(category);
CREATE INDEX idx_raw_materials_status ON raw_materials(status);
```

#### 2. Recipes
```sql
CREATE TABLE recipes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    product_id BIGINT NOT NULL,
    description TEXT,
    yield_quantity DECIMAL(10,4) NOT NULL,
    yield_unit VARCHAR(20) NOT NULL,
    preparation_time INTEGER, -- in minutes
    cooking_time INTEGER, -- in minutes
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DRAFT')),
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_recipe_product FOREIGN KEY (product_id) REFERENCES smartoutlet_product.products(id),
    CONSTRAINT fk_recipe_created_by FOREIGN KEY (created_by) REFERENCES smartoutlet_auth.users(id)
);

CREATE INDEX idx_recipes_product ON recipes(product_id);
CREATE INDEX idx_recipes_status ON recipes(status);
```

#### 3. Recipe Ingredients
```sql
CREATE TABLE recipe_ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    quantity DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    preparation_notes TEXT,
    is_optional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ingredient_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    CONSTRAINT fk_ingredient_material FOREIGN KEY (material_id) REFERENCES raw_materials(id)
);

CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_material ON recipe_ingredients(material_id);
```

#### 4. Recipe Instructions
```sql
CREATE TABLE recipe_instructions (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    step_number INTEGER NOT NULL,
    instruction TEXT NOT NULL,
    time_required INTEGER, -- in minutes
    temperature DECIMAL(5,2), -- in Celsius
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_instruction_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE INDEX idx_recipe_instructions_recipe ON recipe_instructions(recipe_id);
```

#### 5. Material Consumption
```sql
CREATE TABLE material_consumption (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    transaction_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    consumption_date DATE NOT NULL,
    quantity_consumed DECIMAL(10,4) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_consumption_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    CONSTRAINT fk_consumption_transaction FOREIGN KEY (transaction_id) REFERENCES smartoutlet_pos.transactions(id),
    CONSTRAINT fk_consumption_outlet FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id)
);

CREATE INDEX idx_material_consumption_recipe ON material_consumption(recipe_id);
CREATE INDEX idx_material_consumption_transaction ON material_consumption(transaction_id);
CREATE INDEX idx_material_consumption_date ON material_consumption(consumption_date);
```

---

## 👥 Staff Service Database (`coralserve_staff`)

### Core Tables

#### 1. Staff Members
```sql
CREATE TABLE staff_members (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    hire_date DATE NOT NULL,
    termination_date DATE,
    salary DECIMAL(10,2),
    hourly_rate DECIMAL(8,2),
    employment_type VARCHAR(20) CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TERMINATED', 'SUSPENDED')),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES smartoutlet_auth.users(id),
    CONSTRAINT fk_staff_outlet FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id)
);

CREATE INDEX idx_staff_members_outlet ON staff_members(outlet_id);
CREATE INDEX idx_staff_members_status ON staff_members(status);
CREATE INDEX idx_staff_members_position ON staff_members(position);
```

#### 2. Shifts
```sql
CREATE TABLE shifts (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration INTEGER DEFAULT 0, -- in minutes
    shift_type VARCHAR(20) CHECK (shift_type IN ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', 'CUSTOM')),
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_shift_staff FOREIGN KEY (staff_id) REFERENCES staff_members(id),
    CONSTRAINT fk_shift_outlet FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id),
    CONSTRAINT fk_shift_created_by FOREIGN KEY (created_by) REFERENCES smartoutlet_auth.users(id)
);

CREATE INDEX idx_shifts_staff ON shifts(staff_id);
CREATE INDEX idx_shifts_outlet ON shifts(outlet_id);
CREATE INDEX idx_shifts_date ON shifts(shift_date);
CREATE INDEX idx_shifts_status ON shifts(status);
```

#### 3. Attendance
```sql
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    shift_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    clock_in_time TIMESTAMP,
    clock_out_time TIMESTAMP,
    break_start_time TIMESTAMP,
    break_end_time TIMESTAMP,
    total_hours DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'PRESENT' CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_attendance_staff FOREIGN KEY (staff_id) REFERENCES staff_members(id),
    CONSTRAINT fk_attendance_shift FOREIGN KEY (shift_id) REFERENCES shifts(id)
);

CREATE INDEX idx_attendance_staff ON attendance(staff_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);
```

#### 4. Tasks
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    outlet_id BIGINT NOT NULL,
    assigned_to BIGINT,
    assigned_by BIGINT NOT NULL,
    due_date DATE,
    due_time TIME,
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    completion_notes TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_task_outlet FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id),
    CONSTRAINT fk_task_assigned_to FOREIGN KEY (assigned_to) REFERENCES staff_members(id),
    CONSTRAINT fk_task_assigned_by FOREIGN KEY (assigned_by) REFERENCES smartoutlet_auth.users(id)
);

CREATE INDEX idx_tasks_outlet ON tasks(outlet_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
```

#### 5. Task Categories
```sql
CREATE TABLE task_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_categories_name ON task_categories(name);
```

---

## 🌍 Tax Service Database (`coralserve_tax`)

### Core Tables

#### 1. Tax Rules
```sql
CREATE TABLE tax_rules (
    id BIGSERIAL PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    state_code VARCHAR(10),
    city_code VARCHAR(10),
    tax_type VARCHAR(50) NOT NULL, -- GST, VAT, SERVICE_TAX, etc.
    tax_name VARCHAR(100) NOT NULL,
    rate DECIMAL(5,4) NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    is_compound BOOLEAN DEFAULT FALSE,
    is_exempt BOOLEAN DEFAULT FALSE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tax_rules_country ON tax_rules(country_code);
CREATE INDEX idx_tax_rules_state ON tax_rules(state_code);
CREATE INDEX idx_tax_rules_type ON tax_rules(tax_type);
CREATE INDEX idx_tax_rules_effective_date ON tax_rules(effective_date);
```

#### 2. Product Tax Mapping
```sql
CREATE TABLE product_tax_mapping (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    tax_rule_id BIGINT NOT NULL,
    is_exempt BOOLEAN DEFAULT FALSE,
    exemption_reason VARCHAR(200),
    effective_date DATE NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_tax_mapping_product FOREIGN KEY (product_id) REFERENCES smartoutlet_product.products(id),
    CONSTRAINT fk_tax_mapping_rule FOREIGN KEY (tax_rule_id) REFERENCES tax_rules(id)
);

CREATE INDEX idx_product_tax_mapping_product ON product_tax_mapping(product_id);
CREATE INDEX idx_product_tax_mapping_rule ON product_tax_mapping(tax_rule_id);
```

#### 3. Tax Transactions
```sql
CREATE TABLE tax_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL,
    tax_rule_id BIGINT NOT NULL,
    taxable_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_tax_transaction_transaction FOREIGN KEY (transaction_id) REFERENCES smartoutlet_pos.transactions(id),
    CONSTRAINT fk_tax_transaction_rule FOREIGN KEY (tax_rule_id) REFERENCES tax_rules(id)
);

CREATE INDEX idx_tax_transactions_transaction ON tax_transactions(transaction_id);
CREATE INDEX idx_tax_transactions_rule ON tax_transactions(tax_rule_id);
```

---

## 📈 Analytics Service Database (`coralserve_analytics`)

### Core Tables

#### 1. Analytics Cache
```sql
CREATE TABLE analytics_cache (
    id BIGSERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    outlet_id BIGINT,
    date_range VARCHAR(20) NOT NULL, -- DAILY, WEEKLY, MONTHLY, YEARLY
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    metric_value JSONB NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_analytics_cache_outlet FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id)
);

CREATE INDEX idx_analytics_cache_metric ON analytics_cache(metric_name);
CREATE INDEX idx_analytics_cache_outlet ON analytics_cache(outlet_id);
CREATE INDEX idx_analytics_cache_date_range ON analytics_cache(date_range);
CREATE INDEX idx_analytics_cache_expires ON analytics_cache(expires_at);
```

#### 2. Forecast Models
```sql
CREATE TABLE forecast_models (
    id BIGSERIAL PRIMARY KEY,
    model_type VARCHAR(50) NOT NULL, -- SALES, INVENTORY, STAFF, WASTE
    outlet_id BIGINT,
    model_name VARCHAR(100) NOT NULL,
    model_data JSONB NOT NULL,
    accuracy_score DECIMAL(5,4),
    training_date TIMESTAMP NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TRAINING')),
    
    CONSTRAINT fk_forecast_models_outlet FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id)
);

CREATE INDEX idx_forecast_models_type ON forecast_models(model_type);
CREATE INDEX idx_forecast_models_outlet ON forecast_models(outlet_id);
CREATE INDEX idx_forecast_models_status ON forecast_models(status);
```

#### 3. Custom Reports
```sql
CREATE TABLE custom_reports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL, -- SALES, INVENTORY, STAFF, EXPENSE
    query_config JSONB NOT NULL,
    schedule_config JSONB, -- for scheduled reports
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_custom_reports_created_by FOREIGN KEY (created_by) REFERENCES smartoutlet_auth.users(id)
);

CREATE INDEX idx_custom_reports_type ON custom_reports(report_type);
CREATE INDEX idx_custom_reports_created_by ON custom_reports(created_by);
```

---

## 🧾 Audit Service Database (`coralserve_audit`)

### Core Tables

#### 1. Audit Logs
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE', 'RESTORE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id BIGINT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### 2. Data Backups
```sql
CREATE TABLE data_backups (
    id BIGSERIAL PRIMARY KEY,
    backup_name VARCHAR(200) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('FULL', 'INCREMENTAL', 'DIFFERENTIAL')),
    file_path VARCHAR(500),
    file_size BIGINT,
    record_count INTEGER,
    backup_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED', 'IN_PROGRESS')),
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_data_backups_created_by FOREIGN KEY (created_by) REFERENCES smartoutlet_auth.users(id)
);

CREATE INDEX idx_data_backups_table ON data_backups(table_name);
CREATE INDEX idx_data_backups_date ON data_backups(backup_date);
CREATE INDEX idx_data_backups_status ON data_backups(status);
```

---

## 🔗 Cross-Service Relationships

### Foreign Key Constraints
```sql
-- Inventory to Product Service
ALTER TABLE coralserve_inventory.stock_items 
ADD CONSTRAINT fk_stock_product 
FOREIGN KEY (product_id) REFERENCES smartoutlet_product.products(id);

-- Inventory to Outlet Service
ALTER TABLE coralserve_inventory.stock_items 
ADD CONSTRAINT fk_stock_outlet 
FOREIGN KEY (outlet_id) REFERENCES smartoutlet_outlet.outlets(id);

-- Recipe to Product Service
ALTER TABLE coralserve_recipe.recipes 
ADD CONSTRAINT fk_recipe_product 
FOREIGN KEY (product_id) REFERENCES smartoutlet_product.products(id);

-- Staff to Auth Service
ALTER TABLE coralserve_staff.staff_members 
ADD CONSTRAINT fk_staff_user 
FOREIGN KEY (user_id) REFERENCES smartoutlet_auth.users(id);

-- All services to Auth Service for created_by fields
-- (Examples shown in individual table definitions)
```

---

## 📊 Database Migration Strategy

### Phase 1: Core Services
1. Create new databases
2. Create base tables
3. Add indexes
4. Set up foreign key constraints

### Phase 2: Data Migration
1. Migrate existing data
2. Validate relationships
3. Update references

### Phase 3: Optimization
1. Add performance indexes
2. Optimize queries
3. Set up monitoring

---

*This schema provides a complete foundation for the CoralServe system with proper relationships, constraints, and indexing for optimal performance.* 