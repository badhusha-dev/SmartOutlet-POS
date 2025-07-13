ALTER DATABASE smartoutlet_auth;

USE smartoutlet_auth;

-- Create users and roles tables for auth-service
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(200),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create error logs table for tracking service issues
CREATE TABLE IF NOT EXISTS error_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    error_message TEXT NOT NULL,
    error_type VARCHAR(100),
    action_performed VARCHAR(200),
    user_id BIGINT,
    username VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    stack_trace TEXT,
    request_url VARCHAR(500),
    request_method VARCHAR(10),
    request_body TEXT,
    response_status INTEGER,
    occurrence_count INTEGER DEFAULT 1,
    first_occurrence TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_occurrence TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE,
    file_name VARCHAR(500),
    line_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolution_notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_error_type ON error_logs (error_type);
CREATE INDEX IF NOT EXISTS idx_action_performed ON error_logs (action_performed);
CREATE INDEX IF NOT EXISTS idx_user_id ON error_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_occurrence_count ON error_logs (occurrence_count);
CREATE INDEX IF NOT EXISTS idx_is_resolved ON error_logs (is_resolved);
CREATE INDEX IF NOT EXISTS idx_created_at ON error_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_last_occurrence ON error_logs (last_occurrence);
CREATE INDEX IF NOT EXISTS idx_file_name ON error_logs (file_name);
CREATE INDEX IF NOT EXISTS idx_line_number ON error_logs (line_number); 