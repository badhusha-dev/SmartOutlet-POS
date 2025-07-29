-- V1__create_expenses_table.sql for PostgreSQL

CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    outlet_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    user_agent VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX idx_expenses_outlet_id ON expenses(outlet_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);
CREATE INDEX idx_error_type ON error_logs (error_type);
CREATE INDEX idx_error_action_performed ON error_logs (action_performed);
CREATE INDEX idx_error_created_at ON error_logs (created_at);
CREATE INDEX idx_error_file_name ON error_logs (file_name);
CREATE INDEX idx_error_line_number ON error_logs (line_number); 