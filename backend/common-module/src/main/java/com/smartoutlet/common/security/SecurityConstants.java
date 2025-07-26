package com.smartoutlet.common.security;

public class SecurityConstants {
    
    // JWT Constants
    public static final String JWT_SECRET = "smartoutletSecretKeyForJWTTokenGeneration";
    public static final long JWT_EXPIRATION = 86400000; // 24 hours
    public static final String JWT_PREFIX = "Bearer ";
    public static final String JWT_HEADER = "Authorization";
    
    // Role Constants
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_MANAGER = "MANAGER";
    public static final String ROLE_STAFF = "STAFF";
    public static final String ROLE_CASHIER = "CASHIER";
    
    // Permission Constants
    public static final String PERMISSION_READ = "READ";
    public static final String PERMISSION_WRITE = "WRITE";
    public static final String PERMISSION_DELETE = "DELETE";
    public static final String PERMISSION_ADMIN = "ADMIN";
    
    // Security Headers
    public static final String SECURITY_HEADER_X_FRAME_OPTIONS = "X-Frame-Options";
    public static final String SECURITY_HEADER_X_CONTENT_TYPE_OPTIONS = "X-Content-Type-Options";
    public static final String SECURITY_HEADER_X_XSS_PROTECTION = "X-XSS-Protection";
    public static final String SECURITY_HEADER_STRICT_TRANSPORT_SECURITY = "Strict-Transport-Security";
    
    // Rate Limiting
    public static final int RATE_LIMIT_REQUESTS_PER_MINUTE = 100;
    public static final int RATE_LIMIT_BURST_CAPACITY = 200;
    
    // Session Management
    public static final int SESSION_TIMEOUT_SECONDS = 3600; // 1 hour
    public static final boolean SESSION_FIXATION_PROTECTION = true;
    public static final boolean SESSION_CONCURRENT_CONTROL = true;
    
    // Password Policy
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final boolean REQUIRE_UPPERCASE = true;
    public static final boolean REQUIRE_LOWERCASE = true;
    public static final boolean REQUIRE_DIGITS = true;
    public static final boolean REQUIRE_SPECIAL_CHARS = true;
    
    // CORS Configuration
    public static final String[] ALLOWED_ORIGINS = {
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:5173"
    };
    
    public static final String[] ALLOWED_METHODS = {
        "GET", "POST", "PUT", "DELETE", "OPTIONS"
    };
    
    public static final String[] ALLOWED_HEADERS = {
        "Authorization", "Content-Type", "X-Requested-With", "Accept"
    };
} 