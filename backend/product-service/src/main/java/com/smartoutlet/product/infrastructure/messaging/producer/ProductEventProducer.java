package com.smartoutlet.product.infrastructure.messaging.producer;

import com.smartoutlet.product.domain.event.ProductEvent;
import com.smartoutlet.product.domain.event.StockEvent;

public interface ProductEventProducer {
    
    void publishProductEvent(ProductEvent event);
    
    void publishStockEvent(StockEvent event);
    
    void publishProductCreated(ProductEvent event);
    
    void publishProductUpdated(ProductEvent event);
    
    void publishProductDeleted(ProductEvent event);
    
    void publishStockUpdated(StockEvent event);
    
    void publishLowStockAlert(StockEvent event);
    
    void publishOutOfStockAlert(StockEvent event);
} 