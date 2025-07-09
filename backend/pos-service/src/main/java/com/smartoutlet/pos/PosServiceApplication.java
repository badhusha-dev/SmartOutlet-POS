package com.smartoutlet.pos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableKafka
@EnableScheduling
@EnableTransactionManagement
public class PosServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PosServiceApplication.class, args);
    }
}