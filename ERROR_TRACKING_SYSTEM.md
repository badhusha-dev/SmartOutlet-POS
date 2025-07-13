# Error Tracking System Documentation

## Overview
The Error Tracking System is implemented across all services (auth-service, product-service, outlet-service, expense-service) to automatically capture, store, and manage application errors with detailed context information.

## Features

### Core Features
- **Automatic Error Logging**: All exceptions are automatically captured and stored in the database
- **Duplicate Detection**: Similar errors (same message, action, and URL) are grouped together with occurrence counting
- **Context Preservation**: Full request context including headers, body, user info, and stack traces
- **Error Categorization**: Errors are categorized by type (VALIDATION_ERROR, DATABASE_ERROR, etc.)
- **Resolution Tracking**: Errors can be marked as resolved with notes
- **Comprehensive Analytics**: Statistics and reporting capabilities
- **File and Line Tracking**: Automatic extraction of file name and line number from stack traces

### New File and Line Tracking Features
- **File Name Extraction**: Automatically extracts the Java file name where the error occurred
- **Line Number Extraction**: Captures the exact line number where the error originated
- **File-based Queries**: Query errors by specific file names
- **Line-based Queries**: Query errors by specific line numbers
- **File Statistics**: Get error statistics grouped by file names
- **Precise Error Location**: Quickly identify problematic code locations

## Database Schema

### error_logs Table
```sql
CREATE TABLE error_logs (
    id BIGSERIAL PRIMARY KEY,
    error_message TEXT NOT NULL,
    error_type VARCHAR(100),
    action_performed VARCHAR(200),
    user_id BIGINT,
    username VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    stack_trace TEXT,
    request_url VARCHAR(500),
    request_method VARCHAR(10),
    request_body TEXT,
    response_status INTEGER,
    file_name VARCHAR(500),           -- NEW: File name where error occurred
    line_number INTEGER,              -- NEW: Line number where error occurred
    occurrence_count INTEGER DEFAULT 1,
    first_occurrence TIMESTAMP,
    last_occurrence TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Error Types Tracked

### Authentication Errors
- `USER_NOT_FOUND`: User lookup failures
- `USER_ALREADY_EXISTS`: Duplicate user registration
- `AUTHENTICATION_FAILED`: Login failures
- `AUTHENTICATION_ERROR`: General auth issues
- `INVALID_TOKEN`: JWT token validation failures

### Validation Errors
- `VALIDATION_ERROR`: Input validation failures
- `CONSTRAINT_VIOLATION`: Data constraint violations

### Database Errors
- `DATABASE_ERROR`: General database access issues
- `DATA_INTEGRITY_VIOLATION`: Data integrity constraint violations

### Business Logic Errors
- `PRODUCT_NOT_FOUND`: Product lookup failures
- `INSUFFICIENT_STOCK`: Stock availability issues
- `CATEGORY_NOT_FOUND`: Category lookup failures
- `OUTLET_NOT_FOUND`: Outlet lookup failures
- `EXPENSE_NOT_FOUND`: Expense lookup failures

## API Endpoints

### Error Log Management (Admin Only)

#### Basic Queries
```http
GET /api/error-logs/unresolved
GET /api/error-logs/type/{errorType}
GET /api/error-logs/action/{actionPerformed}
GET /api/error-logs/high-occurrence?threshold=5
GET /api/error-logs/recent?since=2024-01-01T00:00:00
GET /api/error-logs/date-range?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59
GET /api/error-logs/search?searchTerm=validation
```

#### NEW: File and Line Tracking Queries
```http
GET /api/error-logs/file/{fileName}
GET /api/error-logs/line/{lineNumber}
GET /api/error-logs/file/{fileName}/line/{lineNumber}
GET /api/error-logs/statistics/file
```

#### Statistics
```http
GET /api/error-logs/statistics/type
GET /api/error-logs/statistics/action
GET /api/error-logs/most-frequent?limit=10
```

#### Resolution
```http
PUT /api/error-logs/{errorId}/resolve?resolutionNotes=Fixed validation issue
```

## File and Line Tracking Usage

### Example: Query Errors by File
```bash
# Get all errors from UserService.java
curl -H "Authorization: Bearer <token>" \
     http://localhost:8081/api/error-logs/file/UserService.java
