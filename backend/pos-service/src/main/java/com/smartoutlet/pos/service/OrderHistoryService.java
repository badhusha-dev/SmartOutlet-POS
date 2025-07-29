package com.smartoutlet.pos.service;

import com.smartoutlet.pos.dto.OrderHistoryDto;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderHistoryService {
    
    List<OrderHistoryDto> getAllOrders();
    
    OrderHistoryDto getOrderById(Long id);
    
    List<OrderHistoryDto> getOrdersByCustomerId(Long customerId);
    
    List<OrderHistoryDto> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    List<OrderHistoryDto> getOrdersByStatus(String status);
    
    List<OrderHistoryDto> getOrdersByPaymentMethod(String paymentMethod);
    
    List<OrderHistoryDto> getOrdersByOutletId(Long outletId);
    
    List<OrderHistoryDto> getOrdersByStaffMember(String staffMember);
    
    List<OrderHistoryDto> searchOrders(String searchTerm);
    
    List<OrderHistoryDto> getOrdersWithDiscounts();
    
    List<OrderHistoryDto> getOrdersByAmountRange(Double minAmount, Double maxAmount);
    
    Double getTotalSalesForPeriod(LocalDateTime startDate, LocalDateTime endDate);
    
    Long getOrderCountForPeriod(LocalDateTime startDate, LocalDateTime endDate);
} 