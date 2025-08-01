package com.smartoutlet.common;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
class TestApplication {
    // Test application for common module tests
}

@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
class CommonModuleApplicationTests {

    @Test
    void contextLoads() {
        // This test ensures that the Spring context loads correctly
        // and all beans are properly configured
    }
}