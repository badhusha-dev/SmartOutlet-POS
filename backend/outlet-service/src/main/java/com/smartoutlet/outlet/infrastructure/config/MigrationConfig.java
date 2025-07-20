package com.smartoutlet.outlet.infrastructure.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class MigrationConfig {

    @Bean
    @Profile("dev")
    public FlywayMigrationStrategy cleanMigrationStrategy() {
        return flyway -> {
            flyway.clean();
            flyway.migrate();
        };
    }

    @Bean
    @Profile("uat")
    public FlywayMigrationStrategy uatMigrationStrategy() {
        return new DataMigration();
    }

    @Bean
    @Profile("prod")
    public FlywayMigrationStrategy migrationStrategy() {
        return new DataMigration();
    }
} 