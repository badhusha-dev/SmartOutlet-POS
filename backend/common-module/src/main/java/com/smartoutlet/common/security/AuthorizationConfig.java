package com.smartoutlet.common.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Dynamic Authorization Configuration
 * Defines roles, permissions, and their mappings for RBAC
 */
@RequiredArgsConstructor
@Getter
public class AuthorizationConfig {

    // User Roles
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_MANAGER = "ROLE_MANAGER";
    public static final String ROLE_STAFF = "ROLE_STAFF";
    public static final String ROLE_CASHIER = "ROLE_CASHIER";
    public static final String ROLE_KITCHEN = "ROLE_KITCHEN";

    // Permission Categories
    public static final String PERMISSION_READ = "READ";
    public static final String PERMISSION_WRITE = "WRITE";
    public static final String PERMISSION_DELETE = "DELETE";
    public static final String PERMISSION_ADMIN = "ADMIN";

    // Resource Categories
    public static final String RESOURCE_USERS = "USERS";
    public static final String RESOURCE_OUTLETS = "OUTLETS";
    public static final String RESOURCE_PRODUCTS = "PRODUCTS";
    public static final String RESOURCE_INVENTORY = "INVENTORY";
    public static final String RESOURCE_TRANSACTIONS = "TRANSACTIONS";
    public static final String RESOURCE_CUSTOMERS = "CUSTOMERS";
    public static final String RESOURCE_EXPENSES = "EXPENSES";
    public static final String RESOURCE_REPORTS = "REPORTS";
    public static final String RESOURCE_AUDIT = "AUDIT";
    public static final String RESOURCE_SYSTEM = "SYSTEM";

    // Permission Definitions
    public static final Map<String, Set<String>> ROLE_PERMISSIONS = Map.of(
        ROLE_ADMIN, Set.of(
            // Users
            "USERS_READ", "USERS_WRITE", "USERS_DELETE", "USERS_ADMIN",
            // Outlets
            "OUTLETS_READ", "OUTLETS_WRITE", "OUTLETS_DELETE", "OUTLETS_ADMIN",
            // Products
            "PRODUCTS_READ", "PRODUCTS_WRITE", "PRODUCTS_DELETE", "PRODUCTS_ADMIN",
            // Inventory
            "INVENTORY_READ", "INVENTORY_WRITE", "INVENTORY_DELETE", "INVENTORY_ADMIN",
            // Transactions
            "TRANSACTIONS_READ", "TRANSACTIONS_WRITE", "TRANSACTIONS_DELETE", "TRANSACTIONS_ADMIN",
            // Customers
            "CUSTOMERS_READ", "CUSTOMERS_WRITE", "CUSTOMERS_DELETE", "CUSTOMERS_ADMIN",
            // Expenses
            "EXPENSES_READ", "EXPENSES_WRITE", "EXPENSES_DELETE", "EXPENSES_ADMIN",
            // Reports
            "REPORTS_READ", "REPORTS_WRITE", "REPORTS_ADMIN",
            // Audit
            "AUDIT_READ", "AUDIT_ADMIN",
            // System
            "SYSTEM_READ", "SYSTEM_WRITE", "SYSTEM_ADMIN"
        ),
        ROLE_MANAGER, Set.of(
            // Users (limited)
            "USERS_READ",
            // Outlets
            "OUTLETS_READ", "OUTLETS_WRITE",
            // Products
            "PRODUCTS_READ", "PRODUCTS_WRITE",
            // Inventory
            "INVENTORY_READ", "INVENTORY_WRITE",
            // Transactions
            "TRANSACTIONS_READ", "TRANSACTIONS_WRITE",
            // Customers
            "CUSTOMERS_READ", "CUSTOMERS_WRITE",
            // Expenses
            "EXPENSES_READ", "EXPENSES_WRITE",
            // Reports
            "REPORTS_READ",
            // System (limited)
            "SYSTEM_READ"
        ),
        ROLE_STAFF, Set.of(
            // Outlets (read only)
            "OUTLETS_READ",
            // Products (read only)
            "PRODUCTS_READ",
            // Inventory (read only)
            "INVENTORY_READ",
            // Transactions (limited)
            "TRANSACTIONS_READ", "TRANSACTIONS_WRITE",
            // Customers (limited)
            "CUSTOMERS_READ", "CUSTOMERS_WRITE",
            // Expenses (read only)
            "EXPENSES_READ"
        ),
        ROLE_CASHIER, Set.of(
            // Products (read only)
            "PRODUCTS_READ",
            // Transactions (create and read own)
            "TRANSACTIONS_READ", "TRANSACTIONS_WRITE",
            // Customers (read and create)
            "CUSTOMERS_READ", "CUSTOMERS_WRITE"
        ),
        ROLE_KITCHEN, Set.of(
            // Products (read only)
            "PRODUCTS_READ",
            // Inventory (read only)
            "INVENTORY_READ",
            // Transactions (read only)
            "TRANSACTIONS_READ"
        )
    );

