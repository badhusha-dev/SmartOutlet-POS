package com.smartoutlet.product.infrastructure.messaging.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartoutlet.product.domain.event.ProductEvent;
import com.smartoutlet.product.domain.event.StockEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductEventProducerImpl implements ProductEventProducer {
    
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    
    private static final String PRODUCT_EVENTS_TOPIC = "product-events";
    private static final String STOCK_EVENTS_TOPIC = "stock-events";
    
    @Override
    public void publishProductEvent(ProductEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(PRODUCT_EVENTS_TOPIC, event.getEventType(), message);
            log.info("Published product event: {} for product: {}", event.getEventType(), event.getProductId());
        } catch (JsonProcessingException e) {
            log.error("Error serializing product event: {}", e.getMessage(), e);
        }
    }
    
    @Override
    public void publishStockEvent(StockEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(STOCK_EVENTS_TOPIC, event.getEventType(), message);
            log.info("Published stock event: {} for product: {}", event.getEventType(), event.getProductId());
        } catch (JsonProcessingException e) {
            log.error("Error serializing stock event: {}", e.getMessage(), e);
        }
    }
    
    @Override
    public void publishProductCreated(ProductEvent event) {
        event.setEventType("PRODUCT_CREATED");
        publishProductEvent(event);
    }
    
    @Override
    public void publishProductUpdated(ProductEvent event) {
        event.setEventType("PRODUCT_UPDATED");
        publishProductEvent(event);
    }
    
    @Override
    public void publishProductDeleted(ProductEvent event) {
        event.setEventType("PRODUCT_DELETED");
        publishProductEvent(event);
    }
    
    @Override
    public void publishStockUpdated(StockEvent event) {
        event.setEventType("STOCK_UPDATED");
        publishStockEvent(event);
    }
    
    @Override
    public void publishLowStockAlert(StockEvent event) {
        event.setEventType("LOW_STOCK_ALERT");
        publishStockEvent(event);
    }
    
    @Override
    public void publishOutOfStockAlert(StockEvent event) {
        event.setEventType("OUT_OF_STOCK_ALERT");
        publishStockEvent(event);
    }
} 