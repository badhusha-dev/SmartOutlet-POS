package com.smartoutlet.pos.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Transaction item information")
public class TransactionItemDto {
    
    @Schema(description = "Unique item identifier", example = "1")
    private Long id;
    
    @Schema(description = "Product ID", example = "1")
    private Long productId;
    
    @Schema(description = "Product name", example = "Premium Coffee Beans")
    private String productName;
    
    @Schema(description = "Product SKU", example = "COFFEE-001")
    private String productSku;
    
    @Schema(description = "Quantity purchased", example = "2")
    private Integer quantity;
    
    @Schema(description = "Unit price", example = "15.99")
    private BigDecimal unitPrice;
    
    @Schema(description = "Total price before discount", example = "31.98")
    private BigDecimal totalPrice;
    
    @Schema(description = "Discount amount", example = "3.20")
    private BigDecimal discountAmount;
    
    @Schema(description = "Tax amount", example = "2.30")
    private BigDecimal taxAmount;
    
    @Schema(description = "Final price after discount and tax", example = "31.08")
    private BigDecimal finalPrice;
    
    @Schema(description = "Item notes", example = "Extra hot, no sugar")
    private String notes;
    
    @Schema(description = "Item creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
} 