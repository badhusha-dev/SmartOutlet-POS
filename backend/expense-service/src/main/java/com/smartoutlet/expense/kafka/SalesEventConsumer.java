package com.smartoutlet.expense.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class SalesEventConsumer {
    @KafkaListener(topics = "sales-events", groupId = "expense-service-group")
    public void listen(ConsumerRecord<String, String> record) {
        // TODO: Implement aggregation logic in the future
        System.out.println("Received sales event: " + record.value());
    }
} 