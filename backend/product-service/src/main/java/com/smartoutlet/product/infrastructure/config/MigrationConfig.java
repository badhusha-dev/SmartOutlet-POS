package com.smartoutlet.product.infrastructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import javax.sql.DataSource;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class MigrationConfig {

    private final DataSource dataSource;

    @Bean
    @DependsOn("flyway")
    public FlywayMigrationInitializer flywayMigrationInitializer(Flyway flyway) {
        log.info("Initializing Flyway migration...");
        return new FlywayMigrationInitializer(flyway);
    }

    @Bean
    public DataCleanMigration dataCleanMigration() {
        log.info("Creating DataCleanMigration bean...");
        return new DataCleanMigration();
    }
} 