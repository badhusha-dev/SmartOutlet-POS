-- V2__create_error_logs_table.sql
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
    last_occurrence TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_error_type (error_type),
    INDEX idx_action_performed (action_performed),
    INDEX idx_user_id (user_id),
    INDEX idx_occurrence_count (occurrence_count),
    INDEX idx_is_resolved (is_resolved),
    INDEX idx_created_at (created_at),
    INDEX idx_last_occurrence (last_occurrence)
); 