    // API Endpoint to Permission Mapping
    public static final Map<String, String> API_PERMISSIONS = Map.ofEntries(
        // Auth Service
        Map.entry("POST /api/auth/register", "USERS_WRITE"),
        Map.entry("POST /api/auth/login", "USERS_READ"),
        Map.entry("POST /api/auth/refresh", "USERS_READ"),
        Map.entry("GET /api/auth/profile", "USERS_READ"),
        Map.entry("PUT /api/auth/profile", "USERS_WRITE"),
        Map.entry("POST /api/auth/change-password", "USERS_WRITE"),
        Map.entry("POST /api/auth/forgot-password", "USERS_READ"),
        Map.entry("POST /api/auth/reset-password", "USERS_WRITE"),
        Map.entry("GET /api/auth/users", "USERS_READ"),
        Map.entry("POST /api/auth/users", "USERS_WRITE"),
        Map.entry("PUT /api/auth/users/{id}", "USERS_WRITE"),
        Map.entry("DELETE /api/auth/users/{id}", "USERS_DELETE"),
        Map.entry("GET /api/auth/roles", "USERS_ADMIN"),
        Map.entry("POST /api/auth/roles", "USERS_ADMIN"),
        Map.entry("PUT /api/auth/roles/{id}", "USERS_ADMIN"),
        Map.entry("DELETE /api/auth/roles/{id}", "USERS_DELETE"),

        // Outlet Service
        Map.entry("GET /api/outlets", "OUTLETS_READ"),
        Map.entry("GET /api/outlets/{id}", "OUTLETS_READ"),
        Map.entry("POST /api/outlets", "OUTLETS_WRITE"),
        Map.entry("PUT /api/outlets/{id}", "OUTLETS_WRITE"),
        Map.entry("DELETE /api/outlets/{id}", "OUTLETS_DELETE"),
        Map.entry("GET /api/outlets/{id}/staff", "OUTLETS_READ"),
        Map.entry("POST /api/outlets/{id}/staff", "OUTLETS_WRITE"),
        Map.entry("GET /api/outlets/{id}/performance", "OUTLETS_READ"),

        // Product Service
        Map.entry("GET /api/products", "PRODUCTS_READ"),
        Map.entry("GET /api/products/{id}", "PRODUCTS_READ"),
        Map.entry("POST /api/products", "PRODUCTS_WRITE"),
        Map.entry("PUT /api/products/{id}", "PRODUCTS_WRITE"),
        Map.entry("DELETE /api/products/{id}", "PRODUCTS_DELETE"),
        Map.entry("GET /api/categories", "PRODUCTS_READ"),
        Map.entry("POST /api/categories", "PRODUCTS_WRITE"),
        Map.entry("PUT /api/categories/{id}", "PRODUCTS_WRITE"),
        Map.entry("DELETE /api/categories/{id}", "PRODUCTS_DELETE"),
        Map.entry("GET /api/stock-movements", "INVENTORY_READ"),
        Map.entry("POST /api/stock-movements", "INVENTORY_WRITE"),

        // POS Service
        Map.entry("GET /api/transactions", "TRANSACTIONS_READ"),
        Map.entry("GET /api/transactions/{id}", "TRANSACTIONS_READ"),
        Map.entry("POST /api/transactions", "TRANSACTIONS_WRITE"),
        Map.entry("PUT /api/transactions/{id}", "TRANSACTIONS_WRITE"),
        Map.entry("POST /api/transactions/{id}/cancel", "TRANSACTIONS_WRITE"),
        Map.entry("POST /api/transactions/{id}/void", "TRANSACTIONS_WRITE"),
        Map.entry("POST /api/transactions/{id}/refund", "TRANSACTIONS_WRITE"),
        Map.entry("GET /api/transactions/{id}/receipt", "TRANSACTIONS_READ"),
        Map.entry("GET /api/transactions/outlet/{outletId}", "TRANSACTIONS_READ"),
        Map.entry("GET /api/transactions/cashier/{cashierId}", "TRANSACTIONS_READ"),
        Map.entry("GET /api/transactions/customer/{customerId}", "TRANSACTIONS_READ"),
        Map.entry("GET /api/transactions/outlet/{outletId}/stats", "TRANSACTIONS_READ"),

        // Customer Management (POS Service)
        Map.entry("GET /api/customers", "CUSTOMERS_READ"),
        Map.entry("GET /api/customers/{id}", "CUSTOMERS_READ"),
        Map.entry("POST /api/customers", "CUSTOMERS_WRITE"),
        Map.entry("PUT /api/customers/{id}", "CUSTOMERS_WRITE"),
        Map.entry("DELETE /api/customers/{id}", "CUSTOMERS_DELETE"),

        // Expense Service
        Map.entry("GET /api/expenses", "EXPENSES_READ"),
        Map.entry("GET /api/expenses/{id}", "EXPENSES_READ"),
        Map.entry("POST /api/expenses", "EXPENSES_WRITE"),
        Map.entry("PUT /api/expenses/{id}", "EXPENSES_WRITE"),
        Map.entry("DELETE /api/expenses/{id}", "EXPENSES_DELETE"),
        Map.entry("GET /api/expenses/outlet/{outletId}", "EXPENSES_READ"),
        Map.entry("GET /api/expenses/category/{categoryId}", "EXPENSES_READ"),

        // Reports and Analytics
        Map.entry("GET /api/reports/sales", "REPORTS_READ"),
        Map.entry("GET /api/reports/inventory", "REPORTS_READ"),
        Map.entry("GET /api/reports/staff", "REPORTS_READ"),
        Map.entry("GET /api/reports/expenses", "REPORTS_READ"),
        Map.entry("POST /api/reports/generate", "REPORTS_WRITE"),
        Map.entry("GET /api/analytics/dashboard", "REPORTS_READ"),
        Map.entry("GET /api/analytics/forecast", "REPORTS_READ"),

        // Audit and System
        Map.entry("GET /api/audit/logs", "AUDIT_READ"),
        Map.entry("GET /api/audit/backups", "AUDIT_READ"),
        Map.entry("POST /api/audit/backups", "AUDIT_ADMIN"),
        Map.entry("GET /api/system/health", "SYSTEM_READ"),
        Map.entry("GET /api/system/config", "SYSTEM_READ"),
        Map.entry("PUT /api/system/config", "SYSTEM_WRITE")
    );

