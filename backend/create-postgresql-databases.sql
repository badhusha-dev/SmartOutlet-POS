-- SmartOutlet POS PostgreSQL Database Creation Script
-- Run this script as a PostgreSQL superuser (postgres)

-- Create databases for each service
CREATE DATABASE smartoutlet_auth;
CREATE DATABASE smartoutlet_gateway;
CREATE DATABASE smartoutlet_product;
CREATE DATABASE smartoutlet_outlet;
CREATE DATABASE smartoutlet_pos;
CREATE DATABASE smartoutlet_inventory;
CREATE DATABASE smartoutlet_recipe;
CREATE DATABASE smartoutlet_expense;

-- Grant privileges to postgres user (adjust if using different user)
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_auth TO postgres;
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_gateway TO postgres;
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_product TO postgres;
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_outlet TO postgres;
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_pos TO postgres;
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_inventory TO postgres;
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_recipe TO postgres;
GRANT ALL PRIVILEGES ON DATABASE smartoutlet_expense TO postgres;

-- Display created databases
SELECT datname FROM pg_database WHERE datname LIKE 'smartoutlet_%'; 