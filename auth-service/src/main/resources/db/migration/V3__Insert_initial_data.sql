-- Insert default tenant
INSERT INTO tenants (name, code, description, status, subscription_plan, max_outlets, max_users, created_by) 
VALUES ('SmartOutlet Demo', 'DEMO', 'Default tenant for demonstration purposes', 'ACTIVE', 'PREMIUM', 10, 50, 'SYSTEM');

-- Insert default admin user
-- Password: admin123 (BCrypt hashed)
INSERT INTO users (
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role, 
    tenant_id, 
    is_active, 
    created_by
) VALUES (
    'admin',
    'admin@smartoutlet.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyc/Zo/VW/x0VCEq7OLTGq', -- admin123
    'System',
    'Administrator',
    'ADMIN',
    1,
    TRUE,
    'SYSTEM'
);

-- Insert default staff user
-- Password: staff123 (BCrypt hashed)
INSERT INTO users (
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role, 
    tenant_id, 
    is_active, 
    created_by
) VALUES (
    'staff',
    'staff@smartoutlet.com',
    '$2a$12$8wgVkiTNChJqBOFz0LNuDu8gLKk4.fGVbJMqZQj3LNuDu8gLKk4.f', -- staff123
    'Demo',
    'Staff',
    'STAFF',
    1,
    TRUE,
    'SYSTEM'
);