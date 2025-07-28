package com.smartoutlet.pos.controller;

import com.smartoutlet.common.dto.ApiResponseDTO;
import com.smartoutlet.common.security.annotations.RequirePermission;
import com.smartoutlet.pos.dto.POSDashboardDto;
import com.smartoutlet.pos.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dashboard", description = "Dashboard management endpoints")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/live/{outletId}")
    @Operation(summary = "Get live dashboard data", description = "Retrieve real-time dashboard data for an outlet")
    @RequirePermission("dashboard:read")
    public ResponseEntity<ApiResponseDTO<POSDashboardDto>> getLiveDashboard(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching live dashboard for outlet: {}", outletId);
        POSDashboardDto dashboard = dashboardService.getLiveDashboard(outletId);
        return ResponseEntity.ok(ApiResponseDTO.success("Live dashboard retrieved successfully", dashboard));
    }

    @GetMapping("/today/{outletId}")
    @Operation(summary = "Get today's statistics", description = "Retrieve today's sales and transaction statistics")
    @RequirePermission("dashboard:read")
    public ResponseEntity<ApiResponseDTO<POSDashboardDto>> getTodayStats(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching today's stats for outlet: {}", outletId);
        POSDashboardDto stats = dashboardService.getTodayStats(outletId);
        return ResponseEntity.ok(ApiResponseDTO.success("Today's statistics retrieved successfully", stats));
    }

    @GetMapping("/performance/{outletId}")
    @Operation(summary = "Get staff performance", description = "Retrieve staff performance metrics")
    @RequirePermission("dashboard:read")
    public ResponseEntity<ApiResponseDTO<POSDashboardDto>> getStaffPerformance(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching staff performance for outlet: {}", outletId);
        POSDashboardDto performance = dashboardService.getStaffPerformance(outletId);
        return ResponseEntity.ok(ApiResponseDTO.success("Staff performance retrieved successfully", performance));
    }

    @GetMapping("/popular-items/{outletId}")
    @Operation(summary = "Get popular items", description = "Retrieve most popular items sold")
    @RequirePermission("dashboard:read")
    public ResponseEntity<ApiResponseDTO<POSDashboardDto>> getPopularItems(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching popular items for outlet: {}", outletId);
        POSDashboardDto items = dashboardService.getPopularItems(outletId);
        return ResponseEntity.ok(ApiResponseDTO.success("Popular items retrieved successfully", items));
    }

    @GetMapping("/recent-transactions/{outletId}")
    @Operation(summary = "Get recent transactions", description = "Retrieve recent transaction history")
    @RequirePermission("dashboard:read")
    public ResponseEntity<ApiResponseDTO<POSDashboardDto>> getRecentTransactions(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching recent transactions for outlet: {}", outletId);
        POSDashboardDto transactions = dashboardService.getRecentTransactions(outletId);
        return ResponseEntity.ok(ApiResponseDTO.success("Recent transactions retrieved successfully", transactions));
    }

    @GetMapping("/low-stock/{outletId}")
    @Operation(summary = "Get low stock alerts", description = "Retrieve low stock alerts for inventory management")
    @RequirePermission("dashboard:read")
    public ResponseEntity<ApiResponseDTO<POSDashboardDto>> getLowStockAlerts(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching low stock alerts for outlet: {}", outletId);
        POSDashboardDto alerts = dashboardService.getLowStockAlerts(outletId);
        return ResponseEntity.ok(ApiResponseDTO.success("Low stock alerts retrieved successfully", alerts));
    }

    @GetMapping("/cash-drawer/{outletId}")
    @Operation(summary = "Get cash drawer status", description = "Retrieve cash drawer status and balance")
    @RequirePermission("dashboard:read")
    public ResponseEntity<ApiResponseDTO<POSDashboardDto>> getCashDrawerStatus(
            @Parameter(description = "Outlet ID", example = "1")
            @PathVariable Long outletId) {
        log.info("Fetching cash drawer status for outlet: {}", outletId);
        POSDashboardDto status = dashboardService.getCashDrawerStatus(outletId);
        return ResponseEntity.ok(ApiResponseDTO.success("Cash drawer status retrieved successfully", status));
    }
}