```

### Example: Query Errors by Line Number
```bash
# Get all errors from line 45
curl -H "Authorization: Bearer <token>" \
     http://localhost:8081/api/error-logs/line/45
```

### Example: Query Errors by File and Line
```bash
# Get errors from UserService.java at line 45
curl -H "Authorization: Bearer <token>" \
     http://localhost:8081/api/error-logs/file/UserService.java/line/45
```

### Example: Get File Statistics
```bash
# Get error statistics grouped by file
curl -H "Authorization: Bearer <token>" \
     http://localhost:8081/api/error-logs/statistics/file
```

Response:
```json
[
  ["UserService.java", 15, 45],
  ["ProductController.java", 8, 23],
  ["AuthController.java", 5, 12]
]
```

## Implementation Details

### Stack Trace Utility
Each service includes a `StackTraceUtil` class that:
- Extracts file names from stack traces using regex patterns
- Extracts line numbers from stack traces
- Handles edge cases and provides fallbacks
- Logs warnings for extraction failures

### Automatic Extraction
File name and line number are automatically extracted when:
- Any exception is caught by `GlobalExceptionHandler`
- The stack trace is processed by `ErrorLogService`
- The information is stored in the database

### Duplicate Detection Logic
Errors are considered duplicates if they have:
- Same error message
- Same action performed
- Same request URL

This ensures that errors from different URLs are tracked separately, even with the same message and action.

## Benefits of File and Line Tracking

1. **Precise Error Location**: Quickly identify exactly where errors occur in the codebase
2. **Code Quality Insights**: Identify problematic files or specific lines that need attention
3. **Debugging Efficiency**: Reduce time spent locating error sources
4. **Code Review Focus**: Prioritize files with high error rates for review
5. **Refactoring Guidance**: Identify code sections that may need refactoring

## Error Response Format

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input parameters",
  "path": "/api/users",
  "validationErrors": {
    "email": "must be a well-formed email address",
    "password": "must be at least 8 characters"
  }
}
```

## Security

- All error log endpoints require `ADMIN` role
- Sensitive information (passwords, tokens) is filtered from request bodies
- IP addresses and user agents are logged for security analysis
- Error logs are automatically cleaned up based on retention policies

## Monitoring and Alerts

### High Occurrence Alerts
Monitor errors with high occurrence counts:
```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8081/api/error-logs/high-occurrence?threshold=10
```

### File-based Monitoring
Monitor problematic files:
```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8081/api/error-logs/statistics/file
```

### Recent Error Tracking
Monitor recent errors:
```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:8081/api/error-logs/recent?since=2024-01-15T00:00:00"
```

## Database Migrations

Each service includes database migrations to add the error_logs table and the new file tracking columns:

- `V3__create_error_logs_table.sql` - Creates the initial error_logs table
- `V4__add_file_and_line_to_error_logs.sql` - Adds file_name and line_number columns (auth-service)
- `V3__add_file_and_line_to_error_logs.sql` - Adds file_name and line_number columns (other services)

## Service-Specific Ports

- **Auth Service**: 8081
- **Product Service**: 8082  
- **Outlet Service**: 8083
- **Expense Service**: 8084

## Getting Started

1. **Run Database Migrations**: Each service will automatically create the error_logs table on startup
2. **Access Error Logs**: Use the API endpoints with admin authentication
3. **Monitor Errors**: Set up monitoring for high-occurrence errors
4. **Resolve Issues**: Mark errors as resolved with appropriate notes

The error tracking system is now fully operational across all services with enhanced file and line number tracking capabilities for better debugging and code quality management. 