    /**
     * Check if a role has a specific permission
     */
    public static boolean hasPermission(String role, String permission) {
        Set<String> permissions = ROLE_PERMISSIONS.get(role);
        return permissions != null && permissions.contains(permission);
    }

    /**
     * Check if a role has permission for a specific API endpoint
     */
    public static boolean hasApiPermission(String role, String method, String path) {
        String apiKey = method + " " + path;
        String requiredPermission = API_PERMISSIONS.get(apiKey);
        
        if (requiredPermission == null) {
            // Default to READ permission if not explicitly defined
            requiredPermission = getDefaultPermission(path);
        }
        
        return hasPermission(role, requiredPermission);
    }

    /**
     * Get default permission based on path pattern
     */
    public static String getDefaultPermission(String path) {
        if (path.contains("/users") || path.contains("/auth")) {
            return "USERS_READ";
        } else if (path.contains("/outlets")) {
            return "OUTLETS_READ";
        } else if (path.contains("/products") || path.contains("/categories")) {
            return "PRODUCTS_READ";
        } else if (path.contains("/transactions")) {
            return "TRANSACTIONS_READ";
        } else if (path.contains("/customers")) {
            return "CUSTOMERS_READ";
        } else if (path.contains("/expenses")) {
            return "EXPENSES_READ";
        } else if (path.contains("/reports") || path.contains("/analytics")) {
            return "REPORTS_READ";
        } else if (path.contains("/audit")) {
            return "AUDIT_READ";
        } else if (path.contains("/system")) {
            return "SYSTEM_READ";
        }
        return "SYSTEM_READ"; // Default fallback
    }

    /**
     * Get all permissions for a role
     */
    public static Set<String> getRolePermissions(String role) {
        return ROLE_PERMISSIONS.getOrDefault(role, Set.of());
    }

    /**
     * Get all roles that have a specific permission
     */
    public static Set<String> getRolesWithPermission(String permission) {
        return ROLE_PERMISSIONS.entrySet().stream()
                .filter(entry -> entry.getValue().contains(permission))
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
    }

    /**
     * Validate if a permission exists
     */
    public static boolean isValidPermission(String permission) {
        return ROLE_PERMISSIONS.values().stream()
                .anyMatch(permissions -> permissions.contains(permission));
    }

    /**
     * Validate if a role exists
     */
    public static boolean isValidRole(String role) {
        return ROLE_PERMISSIONS.containsKey(role);
    }
} 