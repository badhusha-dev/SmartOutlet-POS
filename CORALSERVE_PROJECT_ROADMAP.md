# 🏝️ CoralServe Project Roadmap
## "Simplify. Serve. Scale."

### 📋 Project Overview
**CoralServe** is an advanced full-stack POS system built on the foundation of SmartOutlet POS, featuring Spring Boot Microservices, Kafka, JWT authentication, React Admin UI, and Docker deployment.

---

## 🎯 Core Modules & Features

### 1. 🔐 Authentication & Users
**Purpose**: Manage user registration, login, and role-based access (Admin, Manager, Staff)

#### 📱 Screens to Implement:
- Login / Register
- Forgot Password
- Role-based Dashboard Redirect
- User Profile & Password Reset
- Role & Permission Management (Admin Only)

#### 🛠️ Implementation Notes:
- **Current Status**: Basic JWT auth implemented
- **Enhancements Needed**: Role-based dashboards, password reset, permission management
- **Service**: Auth Service (existing)

---

### 2. 🏬 Outlet Management
**Purpose**: Manage branches/outlets/franchise locations

#### 📱 Screens to Implement:
- Outlet List (Card/Grid View with Map Pins)
- Add/Edit Outlet Modal
- Assign Manager & Staff
- Daily Operating Hours
- Outlet Performance Summary (Sales, Waste, Profit)

#### 🛠️ Implementation Notes:
- **Current Status**: Basic outlet management implemented
- **Enhancements Needed**: Map integration, performance metrics, staff assignment
- **Service**: Outlet Service (existing)

---

### 3. 🛒 POS Transactions
**Purpose**: Process and track point-of-sale transactions at outlets

#### 📱 Screens to Implement:
- POS Dashboard (Live Orders, Quick Add)
- Order Entry (Menu, Qty, Notes, Discounts)
- Checkout (Tax, Payment Mode, Invoice)
- Order History (Filters: date, status, customer)
- Refund & Reprint Receipt
- Customer Profiles (Loyalty Points, Preferences)

#### 🛠️ Implementation Notes:
- **Current Status**: ✅ **FULLY IMPLEMENTED**
- **Service**: POS Service (complete with all APIs)

---

### 4. 📦 Stock Management (Warehouse/Outlet-Level)
**Purpose**: Track finished product inventory across outlets

#### 📱 Screens to Implement:
- Stock Levels by Outlet
- Add/Transfer/Receive Stock
- Stock Adjustment Log (FIFO + Expiry Warnings)
- Expiry Color-Coding: 🟢 Fresh | 🟡 Near Expiry | 🔴 Expired
- Expiring Soon Filters
- Stock Reorder Alert List

#### 🛠️ Implementation Notes:
- **Current Status**: Basic product management in Product Service
- **New Service Needed**: Inventory Service
- **Features**: FIFO tracking, expiry management, transfer between outlets

---

### 5. 🧂 Raw Materials & Recipe Mapping
**Purpose**: Map raw materials to recipes (BOM - Bill of Materials), track consumption per sale

#### 📱 Screens to Implement:
- Raw Material List
- Add/Edit Material with UOM, Expiry, Vendor
- Recipe Builder (Select Item → Add Ingredients + Qty)
- Material Forecast Usage Chart (based on upcoming sales)
- Vendor Reorder Planning

#### 🛠️ Implementation Notes:
- **Current Status**: Not implemented
- **New Service Needed**: Recipe Service
- **Features**: BOM management, consumption tracking, vendor management

---

### 6. 💸 Expense Tracking
**Purpose**: Track operational expenses per outlet or globally

#### 📱 Screens to Implement:
- Expense List (Filters: Outlet, Type, Date)
- Add/Edit Expense
- Expense Categories Setup
- Recurring Expenses (e.g. Rent, Staff Salary)
- Expense Summary Chart (Monthly/Outlet-wise)

#### 🛠️ Implementation Notes:
- **Current Status**: ✅ **FULLY IMPLEMENTED**
- **Service**: Expense Service (complete with all APIs)

---

### 7. 🌐 Online Orders (Optional - External Integration)
**Purpose**: Sync online delivery platform orders with CoralServe

#### 📱 Screens to Implement:
- Online Order List (Auto Pull from API)
- Merge with Inventory Logic
- Auto Deduct Raw Materials
- Order Reconciliation Report

#### 🛠️ Implementation Notes:
- **Current Status**: Not implemented
- **New Service Needed**: Integration Service
- **Features**: External API integration, order synchronization

---

### 8. 🧾 Kafka Event Log (Internal Audit Trail)
**Purpose**: Log all major events like stock changes, orders, refunds for audit & rollback

#### 📱 Screens to Implement:
- Event Log Viewer
- Filters: Date, Module, Action Type (CREATE/UPDATE/DELETE)
- Event Payload Preview
- View Reversal History (Manual or Auto)

#### 🛠️ Implementation Notes:
- **Current Status**: Basic Kafka integration exists
- **Enhancements Needed**: Comprehensive event logging, audit trail
- **Service**: Enhanced across all services

---

### 9. 📈 Reports / AI Forecast (Dynamic Dashboard)
**Purpose**: Summarize all key KPIs and provide AI-based predictions

#### 📱 Screens to Implement:
- Dashboard KPIs (Sales, Cost, Profit, Waste, Forecast)
- Daily / Weekly / Monthly Sales Trends
- Forecast:
  - Expected Demand by Product
  - Stock Planning for Next 7 Days
- Custom Report Builder (Filter, Export to Excel/PDF)
- Staff Productivity Report
- Outlet-wise Performance Heatmap

