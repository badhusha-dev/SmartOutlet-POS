/*
 *
 *    Copyright (c) 2025 Badsha - All Rights Reserved
 *
 *    Unauthorized copying of this file, via any medium is strictly prohibited
 *    Proprietary and confidential
 *    Written by Badsha
 *
 */
package com.smartoutlet.product.infrastructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("dev")
public class DataCleanMigration implements FlywayMigrationStrategy {

    @Override
    public void migrate(Flyway flyway) {
        log.info("Cleaning and migrating database...");
        flyway.clean();
        flyway.migrate();
        log.info("Database migration completed successfully");
    }
} 