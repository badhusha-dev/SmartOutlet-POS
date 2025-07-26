#!/bin/bash

echo "Creating databases for SmartOutlet POS services..."

# Create databases
echo "Creating smartoutlet_outlet database..."
psql -U postgres -c "CREATE DATABASE smartoutlet_outlet;" 2>/dev/null || echo "Database smartoutlet_outlet might already exist"

echo "Creating smartoutlet_expense database..."
psql -U postgres -c "CREATE DATABASE smartoutlet_expense;" 2>/dev/null || echo "Database smartoutlet_expense might already exist"

echo "Creating smartoutlet_auth database..."
psql -U postgres -c "CREATE DATABASE smartoutlet_auth;" 2>/dev/null || echo "Database smartoutlet_auth might already exist"

echo "Creating smartoutlet_product database..."
psql -U postgres -c "CREATE DATABASE smartoutlet_product;" 2>/dev/null || echo "Database smartoutlet_product might already exist"

echo "Databases created successfully!"
echo "You can now start the services." 