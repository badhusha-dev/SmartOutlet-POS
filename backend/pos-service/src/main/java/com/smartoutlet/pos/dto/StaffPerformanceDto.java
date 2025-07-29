package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Schema(description = "Staff performance information for POS dashboard")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StaffPerformanceDto extends BaseDto {
    
    @Schema(description = "Staff member ID", example = "1")
    private Long staffId;
    
    @Schema(description = "Staff member name", example = "Jane Smith")
    private String staffName;
    
    @Schema(description = "Staff member role", example = "CASHIER")
    private String staffRole;
    
    @Schema(description = "Today's sales amount", example = "350.25")
    private Double todaySales;
    
    @Schema(description = "Today's transaction count", example = "12")
    private Integer todayTransactions;
    
    @Schema(description = "Today's average transaction value", example = "29.19")
    private Double todayAverageTransaction;
    
    @Schema(description = "Current status", example = "ACTIVE", allowableValues = {"ACTIVE", "BREAK", "OFFLINE"})
    private String currentStatus;
    
    @Schema(description = "Shift start time", example = "2024-01-20T08:00:00")
    private LocalDateTime shiftStartTime;
    
    @Schema(description = "Last transaction time", example = "2024-01-20T14:25:00")
    private LocalDateTime lastTransactionTime;
    
    @Schema(description = "Current cash drawer amount", example = "450.75")
    private Double cashDrawerAmount;
    
    @Schema(description = "Expected cash drawer amount", example = "450.75")
    private Double expectedCashAmount;
    
    @Schema(description = "Cash drawer variance", example = "0.00")
    private Double cashVariance;
    
    @Schema(description = "Customer satisfaction rating", example = "4.8")
    private Double satisfactionRating;
    
    @Schema(description = "Number of refunds processed today", example = "1")
    private Integer refundsProcessed;
} 