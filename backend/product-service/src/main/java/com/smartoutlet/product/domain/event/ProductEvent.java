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
public class ProductEvent {
    private String eventType;
    private Long productId;
    private String productName;
    private String sku;
    private String category;
    private Double price;
    private Integer stockQuantity;
    private Integer previousStock;
    private String action;
    private LocalDateTime timestamp;
    private String userId;
    private String username;
} 