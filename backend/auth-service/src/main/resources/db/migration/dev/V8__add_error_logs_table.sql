-- Migration: Add error_logs table
-- Version: V8
-- Description: Creates the error_logs table for logging application errors

CREATE TABLE error_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    error_message VARCHAR(1000) NOT NULL,
    error_type VARCHAR(100),
    action_performed VARCHAR(200),
    stack_trace TEXT,
    file_name VARCHAR(200),
    line_number INT,
    occurrence_count INT DEFAULT 1,
    last_occurrence TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    request_url VARCHAR(500),
    request_method VARCHAR(10),
    request_body TEXT,
    response_status INT,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(100),
    user_id BIGINT,
    username VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_error_log_type ON error_logs(error_type);
CREATE INDEX idx_error_log_action ON error_logs(action_performed);
CREATE INDEX idx_error_log_created ON error_logs(created_at);
CREATE INDEX idx_error_log_resolved ON error_logs(is_resolved);
CREATE INDEX idx_error_log_user ON error_logs(user_id);
CREATE INDEX idx_error_log_username ON error_logs(username);
CREATE INDEX idx_error_log_occurrence ON error_logs(occurrence_count);
CREATE INDEX idx_error_log_last_occurrence ON error_logs(last_occurrence); 