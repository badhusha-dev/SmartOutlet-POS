# 🔐 SmartOutlet POS Security Guide

## Overview

This document outlines the comprehensive security implementation across all SmartOutlet POS microservices. The system implements a multi-layered security approach with JWT authentication, role-based access control, and various security best practices.

## 🏗️ Security Architecture

### 1. **API Gateway Security**
- **Entry Point**: All client requests go through the API Gateway (port 8080)
- **JWT Token Relay**: Automatically forwards JWT tokens to downstream services
- **CORS Management**: Handles cross-origin requests
- **Rate Limiting**: Protects against excessive requests
- **Request Logging**: Comprehensive request/response logging

### 2. **Authentication Service**
- **JWT Token Generation**: Creates secure JWT tokens with user roles
- **Password Encryption**: BCrypt password hashing
- **User Management**: User registration, login, and profile management
- **Role-Based Access Control**: ADMIN, MANAGER, STAFF, CASHIER roles

### 3. **Microservices Security**
- **JWT Validation**: Each service validates JWT tokens independently
- **Stateless Authentication**: No session storage required
- **Endpoint Protection**: All business endpoints require authentication
- **CORS Configuration**: Consistent cross-origin handling

## 🔧 Security Components

### JWT Utilities (`common-module`)
```java
// JWT Token Generation
JwtUtils jwtUtils = new JwtUtils();
String token = jwtUtils.generateToken(username, role, userId);

// JWT Token Validation
boolean isValid = jwtUtils.validateToken(token);
String role = jwtUtils.extractRole(token);
Long userId = jwtUtils.extractUserId(token);
```

### JWT Authentication Filter
```java
// Automatically validates JWT tokens in requests
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Validates JWT tokens and sets authentication context
}
```

### Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Configures security for each service
    // Requires authentication for all business endpoints
    // Permits access to health checks and documentation
}
```

## 🛡️ Security Features

### 1. **JWT Token Security**
- **Secret Key**: Configurable JWT secret key
- **Expiration**: 24-hour token expiration
- **Claims**: User ID, username, and role information
- **Validation**: Automatic token validation on all requests

### 2. **Role-Based Access Control**
- **ADMIN**: Full system access
- **MANAGER**: Outlet and staff management
- **STAFF**: Basic operations
- **CASHIER**: Sales and inventory operations

### 3. **CORS Configuration**
```properties
app.security.cors.allowed-origins=http://localhost:3000,http://localhost:8080
app.security.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
app.security.cors.allowed-headers=*
app.security.cors.allow-credentials=true
```

### 4. **Security Headers**
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **Strict-Transport-Security**: 1 year max-age (enforces HTTPS)

### 5. **Rate Limiting**
- **Requests per minute**: 100 requests per IP
- **Burst capacity**: 200 requests
- **Protection**: Against DDoS and abuse

## 🔑 Authentication Flow

### 1. **User Login**
```bash
POST /auth/login
{
  "username": "user@example.com",
  "password": "password123"
}
```

### 2. **JWT Token Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "user@example.com",
  "roles": ["MANAGER"],
  "expiresAt": "2024-01-27T10:00:00"
}
```

### 3. **API Requests**
```bash
GET /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Service Endpoints

### Public Endpoints (No Authentication Required)
- `/auth/**` - Authentication endpoints
- `/swagger-ui/**` - API documentation
- `/v3/api-docs/**` - OpenAPI specification
- `/actuator/**` - Health checks and monitoring

### Protected Endpoints (Authentication Required)
- `/api/products/**` - Product management
- `/api/outlets/**` - Outlet management
- `/api/expenses/**` - Expense management
- `/api/sales/**` - Sales operations

## 🔧 Configuration

### JWT Configuration
```properties
# JWT Secret Key (change in production)
app.jwt.secret=smartoutletSecretKeyForJWTTokenGeneration

# Token Expiration (24 hours)
app.jwt.expiration=86400000

# Refresh Token Expiration (7 days)
app.jwt.refresh-expiration=604800000
```

### Security Configuration
```properties
# CORS Settings
app.security.cors.allowed-origins=http://localhost:3000,http://localhost:8080
app.security.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
app.security.cors.allowed-headers=*
app.security.cors.allow-credentials=true

# Rate Limiting
app.security.rate-limit.requests-per-minute=100
app.security.rate-limit.burst-capacity=200
```

## 🛠️ Development Setup

### 1. **Start All Services**
```bash
cd backend
./restart-all-services.sh
```

### 2. **Test Authentication**
```bash
# Login to get JWT token
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin@smartoutlet.com", "password": "admin123"}'

# Use token for API requests
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. **Health Checks**
```bash
# API Gateway Health
curl http://localhost:8080/actuator/health

# Auth Service Health
curl http://localhost:8081/actuator/health

# Product Service Health
curl http://localhost:8082/actuator/health
```

## 🔒 Production Security Checklist

### 1. **Environment Variables**
- [ ] Set strong JWT secret key
- [ ] Configure database passwords
- [ ] Set Redis passwords
- [ ] Configure HTTPS certificates

### 2. **Network Security**
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Use VPN for database access
- [ ] Implement network segmentation

### 3. **Application Security**
- [ ] Enable security headers
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Enable audit logging

### 4. **Database Security**
- [ ] Use strong passwords
- [ ] Enable SSL connections
- [ ] Regular security updates
- [ ] Backup encryption

## 🚨 Security Best Practices

### 1. **Token Management**
- Store JWT tokens securely (HttpOnly cookies for web apps)
- Implement token refresh mechanism
- Log out users on token expiration
- Rotate JWT secrets regularly

### 2. **Password Security**
- Enforce strong password policies
- Implement password reset functionality
- Use BCrypt for password hashing
- Enable account lockout after failed attempts

### 3. **API Security**
- Validate all input data
- Implement proper error handling
- Use HTTPS for all communications
- Monitor for suspicious activities

### 4. **Monitoring and Logging**
- Log all authentication attempts
- Monitor failed login attempts
- Track API usage patterns
- Set up security alerts

## 🔍 Troubleshooting

### Common Issues

#### 1. **JWT Token Expired**
```json
{
  "error": "JWT token expired",
  "status": 401
}
```
**Solution**: Implement token refresh mechanism

#### 2. **Invalid JWT Token**
```json
{
  "error": "Invalid JWT token",
  "status": 401
}
```
**Solution**: Check token format and signature

#### 3. **Access Denied**
```json
{
  "error": "Access denied",
  "status": 403
}
```
**Solution**: Check user roles and permissions

#### 4. **CORS Issues**
```json
{
  "error": "CORS policy violation",
  "status": 403
}
```
**Solution**: Update CORS configuration

## 📞 Support

For security-related issues or questions:
1. Check the service logs in `backend/logs/`
2. Review the security configuration
3. Test with the provided examples
4. Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0.0 