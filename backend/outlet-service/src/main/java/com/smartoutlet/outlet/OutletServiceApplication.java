package com.smartoutlet.outlet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableKafka
@EnableTransactionManagement
@ComponentScan(basePackages = {"com.smartoutlet.outlet", "com.smartoutlet.common"})
public class OutletServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OutletServiceApplication.class, args);
    }
}