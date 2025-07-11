-- Create databases for SmartOutlet POS microservices
CREATE DATABASE IF NOT EXISTS smartoutlet_auth;
CREATE DATABASE IF NOT EXISTS smartoutlet_outlet;
CREATE DATABASE IF NOT EXISTS smartoutlet_product;
CREATE DATABASE IF NOT EXISTS smartoutlet_pos;
CREATE DATABASE IF NOT EXISTS smartoutlet_expense;

-- Grant privileges to root user
GRANT ALL PRIVILEGES ON smartoutlet_auth.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON smartoutlet_outlet.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON smartoutlet_product.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON smartoutlet_pos.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON smartoutlet_expense.* TO 'root'@'localhost';

FLUSH PRIVILEGES;

-- Show created databases
SHOW DATABASES LIKE 'smartoutlet_%'; 