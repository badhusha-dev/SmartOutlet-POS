-- V3__add_file_and_line_to_error_logs.sql
-- Add file_name and line_number columns to error_logs table for better error tracking

ALTER TABLE error_logs 
ADD COLUMN file_name VARCHAR(500),
ADD COLUMN line_number INTEGER;

-- Add index for better query performance
CREATE INDEX idx_file_name ON error_logs(file_name);
CREATE INDEX idx_line_number ON error_logs(line_number); 