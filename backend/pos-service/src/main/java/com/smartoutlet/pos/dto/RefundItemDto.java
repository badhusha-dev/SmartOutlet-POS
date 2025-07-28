package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Schema(description = "Individual item information for refunds")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RefundItemDto extends BaseDto {
    
    @Schema(description = "Original transaction item ID", example = "789")
    private Long originalItemId;
    
    @Schema(description = "Product ID", example = "101")
    private Long productId;
    
    @Schema(description = "Product name", example = "Coffee Mug")
    private String productName;
    
    @Schema(description = "Quantity being refunded", example = "2")
    private Integer quantity;
    
    @Schema(description = "Unit price", example = "12.99")
    private Double unitPrice;
    
    @Schema(description = "Total refund amount for this item", example = "25.98")
    private Double refundAmount;
    
    @Schema(description = "Reason for refunding this specific item", example = "Item was damaged")
    private String reason;
    
    @Schema(description = "Whether item is being returned", example = "true")
    private Boolean isReturned;
} 