package com.smartoutlet.pos.service;

import com.smartoutlet.pos.dto.RefundDto;

import java.time.LocalDateTime;
import java.util.List;

public interface RefundService {
    
    RefundDto createRefund(RefundDto refundDto);
    
    RefundDto getRefundById(Long id);
    
    List<RefundDto> getAllRefunds();
    
    List<RefundDto> getRefundsByTransactionId(Long transactionId);
    
    List<RefundDto> getRefundsByCustomerId(Long customerId);
    
    List<RefundDto> getRefundsByStatus(String status);
    
    List<RefundDto> getRefundsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    RefundDto updateRefundStatus(Long id, String status);
    
    RefundDto reprintReceipt(Long refundId);
    
    Double getTotalRefundsForPeriod(LocalDateTime startDate, LocalDateTime endDate);
    
    Long getRefundCountForPeriod(LocalDateTime startDate, LocalDateTime endDate);
} 