#### 🛠️ Implementation Notes:
- **Current Status**: Not implemented
- **New Service Needed**: Analytics Service
- **Features**: AI forecasting, custom reports, data visualization

---

### 10. 👥 Staff Management & Task Scheduling
**Purpose**: Track staff, assign daily responsibilities, and monitor performance

#### 📱 Screens to Implement:
- Staff List by Outlet
- Role & Shift Assignment
- Daily Task List (e.g. Clean Kitchen, Prep Inventory)
- Task Completion Tracker
- Staff Attendance
- Payroll Integration (Optional)

#### 🛠️ Implementation Notes:
- **Current Status**: Not implemented
- **New Service Needed**: Staff Service
- **Features**: Task management, attendance tracking, performance monitoring

---

### 11. 🌍 Tax & Compliance (Dynamic by Country)
**Purpose**: Handle dynamic taxation per country/state (GST, VAT, Service Tax)

#### 📱 Screens to Implement:
- Tax Configuration per Country/Region
- Tax Type Mapping to Product/Service
- Auto Calculation on Invoice
- Tax Report by Period
- Dynamic Rules Engine (Configurable per country)

#### 🛠️ Implementation Notes:
- **Current Status**: Basic tax calculation in POS Service
- **New Service Needed**: Tax Service
- **Features**: Multi-country tax support, dynamic rules engine

---

### 12. 🧾 Backup, History & Soft Delete Logs
**Purpose**: Ensure data is never lost; allow audit/rollback and historical view

#### 📱 Screens to Implement:
- Change History per Table (CRUD Logs)
- Backup Table List (Critical: Order, Stock, Expense, User)
- View Deleted/Modified Entries
- Rollback Entry (Soft-delete Undo)

#### 🛠️ Implementation Notes:
- **Current Status**: Not implemented
- **New Service Needed**: Audit Service
- **Features**: Data versioning, rollback capabilities, audit trails

---

## 🧠 Optional: AI Modules

### Smart Promotions
- Suggest discounts on soon-to-expire stock
- Dynamic pricing based on demand

### Sales Forecasting
- Predict popular items by outlet/time
- Seasonal trend analysis

### Waste Reduction Plan
- Suggest optimal recipe/stock rotation
- Predictive waste management

---

## 🏗️ Technical Architecture

### Current Services (✅ Implemented):
1. **Auth Service** (Port 8081) - Basic authentication
2. **API Gateway** (Port 8080) - Service routing
3. **Product Service** (Port 8082) - Product management
4. **Outlet Service** (Port 8083) - Outlet management
5. **Expense Service** (Port 8084) - Expense tracking
6. **POS Service** (Port 8085) - Transaction processing

### New Services to Implement:
7. **Inventory Service** (Port 8086) - Stock management
8. **Recipe Service** (Port 8087) - BOM and recipe management
9. **Staff Service** (Port 8088) - Staff and task management
10. **Tax Service** (Port 8089) - Tax and compliance
11. **Analytics Service** (Port 8090) - Reports and AI
12. **Audit Service** (Port 8091) - Audit trails and history
13. **Integration Service** (Port 8092) - External integrations

---

## 🚀 Implementation Phases

### Phase 1: Core Infrastructure (Priority: High)
1. Enhanced User Management (Auth Service)
2. Advanced Stock Management (Inventory Service)
3. Recipe & BOM System (Recipe Service)

### Phase 2: Business Operations (Priority: Medium)
4. Staff Management (Staff Service)
5. Tax & Compliance (Tax Service)
6. Enhanced Outlet Management

### Phase 3: Advanced Features (Priority: Low)
7. Analytics & AI (Analytics Service)
8. Audit & History (Audit Service)
9. Online Orders Integration (Integration Service)

---

## 🎨 Frontend Architecture

### React Admin UI Components:
- **Role-based Dashboards**: Admin, Manager, Staff views
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: WebSocket integration
- **Advanced Filtering**: Search and filter capabilities
- **Data Visualization**: Charts and graphs
- **Export Functionality**: PDF, Excel export

### Key Libraries:
- React Admin
- Material-UI
- Chart.js / D3.js
- React Query
- React Hook Form

---

## 📊 Database Schema Evolution

### Current Tables:
- Users, Roles, Permissions
- Products, Categories
- Outlets, Staff
- Transactions, Transaction Items
- Customers
- Expenses

### New Tables to Add:
- Raw Materials
- Recipes (BOM)
- Stock Movements
- Staff Tasks
- Tax Rules
- Event Logs
- Audit Trails

---

## 🔧 Development Guidelines

### Code Standards:
- Follow existing microservices pattern
- Implement comprehensive Swagger documentation
- Use JWT authentication consistently
- Include mock data for testing
- Follow RESTful API design

### Testing Strategy:
- Unit tests for all services
- Integration tests for API endpoints
- End-to-end testing for critical flows
- Performance testing for high-load scenarios

---

## 📝 Notes for Future Implementation

1. **Start with Inventory Service** - Critical for business operations
2. **Enhance Auth Service** - Foundation for role-based access
3. **Implement Recipe Service** - Core for food service businesses
4. **Add Analytics Service** - Provides business insights
5. **Consider AI modules** - Competitive advantage

---

## 🎯 Success Metrics

### Technical Metrics:
- Service uptime > 99.9%
- API response time < 200ms
- Zero data loss
- Comprehensive audit trails

### Business Metrics:
- Reduced waste by 20%
- Improved staff productivity by 15%
- Faster order processing by 30%
- Better inventory accuracy by 95%

---

*This roadmap serves as a comprehensive guide for implementing CoralServe. Each module can be developed independently while maintaining the overall system architecture.* 