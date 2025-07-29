# Common Module

## Overview

The Common Module is a shared library that provides reusable components, utilities, and configurations across all SmartOutlet POS microservices. It contains common DTOs, exceptions, utilities, and configurations to ensure consistency and reduce code duplication.

## Features

- 📦 **Shared DTOs** - Common data transfer objects used across services
- ⚠️ **Exception Handling** - Standardized exception classes and error responses
- 🛠️ **Utility Classes** - Common utility functions and helpers
- 🔧 **Configuration** - Shared configuration classes and constants
- 📊 **Response Models** - Standardized API response formats
- 🔐 **Security Utils** - Common security-related utilities
- 📝 **Validation** - Shared validation annotations and logic

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Validation**: Jakarta Validation
- **Build Tool**: Maven

## Module Structure

```
src/main/java/com/smartoutlet/common/
├── dto/              # Data Transfer Objects
├── exception/        # Custom exceptions
├── util/            # Utility classes
├── config/          # Configuration classes
├── response/        # Response models
├── security/        # Security utilities
└── validation/      # Validation components
```

## Dependencies

This module is included as a dependency in all microservices:

```xml
<dependency>
    <groupId>com.smartoutlet</groupId>
    <artifactId>common-module</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Components

### 1. Data Transfer Objects (DTOs)

Common DTOs used across services:

#### Base DTOs
```java
public class BaseDto {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
```

#### User DTOs
```java
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private boolean active;
}
```

#### Outlet DTOs
```java
public class OutletDto {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String phone;
    private String email;
    private String manager;
    private String status;
}
```

#### Product DTOs
```java
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal price;
    private BigDecimal costPrice;
    private Integer stock;
    private String category;
    private String status;
}
```

### 2. Exception Handling

Standardized exception classes:

#### Base Exception
```java
public class SmartOutletException extends RuntimeException {
    private String errorCode;
    private HttpStatus status;
    
    public SmartOutletException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }
}
```

#### Specific Exceptions
```java
public class ResourceNotFoundException extends SmartOutletException {
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s with id %d not found", resource, id), 
              "RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND);
    }
}

public class ValidationException extends SmartOutletException {
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST);
    }
}

public class UnauthorizedException extends SmartOutletException {
    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
}
```

### 3. Response Models

Standardized API response formats:

#### Success Response
```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, LocalDateTime.now());
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }
}
```

#### Error Response
```java
public class ErrorResponse {
    private String errorCode;
    private String message;
    private String details;
    private LocalDateTime timestamp;
    private String path;
}
```

#### Paginated Response
```java
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;
}
```

### 4. Utility Classes

Common utility functions:

#### Date Utils
```java
public class DateUtils {
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
    
    public static LocalDateTime parseDateTime(String dateTime) {
        return LocalDateTime.parse(dateTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
```

#### String Utils
```java
public class StringUtils {
    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    public static String capitalize(String str) {
        if (isEmpty(str)) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}
```

#### Validation Utils
```java
public class ValidationUtils {
    public static void validateEmail(String email) {
        if (!Pattern.matches("^[A-Za-z0-9+_.-]+@(.+)$", email)) {
            throw new ValidationException("Invalid email format");
        }
    }
    
    public static void validatePhone(String phone) {
        if (!Pattern.matches("^\\+?[1-9]\\d{1,14}$", phone)) {
            throw new ValidationException("Invalid phone number format");
        }
    }
}
```

### 5. Configuration Classes

Shared configuration components:

#### Constants
```java
public class Constants {
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    
    // Status
    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_INACTIVE = "INACTIVE";
    
    // Roles
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_MANAGER = "MANAGER";
    public static final String ROLE_STAFF = "STAFF";
}
```

#### Security Config
```java
public class SecurityConstants {
    public static final String JWT_SECRET = "your-secret-key";
    public static final long JWT_EXPIRATION = 86400000; // 24 hours
    public static final String JWT_PREFIX = "Bearer ";
    public static final String JWT_HEADER = "Authorization";
}
```

## Usage Examples

### 1. Using DTOs in Controllers

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    public ApiResponse<UserDto> getUser(@PathVariable Long id) {
        UserDto user = userService.getUser(id);
        return ApiResponse.success(user);
    }
    
    @PostMapping
    public ApiResponse<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        UserDto created = userService.createUser(userDto);
        return ApiResponse.success("User created successfully", created);
    }
}
```

### 2. Exception Handling

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            null,
            LocalDateTime.now(),
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, ex.getStatus());
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        ErrorResponse error = new ErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            null,
            LocalDateTime.now(),
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, ex.getStatus());
    }
}
```

### 3. Using Utilities

```java
@Service
public class UserService {
    
    public UserDto createUser(UserDto userDto) {
        // Validate email
        ValidationUtils.validateEmail(userDto.getEmail());
        
        // Validate phone
        if (!StringUtils.isEmpty(userDto.getPhone())) {
            ValidationUtils.validatePhone(userDto.getPhone());
        }
        
        // Create user logic...
        return userDto;
    }
}
```

## Building the Module

```bash
# Build the module
mvn clean install

# Install to local repository
mvn install:install-file -Dfile=target/common-module-1.0.0.jar \
  -DgroupId=com.smartoutlet \
  -DartifactId=common-module \
  -Dversion=1.0.0 \
  -Dpackaging=jar
```

## Version Management

When updating the common module:

1. **Increment version** in `pom.xml`
2. **Update all services** to use the new version
3. **Test compatibility** across all services
4. **Document changes** in release notes

## Best Practices

### 1. Adding New Components

- Follow existing naming conventions
- Add proper documentation
- Include unit tests
- Update this README

### 2. Breaking Changes

- Avoid breaking changes when possible
- Use semantic versioning
- Provide migration guides
- Maintain backward compatibility

### 3. Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## Contributing

1. Follow the existing code style
2. Add tests for new components
3. Update documentation
4. Ensure backward compatibility

## License

This project is part of the SmartOutlet POS system. 