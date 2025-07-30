-- Insert permissions if they don't exist
INSERT INTO permissions (name, resource, action, description, is_active, created_at, updated_at) 
VALUES 
    ('USER_CREATE', 'USER', 'CREATE', 'Create new users', true, NOW(), NOW()),
    ('USER_READ', 'USER', 'READ', 'View user information', true, NOW(), NOW()),
    ('USER_UPDATE', 'USER', 'UPDATE', 'Update user information', true, NOW(), NOW()),
    ('USER_DELETE', 'USER', 'DELETE', 'Delete users', true, NOW(), NOW()),
    
    ('ROLE_CREATE', 'ROLE', 'CREATE', 'Create new roles', true, NOW(), NOW()),
    ('ROLE_READ', 'ROLE', 'READ', 'View role information', true, NOW(), NOW()),
    ('ROLE_UPDATE', 'ROLE', 'UPDATE', 'Update role information', true, NOW(), NOW()),
    ('ROLE_DELETE', 'ROLE', 'DELETE', 'Delete roles', true, NOW(), NOW()),
    
    ('PERMISSION_CREATE', 'PERMISSION', 'CREATE', 'Create new permissions', true, NOW(), NOW()),
    ('PERMISSION_READ', 'PERMISSION', 'READ', 'View permission information', true, NOW(), NOW()),
    ('PERMISSION_UPDATE', 'PERMISSION', 'UPDATE', 'Update permission information', true, NOW(), NOW()),
    ('PERMISSION_DELETE', 'PERMISSION', 'DELETE', 'Delete permissions', true, NOW(), NOW()),
    
    ('SALE_CREATE', 'SALE', 'CREATE', 'Create sales transactions', true, NOW(), NOW()),
    ('SALE_READ', 'SALE', 'READ', 'View sales information', true, NOW(), NOW()),
    ('SALE_UPDATE', 'SALE', 'UPDATE', 'Update sales information', true, NOW(), NOW()),
    ('SALE_DELETE', 'SALE', 'DELETE', 'Delete sales transactions', true, NOW(), NOW()),
    
    ('PRODUCT_CREATE', 'PRODUCT', 'CREATE', 'Create new products', true, NOW(), NOW()),
    ('PRODUCT_READ', 'PRODUCT', 'READ', 'View product information', true, NOW(), NOW()),
    ('PRODUCT_UPDATE', 'PRODUCT', 'UPDATE', 'Update product information', true, NOW(), NOW()),
    ('PRODUCT_DELETE', 'PRODUCT', 'DELETE', 'Delete products', true, NOW(), NOW()),
    
    ('INVENTORY_CREATE', 'INVENTORY', 'CREATE', 'Create inventory records', true, NOW(), NOW()),
    ('INVENTORY_READ', 'INVENTORY', 'READ', 'View inventory information', true, NOW(), NOW()),
    ('INVENTORY_UPDATE', 'INVENTORY', 'UPDATE', 'Update inventory information', true, NOW(), NOW()),
    ('INVENTORY_DELETE', 'INVENTORY', 'DELETE', 'Delete inventory records', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert roles if they don't exist
INSERT INTO roles (name, display_name, description, hierarchy_level, is_active, is_system_role, created_at, updated_at) 
VALUES 
    ('ADMIN', 'System Administrator', 'Full system access with all permissions', 1, true, true, NOW(), NOW()),
    ('MANAGER', 'Store Manager', 'Manager-level access to most features', 2, true, true, NOW(), NOW()),
    ('STAFF', 'Staff Member', 'Basic staff access to essential features', 3, true, true, NOW(), NOW()),
    ('CUSTOMER', 'Customer', 'Limited access for customer-facing features', 4, true, true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to ADMIN role (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to MANAGER role (most permissions except critical admin functions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'MANAGER'
  AND p.name NOT IN ('USER_DELETE', 'ROLE_CREATE', 'ROLE_DELETE', 'PERMISSION_CREATE', 'PERMISSION_UPDATE', 'PERMISSION_DELETE')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to STAFF role (basic operational permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'STAFF'
  AND p.name IN ('SALE_CREATE', 'SALE_READ', 'SALE_UPDATE', 'PRODUCT_READ', 'INVENTORY_READ', 'USER_READ')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to CUSTOMER role (very limited access)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'CUSTOMER'
  AND p.name IN ('PRODUCT_READ')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Create default admin user if it doesn't exist
-- Password: admin123 (BCrypt encoded)
INSERT INTO users (username, email, password, first_name, last_name, employee_id, department, position, is_enabled, is_account_non_expired, is_account_non_locked, is_credentials_non_expired, password_changed_at, created_at, updated_at)
VALUES ('admin', 'admin@smartoutlet.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'System', 'Administrator', 'EMP001', 'IT', 'System Administrator', true, true, true, true, NOW(), NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Assign ADMIN role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Create default manager user if it doesn't exist
-- Password: manager123 (BCrypt encoded)
INSERT INTO users (username, email, password, first_name, last_name, employee_id, department, position, is_enabled, is_account_non_expired, is_account_non_locked, is_credentials_non_expired, password_changed_at, created_at, updated_at)
VALUES ('manager', 'manager@smartoutlet.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Store', 'Manager', 'EMP002', 'Operations', 'Store Manager', true, true, true, true, NOW(), NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Assign MANAGER role to manager user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.username = 'manager' AND r.name = 'MANAGER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Create default staff user if it doesn't exist
-- Password: staff123 (BCrypt encoded)
INSERT INTO users (username, email, password, first_name, last_name, employee_id, department, position, is_enabled, is_account_non_expired, is_account_non_locked, is_credentials_non_expired, password_changed_at, created_at, updated_at)
VALUES ('staff', 'staff@smartoutlet.com', '$2a$10$HWJALLBd2QMTE5F5RY5Qs.oE0g9k7KyuHKAFwOvI3wCQ1Q5C7d3f.', 'Sales', 'Staff', 'EMP003', 'Sales', 'Sales Associate', true, true, true, true, NOW(), NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Assign STAFF role to staff user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.username = 'staff' AND r.name = 'STAFF'
ON CONFLICT (user_id, role_id) DO NOTHING;