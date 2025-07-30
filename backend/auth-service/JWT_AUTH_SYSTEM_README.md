# 🛡️ JWT-Based Authentication & Authorization System

A comprehensive Spring Boot microservices authentication system with dynamic role-based access control (RBAC), JWT tokens, and configurable permissions.

## 🌟 Features

- **JWT Authentication** - Secure token-based authentication
- **Dynamic Authorization** - Runtime configurable roles and permissions
- **Method-Level Security** - `@PreAuthorize` annotations with custom expressions
- **Role Hierarchy** - Support for role levels and inheritance
- **Department-Based Access** - Granular department and resource access control
- **Global Exception Handling** - Comprehensive error handling for auth scenarios
- **Swagger Integration** - Interactive API documentation with JWT support
- **BCrypt Password Encryption** - Secure password hashing
- **Database-Driven Permissions** - All roles and permissions stored in database

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     User        │────│      Role       │────│   Permission    │
│                 │    │                 │    │                 │
│ - username      │    │ - name          │    │ - name          │
│ - email         │    │ - displayName   │    │ - resource      │
│ - password      │    │ - hierarchyLevel│    │ - action        │
│ - roles (M:N)   │    │ - permissions   │    │ - description   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Database Setup

```sql
-- Create PostgreSQL database
CREATE DATABASE smartoutlet_auth;
CREATE USER smartoutlet_user WITH PASSWORD 'smartoutlet_pass';
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_auth TO smartoutlet_user;
```

### 2. Environment Variables

```bash
# Optional - defaults provided
export DB_USERNAME=smartoutlet_user
export DB_PASSWORD=smartoutlet_pass
export JWT_SECRET=your_super_secret_jwt_key_here
export JWT_EXPIRATION=86400000  # 24 hours
```

### 3. Run the Service

```bash
cd backend/auth-service
mvn spring-boot:run
```

### 4. Access Swagger UI

Open http://localhost:8081/swagger-ui.html

## 🔐 Default Test Users

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `admin123` | ADMIN | Full system access |
| `manager` | `manager123` | MANAGER | Management-level access |
| `staff` | `staff123` | STAFF | Basic operational access |

## 📡 API Endpoints

### Authentication

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "username": "admin",
  "email": "admin@smartoutlet.com",
  "fullName": "System Administrator",
  "roles": ["ADMIN"],
  "permissions": ["USER_CREATE", "USER_READ", "USER_UPDATE", "USER_DELETE", ...],
  "expiresAt": "2024-01-02T10:30:00",
  "issuedAt": "2024-01-01T10:30:00"
}
```

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "employeeId": "EMP004",
  "department": "Sales",
  "position": "Sales Associate"
}
```

### Protected Endpoints

All requests to protected endpoints must include the JWT token:

```bash
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## 🎯 Permission Examples

### Basic Permission Checks

```java
// Check single permission
@PreAuthorize("@permissionService.canAccess('USER_CREATE')")
public ResponseEntity<String> createUser() { ... }

// Check role
@PreAuthorize("@permissionService.hasRole('ADMIN')")
public ResponseEntity<String> adminOnly() { ... }

// Check multiple roles (ANY)
@PreAuthorize("@permissionService.hasAnyRole('ADMIN', 'MANAGER')")
public ResponseEntity<String> managerOrAdmin() { ... }

// Check multiple permissions (ALL)
@PreAuthorize("@permissionService.hasAllPermissions('USER_READ', 'SALE_READ')")
public ResponseEntity<String> bothPermissions() { ... }
```

### Advanced Permission Patterns

```java
// Dynamic resource-action check
@PreAuthorize("@permissionService.canAccessResource('PRODUCT', 'CREATE')")
public ResponseEntity<String> createProduct() { ... }

// Owner or admin access
@PreAuthorize("@permissionService.isOwnerOrAdmin(#userId)")
public ResponseEntity<String> getUserProfile(@PathVariable Long userId) { ... }

// Department-based access
@PreAuthorize("@permissionService.canAccessDepartment(#department)")
public ResponseEntity<String> departmentData(@PathVariable String department) { ... }

