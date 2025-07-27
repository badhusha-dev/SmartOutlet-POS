package com.smartoutlet.pos.service;

import com.smartoutlet.pos.dto.POSDashboardDto;

public interface DashboardService {
    
    POSDashboardDto getLiveDashboard(Long outletId);
    
    POSDashboardDto getTodayStats(Long outletId);
    
    POSDashboardDto getStaffPerformance(Long outletId);
    
    POSDashboardDto getPopularItems(Long outletId);
    
    POSDashboardDto getRecentTransactions(Long outletId);
    
    POSDashboardDto getLowStockAlerts(Long outletId);
    
    POSDashboardDto getCashDrawerStatus(Long outletId);
} 