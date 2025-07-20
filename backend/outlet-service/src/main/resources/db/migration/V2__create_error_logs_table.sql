-- V2__create_error_logs_table.sql
-- Updated to match Auth Service error_logs schema (PostgreSQL)

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
CREATE INDEX IF NOT EXISTS idx_error_type ON error_logs (error_type);
CREATE INDEX IF NOT EXISTS idx_action_performed ON error_logs (action_performed);
CREATE INDEX IF NOT EXISTS idx_user_id ON error_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_occurrence_count ON error_logs (occurrence_count);
CREATE INDEX IF NOT EXISTS idx_is_resolved ON error_logs (is_resolved);
CREATE INDEX IF NOT EXISTS idx_created_at ON error_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_last_occurrence ON error_logs (last_occurrence);
CREATE INDEX IF NOT EXISTS idx_file_name ON error_logs (file_name);
CREATE INDEX IF NOT EXISTS idx_line_number ON error_logs (line_number); 