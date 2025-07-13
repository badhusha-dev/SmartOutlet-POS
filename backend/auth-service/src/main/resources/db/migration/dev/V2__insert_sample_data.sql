-- V2__insert_sample_data.sql
-- Insert sample roles and users data

-- Insert sample roles
INSERT INTO roles (name, description, created_at, updated_at) VALUES
('ADMIN', 'System Administrator with full access to all features', NOW(), NOW()),
('MANAGER', 'Outlet Manager with management privileges', NOW(), NOW()),
('CASHIER', 'Cashier with sales and inventory access', NOW(), NOW()),
('INVENTORY', 'Inventory manager with stock management access', NOW(), NOW()),
('ACCOUNTANT', 'Accountant with financial reporting access', NOW(), NOW()),
('SUPPORT', 'Customer support with limited access', NOW(), NOW());

-- Insert sample users with BCrypt hashed passwords (all passwords are 'password123')
-- BCrypt hash for 'password123' with salt rounds 10
INSERT INTO users (username, email, password, first_name, last_name, phone_number, is_active, is_verified, created_at, updated_at) VALUES
('admin', 'admin@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'John', 'Admin', '+1234567890', true, true, NOW(), NOW()),
('manager1', 'manager1@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Sarah', 'Johnson', '+1234567891', true, true, NOW(), NOW()),
('manager2', 'manager2@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Michael', 'Chen', '+1234567892', true, true, NOW(), NOW()),
('cashier1', 'cashier1@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Emily', 'Davis', '+1234567893', true, true, NOW(), NOW()),
('cashier2', 'cashier2@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'David', 'Wilson', '+1234567894', true, true, NOW(), NOW()),
('inventory1', 'inventory1@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Lisa', 'Brown', '+1234567895', true, true, NOW(), NOW()),
('accountant1', 'accountant1@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Robert', 'Taylor', '+1234567896', true, true, NOW(), NOW()),
('support1', 'support1@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Jennifer', 'Garcia', '+1234567897', true, true, NOW(), NOW()),
('cashier3', 'cashier3@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Alex', 'Martinez', '+1234567898', true, true, NOW(), NOW()),
('manager3', 'manager3@smartoutlet.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Amanda', 'Lee', '+1234567899', true, true, NOW(), NOW());

-- Assign roles to users
-- Admin user gets all roles
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'admin';

-- Manager users get MANAGER role
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username IN ('manager1', 'manager2', 'manager3') AND r.name = 'MANAGER';

-- Cashier users get CASHIER role
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username IN ('cashier1', 'cashier2', 'cashier3') AND r.name = 'CASHIER';

-- Inventory user gets INVENTORY role
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'inventory1' AND r.name = 'INVENTORY';

-- Accountant user gets ACCOUNTANT role
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'accountant1' AND r.name = 'ACCOUNTANT';

-- Support user gets SUPPORT role
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'support1' AND r.name = 'SUPPORT';

-- Give some additional roles to managers (they can also act as cashiers)
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username IN ('manager1', 'manager2', 'manager3') AND r.name = 'CASHIER';

-- Give inventory user access to cashier functions too
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'inventory1' AND r.name = 'CASHIER'; 