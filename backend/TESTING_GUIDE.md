# SmartOutlet POS Testing Guide

## Overview

This guide covers the testing infrastructure, best practices, and procedures for maintaining and running tests in the SmartOutlet POS system.

## 🧪 Test Structure

### Test Types

1. **Unit Tests** - Test individual components in isolation
2. **Integration Tests** - Test service interactions and API endpoints
3. **Context Tests** - Verify Spring Boot application context loads correctly

### Test Organization

```
src/test/
├── java/
│   └── com/smartoutlet/
│       ├── {service}/
│       │   ├── application/service/     # Service layer tests
│       │   ├── api/controller/          # Controller tests
│       │   ├── infrastructure/          # Infrastructure tests
│       │   └── integration/             # Integration tests
│       └── {Service}ApplicationTests.java
└── resources/
    ├── application-test.yml             # Test configuration
    └── test-data/                       # Test data files
```

## 🛠️ Test Framework Stack

- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework  
- **Spring Boot Test** - Spring testing support
- **Testcontainers** - Integration testing with real databases
- **WebMvcTest** - Web layer testing
- **H2** - In-memory database for fast tests

## 🚀 Running Tests

### All Tests

```bash
# Run all tests in the project
mvn test

# Run tests with coverage
mvn test jacoco:report

# Run tests for specific service
cd backend/auth-service
mvn test
```

### Specific Test Categories

```bash
# Unit tests only
mvn test -Dgroups=unit

# Integration tests only  
mvn test -Dgroups=integration

# Exclude slow tests
mvn test -Dgroups="!slow"
```

### Individual Test Classes

```bash
# Run specific test class
mvn test -Dtest=UserServiceTest

# Run specific test method
mvn test -Dtest=UserServiceTest#shouldAuthenticateUserSuccessfully
```

## 📝 Test Configuration

### Application Configuration (`application-test.yml`)

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  profiles:
    active: test

logging:
  level:
    com.smartoutlet: DEBUG
    org.springframework.web: DEBUG
```

### Maven Configuration

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

## 📋 Writing Tests

### Unit Test Best Practices

```java
@ExtendWith(MockitoExtension.class)
@DisplayName("User Service Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    @DisplayName("Should authenticate user with valid credentials")
    void shouldAuthenticateUserWithValidCredentials() {
        // Given - Setup test data
        User user = createTestUser();
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        
        // When - Execute the method
        AuthResponse result = userService.authenticate(loginRequest);
        
        // Then - Verify results
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository).findByUsername("testuser");
    }
}
```

### Integration Test Pattern

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class AuthIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @Test
    @Transactional
    void shouldCompleteAuthenticationFlow() {
        // Given, When, Then
    }
}
```

### Controller Test Pattern

```java
@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private AuthService authService;
    
    @Test
    void shouldReturnSuccessfulLogin() throws Exception {
        // Given
        AuthResponse authResponse = new AuthResponse(/* ... */);
        when(authService.authenticate(any())).thenReturn(authResponse);
        
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
}
```

## 📊 Test Data Management

### Test Data Builders

```java
public class UserTestDataBuilder {
    
    public static User.UserBuilder defaultUser() {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .isActive(true)
                .isVerified(false)
                .createdAt(LocalDateTime.now());
    }
    
    public static User createActiveUser() {
        return defaultUser().build();
    }
    
    public static User createInactiveUser() {
        return defaultUser().isActive(false).build();
    }
}
```

### Test Database Setup

```sql
-- test-data/schema.sql
INSERT INTO roles (name, description) VALUES ('ADMIN', 'Administrator');
INSERT INTO roles (name, description) VALUES ('STAFF', 'Staff Member');

-- test-data/users.sql  
INSERT INTO users (username, email, password, first_name, last_name, is_active)
VALUES ('admin', 'admin@test.com', '$2a$10$encoded', 'Admin', 'User', true);
```

## 🔍 Test Coverage

### Generating Coverage Reports

```bash
# Run tests with coverage
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### Coverage Goals

- **Minimum Coverage**: 80%
- **Service Layer**: 90%
- **Controller Layer**: 85%
- **Repository Layer**: 75%

### Coverage Configuration

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <executions>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>CLASS</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.80</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## 🐛 Debugging Tests

### Common Issues

1. **Context Loading Failures**
   ```
   Solution: Check @SpringBootTest configuration and ensure test application class exists
   ```

2. **Mock Injection Issues**
   ```
   Solution: Verify @Mock, @MockBean, and @InjectMocks annotations are correctly used
   ```

3. **Database State Issues**
   ```
   Solution: Use @Transactional or @DirtiesContext for test isolation
   ```

### Debug Configuration

```yaml
# application-test.yml
logging:
  level:
    org.springframework.test: DEBUG
    org.springframework.transaction: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

## 🔄 Continuous Integration

### GitHub Actions Configuration

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
      - name: Run tests
        run: mvn test
      - name: Generate coverage report
        run: mvn jacoco:report
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## 📈 Performance Testing

### Load Testing with JMeter

```xml
<!-- performance-tests/auth-load-test.jmx -->
<TestPlan>
  <ThreadGroup>
    <HTTPSamplerProxy>
      <stringProp name="HTTPSampler.path">/api/auth/login</stringProp>
      <stringProp name="HTTPSampler.method">POST</stringProp>
    </HTTPSamplerProxy>
  </ThreadGroup>
</TestPlan>
```

### Performance Test Runner

```bash
# Run performance tests
mvn gatling:test

# Generate performance report
mvn gatling:test -Dgatling.simulationClass=AuthLoadTest
```

## 🛡️ Security Testing

### Security Test Examples

```java
@Test
@WithMockUser(roles = "ADMIN")
void shouldAllowAdminAccess() {
    // Test admin-only functionality
}

@Test
@WithAnonymousUser
void shouldDenyUnauthenticatedAccess() {
    // Test security restrictions
}
```

## 📚 Best Practices

### Test Naming

- Use descriptive test names: `shouldReturnUserWhenValidIdProvided`
- Follow Given-When-Then structure
- Group related tests in nested classes

### Test Organization

- One test class per production class
- Group tests by functionality
- Use `@DisplayName` for readable test descriptions

### Mock Usage

- Mock external dependencies only
- Use `@MockBean` for Spring context tests
- Verify important interactions with `verify()`

### Test Data

- Use builders for complex test objects
- Keep test data minimal and focused
- Use factories for common test scenarios

## 🔧 Maintenance

### Regular Tasks

1. **Review test coverage monthly**
2. **Update test dependencies quarterly**  
3. **Clean up unused test code**
4. **Review and update test data**

### Test Health Metrics

- **Test execution time** < 30 seconds per service
- **Flaky test rate** < 2%
- **Coverage trend** increasing or stable
- **Test maintenance effort** < 20% of development time

## 📞 Support

For testing questions or issues:

1. Check this guide first
2. Review existing test examples
3. Consult team testing standards
4. Reach out to the development team

---

*Last updated: [Current Date]*
*Version: 1.0*