// Role hierarchy level
@PreAuthorize("@permissionService.hasMinimumRoleLevel(2)")
public ResponseEntity<String> managerLevel() { ... }
```

## 🧪 Testing the System

### 1. Login as Admin
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Test Protected Endpoint
```bash
curl -X GET http://localhost:8081/examples/admin-only \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 3. Test Permission-Based Access
```bash
# This should work for admin
curl -X POST http://localhost:8081/examples/create-user \
  -H "Authorization: Bearer ADMIN_TOKEN"

# This should fail for staff
curl -X POST http://localhost:8081/examples/create-user \
  -H "Authorization: Bearer STAFF_TOKEN"
```

## 📊 Permission Matrix

| Role | User Permissions | Sale Permissions | Product Permissions | Other |
|------|------------------|------------------|---------------------|-------|
| **ADMIN** | All | All | All | All |
| **MANAGER** | Create, Read, Update | All | All | Most |
| **STAFF** | Read | Create, Read, Update | Read | Limited |
| **CUSTOMER** | - | - | Read | Minimal |

## 🔧 Customization

### Adding New Permissions

```sql
INSERT INTO permissions (name, resource, action, description, is_active, created_at, updated_at) 
VALUES ('REPORT_GENERATE', 'REPORT', 'GENERATE', 'Generate system reports', true, NOW(), NOW());
```

### Creating Custom Roles

```sql
-- Create role
INSERT INTO roles (name, display_name, description, hierarchy_level, is_active, created_at, updated_at) 
VALUES ('ACCOUNTANT', 'Accountant', 'Financial data access', 3, true, NOW(), NOW());

-- Assign permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'ACCOUNTANT' AND p.name IN ('SALE_READ', 'REPORT_GENERATE');
```

### Custom Permission Checks

You can extend the `PermissionService` with custom business logic:

```java
@Service("permissionService")
public class PermissionService {
    
    // Custom business rule
    public boolean canProcessRefund(BigDecimal amount) {
        User user = getCurrentUser();
        
        // Only managers can process refunds over $100
        if (amount.compareTo(new BigDecimal("100")) > 0) {
            return user.getRoleNames().contains("MANAGER") || 
                   user.getRoleNames().contains("ADMIN");
        }
        
        // Staff can process small refunds
        return user.getPermissionNames().contains("SALE_UPDATE");
    }
}
```

## 🌐 Integration with Other Services

### In Other Microservices

1. **Add JWT dependency** in other services' `pom.xml`
2. **Copy JWT utilities** (`JwtTokenProvider`, `JwtAuthenticationFilter`)
3. **Configure security** to validate tokens from auth-service
4. **Use permission checks** in your controllers

### Example Integration

```java
@RestController
public class ProductController {
    
    @PostMapping("/products")
    @PreAuthorize("@permissionService.canAccess('PRODUCT_CREATE')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Your business logic here
        return ResponseEntity.ok(productService.create(product));
    }
}
```

## 🔍 Monitoring & Debugging

### Enable Debug Logging

```yaml
logging:
  level:
    com.smartoutlet.auth: DEBUG
    org.springframework.security: DEBUG
```

### Check User Permissions
```bash
GET /auth/me
Authorization: Bearer YOUR_TOKEN
```

### Validate Token
```bash
POST /auth/check-permission
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "permission": "USER_CREATE"
}
```

## 🛡️ Security Best Practices

1. **Use HTTPS** in production
2. **Rotate JWT secrets** regularly
3. **Set appropriate token expiration** times
4. **Implement refresh tokens** for long-lived sessions
5. **Log security events** for monitoring
6. **Use strong passwords** for default accounts
7. **Review permissions** regularly

## 🚨 Troubleshooting

### Common Issues

1. **403 Access Denied**
   - Check if user has required permission
   - Verify JWT token is valid and not expired
   - Ensure permission service bean is properly configured

2. **401 Unauthorized**
   - Verify JWT token is included in Authorization header
   - Check token format: `Bearer <token>`
   - Ensure token hasn't expired

3. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

### Debug Commands

```bash
# Check if service is running
curl http://localhost:8081/actuator/health

# Verify token claims
echo "YOUR_JWT_TOKEN" | cut -d. -f2 | base64 -d | jq

# Test public endpoint
curl http://localhost:8081/examples/public
```

## 📝 Notes

- JWT tokens contain user ID, roles, and permissions for offline validation
- Role hierarchy allows higher-level roles to inherit lower-level permissions
- All endpoints are documented in Swagger UI with security requirements
- The system supports both role-based and permission-based access control
- Database schema auto-creates on first run with sample data

---

**For more examples and detailed API documentation, visit the Swagger UI at http://localhost:8081/swagger-ui.html**