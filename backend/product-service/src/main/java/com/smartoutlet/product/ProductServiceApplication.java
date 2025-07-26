package com.smartoutlet.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableKafka
@EnableScheduling
@EnableTransactionManagement
@RestController
@ComponentScan(basePackages = "com.smartoutlet.product", 
               excludeFilters = @ComponentScan.Filter(type = org.springframework.context.annotation.FilterType.REGEX, 
                                                    pattern = ".*backup.*"))
@EntityScan("com.smartoutlet.product.entity")
@EnableJpaRepositories({"com.smartoutlet.product.repository", "com.smartoutlet.product.infrastructure.persistence"})
public class ProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }
    
    @GetMapping("/test")
    public String test() {
        return "Product Service is running!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}