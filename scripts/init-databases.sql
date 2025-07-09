-- SmartOutlet POS System Database Initialization Script
-- This script creates all necessary databases for the microservices

-- Create databases for each service
CREATE DATABASE IF NOT EXISTS smartoutlet_auth;
CREATE DATABASE IF NOT EXISTS smartoutlet_outlet;
CREATE DATABASE IF NOT EXISTS smartoutlet_product;
CREATE DATABASE IF NOT EXISTS smartoutlet_pos;
CREATE DATABASE IF NOT EXISTS smartoutlet_expense;

-- Grant all privileges to root user for all databases
GRANT ALL PRIVILEGES ON smartoutlet_auth.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON smartoutlet_outlet.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON smartoutlet_product.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON smartoutlet_pos.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON smartoutlet_expense.* TO 'root'@'%';

-- Flush privileges
FLUSH PRIVILEGES;