package com.smartoutlet.pos.service.impl;

import com.smartoutlet.pos.dto.*;
import com.smartoutlet.pos.entity.Transaction;
import com.smartoutlet.pos.repository.TransactionRepository;
import com.smartoutlet.pos.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {
    
    private final TransactionRepository transactionRepository;
    
    @Override
    public POSDashboardDto getLiveDashboard(Long outletId) {
        LocalDateTime today = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime now = LocalDateTime.now();
        
        // Get today's transactions
        List<Transaction> todayTransactions = transactionRepository.findByOutletIdAndTransactionDateBetween(
                outletId, today, now);
        
        // Calculate statistics
        Double todaySales = todayTransactions.stream()
                .mapToDouble(Transaction::getTotalAmount)
                .sum();
        
        Integer todayTransactionCount = todayTransactions.size();
        Double todayAverageTransaction = todayTransactionCount > 0 ? todaySales / todayTransactionCount : 0.0;
        
        // Mock data for demonstration
        List<StaffPerformanceDto> activeStaff = getMockStaffPerformance();
        List<PopularItemDto> popularItems = getMockPopularItems();
        List<RecentTransactionDto> recentTransactions = getMockRecentTransactions();
        List<LowStockAlertDto> lowStockAlerts = getMockLowStockAlerts();
        
        return POSDashboardDto.builder()
                .outletId(outletId)
                .outletName("Downtown Store")
                .currentDateTime(now)
                .todaySales(todaySales)
                .todayTransactions(todayTransactionCount)
                .todayAverageTransaction(todayAverageTransaction)
                .currentQueueSize(3) // Mock queue size
                .activeStaff(activeStaff)
                .popularItems(popularItems)
                .recentTransactions(recentTransactions)
                .lowStockAlerts(lowStockAlerts)
                .topPerformer("Jane Smith")
                .topPerformerSales(350.25)
                .shiftStatus("ACTIVE")
                .shiftStartTime(LocalDateTime.now().with(LocalTime.of(8, 0)))
                .cashDrawerAmount(1250.50)
                .expectedCashAmount(1250.50)
                .cashVariance(0.00)
                .build();
    }
    
    @Override
    public POSDashboardDto getTodayStats(Long outletId) {
        return getLiveDashboard(outletId);
    }
    
    @Override
    public POSDashboardDto getStaffPerformance(Long outletId) {
        POSDashboardDto dashboard = getLiveDashboard(outletId);
        dashboard.setActiveStaff(getMockStaffPerformance());
        return dashboard;
    }
    
    @Override
    public POSDashboardDto getPopularItems(Long outletId) {
        POSDashboardDto dashboard = getLiveDashboard(outletId);
        dashboard.setPopularItems(getMockPopularItems());
        return dashboard;
    }
    
    @Override
    public POSDashboardDto getRecentTransactions(Long outletId) {
        POSDashboardDto dashboard = getLiveDashboard(outletId);
        dashboard.setRecentTransactions(getMockRecentTransactions());
        return dashboard;
    }
    
    @Override
    public POSDashboardDto getLowStockAlerts(Long outletId) {
        POSDashboardDto dashboard = getLiveDashboard(outletId);
        dashboard.setLowStockAlerts(getMockLowStockAlerts());
        return dashboard;
    }
    
    @Override
    public POSDashboardDto getCashDrawerStatus(Long outletId) {
        POSDashboardDto dashboard = getLiveDashboard(outletId);
        dashboard.setCashDrawerAmount(1250.50);
        dashboard.setExpectedCashAmount(1250.50);
        dashboard.setCashVariance(0.00);
        return dashboard;
    }
    
    private List<StaffPerformanceDto> getMockStaffPerformance() {
        List<StaffPerformanceDto> staff = new ArrayList<>();
        
        staff.add(StaffPerformanceDto.builder()
                .staffId(1L)
                .staffName("Jane Smith")
                .staffRole("CASHIER")
                .todaySales(350.25)
                .todayTransactions(12)
                .todayAverageTransaction(29.19)
                .currentStatus("ACTIVE")
                .shiftStartTime(LocalDateTime.now().with(LocalTime.of(8, 0)))
                .lastTransactionTime(LocalDateTime.now().minusMinutes(5))
                .cashDrawerAmount(450.75)
                .expectedCashAmount(450.75)
                .cashVariance(0.00)
                .satisfactionRating(4.8)
                .refundsProcessed(1)
                .build());
        
        staff.add(StaffPerformanceDto.builder()
                .staffId(2L)
                .staffName("John Doe")
                .staffRole("CASHIER")
                .todaySales(280.50)
                .todayTransactions(8)
                .todayAverageTransaction(35.06)
                .currentStatus("BREAK")
                .shiftStartTime(LocalDateTime.now().with(LocalTime.of(8, 0)))
                .lastTransactionTime(LocalDateTime.now().minusMinutes(15))
                .cashDrawerAmount(320.25)
                .expectedCashAmount(320.25)
                .cashVariance(0.00)
                .satisfactionRating(4.6)
                .refundsProcessed(0)
                .build());
        
        return staff;
    }
    
    private List<PopularItemDto> getMockPopularItems() {
        List<PopularItemDto> items = new ArrayList<>();
        
        items.add(PopularItemDto.builder()
                .productId(101L)
                .productName("Coffee Mug")
                .category("Kitchenware")
                .quantitySold(25)
                .totalRevenue(324.75)
                .unitPrice(12.99)
                .currentStock(15)
                .stockStatus("IN_STOCK")
                .imageUrl("https://example.com/images/coffee-mug.jpg")
                .sku("CM-001")
                .build());
        
        items.add(PopularItemDto.builder()
                .productId(102L)
                .productName("Coffee Beans")
                .category("Beverages")
                .quantitySold(20)
                .totalRevenue(180.00)
                .unitPrice(9.00)
                .currentStock(8)
                .stockStatus("LOW_STOCK")
                .imageUrl("https://example.com/images/coffee-beans.jpg")
                .sku("CB-001")
                .build());
        
        return items;
    }
    
    private List<RecentTransactionDto> getMockRecentTransactions() {
        List<RecentTransactionDto> transactions = new ArrayList<>();
        
        transactions.add(RecentTransactionDto.builder()
                .transactionId(123L)
                .transactionNumber("TXN-2024-001")
                .customerName("John Doe")
                .totalAmount(45.75)
                .paymentMethod("CREDIT_CARD")
                .status("COMPLETED")
                .processedBy("Jane Smith")
                .transactionTime(LocalDateTime.now().minusMinutes(5))
                .itemCount(3)
                .itemSummary("2x Coffee, 1x Muffin")
                .build());
        
        transactions.add(RecentTransactionDto.builder()
                .transactionId(124L)
                .transactionNumber("TXN-2024-002")
                .customerName("Jane Wilson")
                .totalAmount(32.50)
                .paymentMethod("CASH")
                .status("COMPLETED")
                .processedBy("John Doe")
                .transactionTime(LocalDateTime.now().minusMinutes(12))
                .itemCount(2)
                .itemSummary("1x Coffee, 1x Cookie")
                .build());
        
        return transactions;
    }
    
    private List<LowStockAlertDto> getMockLowStockAlerts() {
        List<LowStockAlertDto> alerts = new ArrayList<>();
        
        alerts.add(LowStockAlertDto.builder()
                .productId(102L)
                .productName("Coffee Beans")
                .sku("CB-001")
                .currentStock(8)
                .minimumStock(10)
                .stockStatus("LOW_STOCK")
                .category("Beverages")
                .supplier("ABC Supplies")
                .daysUntilOutOfStock(3)
                .lastRestockDate("2024-01-15")
                .recommendedReorderQuantity(50)
                .build());
        
        alerts.add(LowStockAlertDto.builder()
                .productId(103L)
                .productName("Tea Bags")
                .sku("TB-001")
                .currentStock(5)
                .minimumStock(15)
                .stockStatus("CRITICAL")
                .category("Beverages")
                .supplier("XYZ Supplies")
                .daysUntilOutOfStock(1)
                .lastRestockDate("2024-01-10")
                .recommendedReorderQuantity(100)
                .build());
        
        return alerts;
    }
} 