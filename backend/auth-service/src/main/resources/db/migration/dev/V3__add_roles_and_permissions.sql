-- V3__add_roles_and_permissions.sql
-- Add roles and permissions for dynamic authorization

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(200),
    resource VARCHAR(50),
    action VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
-- Users permissions
('USERS_READ', 'Read user information', 'USERS', 'READ'),
('USERS_WRITE', 'Create and update users', 'USERS', 'WRITE'),
('USERS_DELETE', 'Delete users', 'USERS', 'DELETE'),
('USERS_ADMIN', 'Administer users', 'USERS', 'ADMIN'),

-- Outlets permissions
('OUTLETS_READ', 'Read outlet information', 'OUTLETS', 'READ'),
('OUTLETS_WRITE', 'Create and update outlets', 'OUTLETS', 'WRITE'),
('OUTLETS_DELETE', 'Delete outlets', 'OUTLETS', 'DELETE'),
('OUTLETS_ADMIN', 'Administer outlets', 'OUTLETS', 'ADMIN'),

-- Products permissions
('PRODUCTS_READ', 'Read product information', 'PRODUCTS', 'READ'),
('PRODUCTS_WRITE', 'Create and update products', 'PRODUCTS', 'WRITE'),
('PRODUCTS_DELETE', 'Delete products', 'PRODUCTS', 'DELETE'),
('PRODUCTS_ADMIN', 'Administer products', 'PRODUCTS', 'ADMIN'),

-- Inventory permissions
('INVENTORY_READ', 'Read inventory information', 'INVENTORY', 'READ'),
('INVENTORY_WRITE', 'Create and update inventory', 'INVENTORY', 'WRITE'),
('INVENTORY_DELETE', 'Delete inventory', 'INVENTORY', 'DELETE'),
('INVENTORY_ADMIN', 'Administer inventory', 'INVENTORY', 'ADMIN'),

-- Transactions permissions
('TRANSACTIONS_READ', 'Read transaction information', 'TRANSACTIONS', 'READ'),
('TRANSACTIONS_WRITE', 'Create and update transactions', 'TRANSACTIONS', 'WRITE'),
('TRANSACTIONS_DELETE', 'Delete transactions', 'TRANSACTIONS', 'DELETE'),
('TRANSACTIONS_ADMIN', 'Administer transactions', 'TRANSACTIONS', 'ADMIN'),

-- Customers permissions
('CUSTOMERS_READ', 'Read customer information', 'CUSTOMERS', 'READ'),
('CUSTOMERS_WRITE', 'Create and update customers', 'CUSTOMERS', 'WRITE'),
('CUSTOMERS_DELETE', 'Delete customers', 'CUSTOMERS', 'DELETE'),
('CUSTOMERS_ADMIN', 'Administer customers', 'CUSTOMERS', 'ADMIN'),

-- Expenses permissions
('EXPENSES_READ', 'Read expense information', 'EXPENSES', 'READ'),
('EXPENSES_WRITE', 'Create and update expenses', 'EXPENSES', 'WRITE'),
('EXPENSES_DELETE', 'Delete expenses', 'EXPENSES', 'DELETE'),
('EXPENSES_ADMIN', 'Administer expenses', 'EXPENSES', 'ADMIN'),

-- Reports permissions
('REPORTS_READ', 'Read reports', 'REPORTS', 'READ'),
('REPORTS_WRITE', 'Create reports', 'REPORTS', 'WRITE'),
('REPORTS_ADMIN', 'Administer reports', 'REPORTS', 'ADMIN'),

-- Audit permissions
('AUDIT_READ', 'Read audit logs', 'AUDIT', 'READ'),
('AUDIT_ADMIN', 'Administer audit logs', 'AUDIT', 'ADMIN'),

-- System permissions
('SYSTEM_READ', 'Read system information', 'SYSTEM', 'READ'),
('SYSTEM_WRITE', 'Update system configuration', 'SYSTEM', 'WRITE'),
('SYSTEM_ADMIN', 'Administer system', 'SYSTEM', 'ADMIN');

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'System Administrator with full access'),
('ROLE_MANAGER', 'Outlet Manager with management permissions'),
('ROLE_STAFF', 'Staff member with limited permissions'),
('ROLE_CASHIER', 'Cashier with transaction permissions'),
('ROLE_KITCHEN', 'Kitchen staff with product permissions');

-- Assign permissions to ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ROLE_ADMIN';

-- Assign permissions to MANAGER role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ROLE_MANAGER' 
AND p.name IN (
    'USERS_READ',
    'OUTLETS_READ', 'OUTLETS_WRITE',
    'PRODUCTS_READ', 'PRODUCTS_WRITE',
    'INVENTORY_READ', 'INVENTORY_WRITE',
    'TRANSACTIONS_READ', 'TRANSACTIONS_WRITE',
    'CUSTOMERS_READ', 'CUSTOMERS_WRITE',
    'EXPENSES_READ', 'EXPENSES_WRITE',
    'REPORTS_READ',
    'SYSTEM_READ'
);

-- Assign permissions to STAFF role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ROLE_STAFF' 
AND p.name IN (
    'OUTLETS_READ',
    'PRODUCTS_READ',
    'INVENTORY_READ',
    'TRANSACTIONS_READ', 'TRANSACTIONS_WRITE',
    'CUSTOMERS_READ', 'CUSTOMERS_WRITE',
    'EXPENSES_READ'
);

-- Assign permissions to CASHIER role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ROLE_CASHIER' 
AND p.name IN (
    'PRODUCTS_READ',
    'TRANSACTIONS_READ', 'TRANSACTIONS_WRITE',
    'CUSTOMERS_READ', 'CUSTOMERS_WRITE'
);

-- Assign permissions to KITCHEN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ROLE_KITCHEN' 
AND p.name IN (
    'PRODUCTS_READ',
    'INVENTORY_READ',
    'TRANSACTIONS_READ'
);

-- Assign admin role to existing admin user (assuming user ID 1 is admin)
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions(name);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id); 