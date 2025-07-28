package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Schema(description = "Discount and promotion information for POS transactions")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DiscountDto extends BaseDto {
    
    @Schema(description = "Discount code", example = "SAVE20")
    private String discountCode;
    
    @Schema(description = "Discount name", example = "20% Off All Items")
    private String discountName;
    
    @Schema(description = "Discount type", example = "PERCENTAGE", allowableValues = {"PERCENTAGE", "FIXED_AMOUNT", "BUY_ONE_GET_ONE", "FREE_SHIPPING"})
    private String discountType;
    
    @Schema(description = "Discount value (percentage or fixed amount)", example = "20.0")
    private Double discountValue;
    
    @Schema(description = "Minimum purchase amount required", example = "50.0")
    private Double minimumPurchase;
    
    @Schema(description = "Maximum discount amount", example = "25.0")
    private Double maximumDiscount;
    
    @Schema(description = "Whether discount is active", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Start date for discount validity", example = "2024-01-01T00:00:00")
    private LocalDateTime validFrom;
    
    @Schema(description = "End date for discount validity", example = "2024-12-31T23:59:59")
    private LocalDateTime validTo;
    
    @Schema(description = "Maximum number of uses", example = "1000")
    private Integer maxUses;
    
    @Schema(description = "Current number of uses", example = "150")
    private Integer currentUses;
    
    @Schema(description = "Whether discount applies to all products", example = "true")
    private Boolean appliesToAllProducts;
    
    @Schema(description = "Comma-separated list of applicable product IDs", example = "1,2,3,4")
    private String applicableProductIds;
    
    @Schema(description = "Comma-separated list of applicable category IDs", example = "1,2")
    private String applicableCategoryIds;
    
    @Schema(description = "Description of the discount", example = "Get 20% off on all coffee products")
    private String description;
} 