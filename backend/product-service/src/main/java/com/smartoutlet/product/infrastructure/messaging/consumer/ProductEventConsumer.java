package com.smartoutlet.product.infrastructure.messaging.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartoutlet.product.domain.event.ProductEvent;
import com.smartoutlet.product.domain.event.StockEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductEventConsumer {
    
    private final ObjectMapper objectMapper;
    
    @KafkaListener(
        topics = "product-events",
        groupId = "product-service-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleProductEvent(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {
        
        try {
            ProductEvent event = objectMapper.readValue(message, ProductEvent.class);
            log.info("Received product event: {} from topic: {}, partition: {}, offset: {}", 
                    event.getEventType(), topic, partition, offset);
            
            // Handle different event types
            switch (event.getEventType()) {
                case "PRODUCT_CREATED":
                    handleProductCreated(event);
                    break;
                case "PRODUCT_UPDATED":
                    handleProductUpdated(event);
                    break;
                case "PRODUCT_DELETED":
                    handleProductDeleted(event);
                    break;
                default:
                    log.warn("Unknown product event type: {}", event.getEventType());
            }
            
            acknowledgment.acknowledge();
            
        } catch (Exception e) {
            log.error("Error processing product event: {}", e.getMessage(), e);
            // In a real application, you might want to implement dead letter queue handling
        }
    }
    
    @KafkaListener(
        topics = "stock-events",
        groupId = "product-service-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleStockEvent(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment) {
        
        try {
            StockEvent event = objectMapper.readValue(message, StockEvent.class);
            log.info("Received stock event: {} from topic: {}, partition: {}, offset: {}", 
                    event.getEventType(), topic, partition, offset);
            
            // Handle different event types
            switch (event.getEventType()) {
                case "STOCK_UPDATED":
                    handleStockUpdated(event);
                    break;
                case "LOW_STOCK_ALERT":
                    handleLowStockAlert(event);
                    break;
                case "OUT_OF_STOCK_ALERT":
                    handleOutOfStockAlert(event);
                    break;
                default:
                    log.warn("Unknown stock event type: {}", event.getEventType());
            }
            
            acknowledgment.acknowledge();
            
        } catch (Exception e) {
            log.error("Error processing stock event: {}", e.getMessage(), e);
        }
    }
    
    private void handleProductCreated(ProductEvent event) {
        log.info("Handling product created event for product: {}", event.getProductId());
        // Implement business logic for product creation
    }
    
    private void handleProductUpdated(ProductEvent event) {
        log.info("Handling product updated event for product: {}", event.getProductId());
        // Implement business logic for product updates
    }
    
    private void handleProductDeleted(ProductEvent event) {
        log.info("Handling product deleted event for product: {}", event.getProductId());
        // Implement business logic for product deletion
    }
    
    private void handleStockUpdated(StockEvent event) {
        log.info("Handling stock updated event for product: {}", event.getProductId());
        // Implement business logic for stock updates
    }
    
    private void handleLowStockAlert(StockEvent event) {
        log.warn("Low stock alert for product: {} (SKU: {}), current stock: {}", 
                event.getProductId(), event.getSku(), event.getCurrentStock());
        // Implement business logic for low stock alerts
    }
    
    private void handleOutOfStockAlert(StockEvent event) {
        log.error("Out of stock alert for product: {} (SKU: {})", 
                event.getProductId(), event.getSku());
        // Implement business logic for out of stock alerts
    }
} 