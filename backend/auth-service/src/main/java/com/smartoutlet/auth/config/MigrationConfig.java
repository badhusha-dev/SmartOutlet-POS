/*
 *
 *    Copyright (c) 2025 Badsha - All Rights Reserved
 *
 *    Unauthorized copying of this file, via any medium is strictly prohibited
 *    Proprietary and confidential
 *    Written by Badsha
 *
 */
package com.smartoutlet.auth.config;

import com.smartoutlet.auth.flyway.DataCleanMigration;
import com.smartoutlet.auth.flyway.DataMigration;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * @author Badsha
 */
@Configuration
public class MigrationConfig {

    @Bean
    @Profile("dev")
    public FlywayMigrationStrategy cleanMigrationStrategy() {
        return new DataCleanMigration();
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
