package com.smartoutlet.expense.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDate;

@Component
public class SalesEventConsumer {
    private static final Map<String, Double> salesAggregation = new ConcurrentHashMap<>();
    private static final ObjectMapper objectMapper = new ObjectMapper();
    @KafkaListener(topics = "sales-events", groupId = "expense-service-group")
    public void listen(ConsumerRecord<String, String> record) {
        try {
            JsonNode event = objectMapper.readTree(record.value());
            Long outletId = event.has("outletId") ? event.get("outletId").asLong() : null;
            double amount = event.has("amount") ? event.get("amount").asDouble() : 0.0;
            LocalDate date = LocalDate.now();
            if (outletId != null) {
                String key = outletId + ":" + date;
                salesAggregation.merge(key, amount, Double::sum);
                System.out.println("Aggregated sales for outlet " + outletId + " on " + date + ": " + salesAggregation.get(key));
            } else {
                System.out.println("Received sales event with missing outletId: " + record.value());
            }
        } catch (Exception e) {
            System.out.println("Failed to aggregate sales event: " + e.getMessage());
        }
    }
} 