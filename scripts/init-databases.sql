-- SmartOutlet POS System Database Initialization Script (PostgreSQL)
-- This script creates all necessary databases for the microservices

-- Create databases for each service
CREATE DATABASE smartoutlet_auth;
CREATE DATABASE smartoutlet_outlet;
CREATE DATABASE smartoutlet_product;
CREATE DATABASE smartoutlet_inventory;
CREATE DATABASE smartoutlet_pos;
CREATE DATABASE smartoutlet_expense;