-- Create databases for all microservices
CREATE DATABASE IF NOT EXISTS smartoutlet_auth;
CREATE DATABASE IF NOT EXISTS smartoutlet_outlet;
CREATE DATABASE IF NOT EXISTS smartoutlet_product;
CREATE DATABASE IF NOT EXISTS smartoutlet_pos;
CREATE DATABASE IF NOT EXISTS smartoutlet_expense;

-- Grant privileges (optional, since we're using root)
GRANT ALL PRIVILEGES ON smartoutlet_auth.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON smartoutlet_outlet.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON smartoutlet_product.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON smartoutlet_pos.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON smartoutlet_expense.* TO 'root'@'%';

FLUSH PRIVILEGES;