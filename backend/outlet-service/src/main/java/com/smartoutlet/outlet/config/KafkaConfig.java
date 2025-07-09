package com.smartoutlet.outlet.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
    
    public static final String OUTLET_EVENTS_TOPIC = "outlet-events";
    public static final String STOCK_EVENTS_TOPIC = "stock-events";
    public static final String SALES_EVENTS_TOPIC = "sales-events";
    
    @Bean
    public NewTopic outletEventsTopic() {
        return TopicBuilder.name(OUTLET_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic stockEventsTopic() {
        return TopicBuilder.name(STOCK_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic salesEventsTopic() {
        return TopicBuilder.name(SALES_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}