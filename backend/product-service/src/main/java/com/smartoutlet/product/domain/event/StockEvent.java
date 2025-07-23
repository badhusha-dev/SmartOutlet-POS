package com.smartoutlet.product.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockEvent {
    private String eventType;
    private Long productId;
    private String productName;
    private String sku;
    private String category;
    private Integer currentStock;
    private Integer previousStock;
    private Integer changeAmount;
    private String changeType; // INCREASE, DECREASE, SET
    private LocalDateTime timestamp;
    private String userId;
    private String username;
    private String reason;
} 