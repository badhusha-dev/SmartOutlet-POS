-- V1__init_auth_schema.sql for PostgreSQL

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(200),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    is_active BOOLEAN,
    is_verified BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    last_login TIMESTAMP
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id BIGSERIAL PRIMARY KEY,
    error_message TEXT,
    error_type VARCHAR(100),
    stack_trace TEXT,
    file_name VARCHAR(255),
    line_number INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id BIGINT,
    username VARCHAR(50),
    request_url VARCHAR(255),
    request_method VARCHAR(10),
    request_body TEXT,
    response_status INTEGER,
    action_performed VARCHAR(255),
    occurrence_count INTEGER,
    first_occurrence TIMESTAMP,
    last_occurrence TIMESTAMP,
    is_resolved BOOLEAN,
    resolution_notes TEXT,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_error_type ON error_logs (error_type);
CREATE INDEX idx_action_performed ON error_logs (action_performed);
CREATE INDEX idx_user_id ON error_logs (user_id);
CREATE INDEX idx_occurrence_count ON error_logs (occurrence_count);
CREATE INDEX idx_is_resolved ON error_logs (is_resolved);
CREATE INDEX idx_created_at ON error_logs (created_at);
CREATE INDEX idx_last_occurrence ON error_logs (last_occurrence);
CREATE INDEX idx_file_name ON error_logs (file_name);
CREATE INDEX idx_line_number ON error_logs (line_number); 