package com.smartoutlet.pos.dto;

import com.smartoutlet.common.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Live POS dashboard information")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class POSDashboardDto extends BaseDto {
    
    @Schema(description = "Outlet ID", example = "1")
    private Long outletId;
    
    @Schema(description = "Outlet name", example = "Downtown Store")
    private String outletName;
    
    @Schema(description = "Current date and time", example = "2024-01-20T14:30:00")
    private LocalDateTime currentDateTime;
    
    @Schema(description = "Today's total sales", example = "1250.75")
    private Double todaySales;
    
    @Schema(description = "Today's transaction count", example = "45")
    private Integer todayTransactions;
    
    @Schema(description = "Today's average transaction value", example = "27.79")
    private Double todayAverageTransaction;
    
    @Schema(description = "Current queue size", example = "3")
    private Integer currentQueueSize;
    
    @Schema(description = "Active staff members")
    private List<StaffPerformanceDto> activeStaff;
    
    @Schema(description = "Popular items today")
    private List<PopularItemDto> popularItems;
    
    @Schema(description = "Recent transactions")
    private List<RecentTransactionDto> recentTransactions;
    
    @Schema(description = "Low stock alerts")
    private List<LowStockAlertDto> lowStockAlerts;
    
    @Schema(description = "Today's top performing staff member", example = "Jane Smith")
    private String topPerformer;
    
    @Schema(description = "Top performer's sales today", example = "350.25")
    private Double topPerformerSales;
    
    @Schema(description = "Current shift status", example = "ACTIVE", allowableValues = {"ACTIVE", "BREAK", "CLOSED"})
    private String shiftStatus;
    
    @Schema(description = "Shift start time", example = "2024-01-20T08:00:00")
    private LocalDateTime shiftStartTime;
    
    @Schema(description = "Current cash drawer amount", example = "1250.50")
    private Double cashDrawerAmount;
    
    @Schema(description = "Expected cash drawer amount", example = "1250.50")
    private Double expectedCashAmount;
    
    @Schema(description = "Cash drawer variance", example = "0.00")
    private Double cashVariance;
} 