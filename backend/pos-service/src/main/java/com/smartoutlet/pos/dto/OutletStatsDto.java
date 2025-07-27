package com.smartoutlet.pos.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Outlet statistics information")
public class OutletStatsDto {
    
    @Schema(description = "Outlet ID", example = "1")
    private Long outletId;
    
    @Schema(description = "Total sales amount", example = "12500.75")
    private Double totalSales;
    
    @Schema(description = "Total number of transactions", example = "250")
    private Long transactionCount;
    
    @Schema(description = "Average transaction value", example = "50.00")
    private Double averageTransactionValue;
} 