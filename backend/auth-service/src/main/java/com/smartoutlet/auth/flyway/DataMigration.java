/*
 *
 *    Copyright (c) 2025 Badsha - All Rights Reserved
 *
 *    Unauthorized copying of this file, via any medium is strictly prohibited
 *    Proprietary and confidential
 *    Written by Badsha
 *
 */
package com.smartoutlet.auth.flyway;


import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.flywaydb.core.api.MigrationInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;

/**
 * @author Badsha
 */
public class DataMigration implements FlywayMigrationStrategy {

    private final Logger LOG = LoggerFactory.getLogger(this.getClass());

    @Override
    public void migrate(Flyway flyway) {
        flyway.repair();
        flyway.migrate();
        flyway.validate();
        this.prettyDisplay(flyway.info());
    }

    private void prettyDisplay(final MigrationInfoService migrationInfo) {
        LOG.debug("DataMigration Flyway - Pretty Display");
        MigrationInfo[] all = migrationInfo.all();
        if (all.length != 0) {
            for (MigrationInfo info : all) {
                LOG.info("Version: {} Description: {} Type: {} Installed By: {} Script Name: {} Status: {}", info.getVersion(), info.getDescription(), info.getType(), info.getInstalledBy(),
                        info.getScript(), info.getState());
            }
        }
    }

}
