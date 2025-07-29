-- V1__init_outlet_schema.sql for PostgreSQL
-- Create outlets and staff_assignments tables for outlet-service

CREATE TABLE IF NOT EXISTS outlets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    address VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    manager_id BIGINT,
    manager_name VARCHAR(100),
    postal_code VARCHAR(20),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    opening_hours VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_assignments (
    id BIGSERIAL PRIMARY KEY,
    outlet_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    username VARCHAR(50),
    user_email VARCHAR(100),
    user_full_name VARCHAR(100),
    role VARCHAR(50),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (outlet_id) REFERENCES outlets(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_outlets_name ON outlets(name);
CREATE INDEX idx_outlets_city ON outlets(city);
CREATE INDEX idx_outlets_is_active ON outlets(is_active);
CREATE INDEX idx_staff_assignments_outlet_id ON staff_assignments(outlet_id);
CREATE INDEX idx_staff_assignments_user_id ON staff_assignments(user_id); 