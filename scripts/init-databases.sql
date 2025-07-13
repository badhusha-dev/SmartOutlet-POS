-- SmartOutlet POS System Database Initialization Script (PostgreSQL)
-- This script creates all necessary databases for the microservices

-- Create databases for each service (run as the postgres superuser)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smartoutlet_auth') THEN
        CREATE DATABASE smartoutlet_auth;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smartoutlet_outlet') THEN
        CREATE DATABASE smartoutlet_outlet;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smartoutlet_product') THEN
        CREATE DATABASE smartoutlet_product;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smartoutlet_pos') THEN
        CREATE DATABASE smartoutlet_pos;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smartoutlet_expense') THEN
        CREATE DATABASE smartoutlet_expense;
    END IF;
END $$;

-- Grant all privileges to the 'postgres' user for all databases
ALTER DATABASE smartoutlet_auth OWNER TO postgres;
ALTER DATABASE smartoutlet_outlet OWNER TO postgres;
ALTER DATABASE smartoutlet_product OWNER TO postgres;
ALTER DATABASE smartoutlet_pos OWNER TO postgres;
ALTER DATABASE smartoutlet_expense OWNER TO postgres;