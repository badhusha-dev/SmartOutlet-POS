package com.smartoutlet.pos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.smartoutlet.pos.entity")
@EnableJpaRepositories("com.smartoutlet.pos.repository")
@ComponentScan(basePackages = {"com.smartoutlet.pos", "com.smartoutlet.common"})
public class POSServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(POSServiceApplication.class, args);
    }
} 