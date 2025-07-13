-- V1__init_outlet_schema.sql
-- Example: create outlets and staff_assignments tables for outlet-service
CREATE TABLE IF NOT EXISTS outlets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    outlet_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50),
    username VARCHAR(50),
    user_email VARCHAR(100),
    user_full_name VARCHAR(100),
    is_active BOOLEAN,
    assigned_at TIMESTAMP,
    FOREIGN KEY (outlet_id) REFERENCES outlets(id)
); 