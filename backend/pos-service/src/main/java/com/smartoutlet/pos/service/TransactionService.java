package com.smartoutlet.pos.service;

import com.smartoutlet.pos.dto.TransactionDto;
import com.smartoutlet.pos.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
    
    TransactionDto createTransaction(TransactionDto transactionDto);
    
    TransactionDto getTransactionById(Long id);
    
    TransactionDto getTransactionByNumber(String transactionNumber);
    
    TransactionDto getTransactionByReceiptNumber(String receiptNumber);
    
    Page<TransactionDto> getAllTransactions(Pageable pageable);
    
    Page<TransactionDto> getTransactionsByOutlet(Long outletId, Pageable pageable);
    
    Page<TransactionDto> getTransactionsByCashier(Long cashierId, Pageable pageable);
    
    Page<TransactionDto> getTransactionsByCustomer(Long customerId, Pageable pageable);
    
    Page<TransactionDto> getTransactionsByStatus(String status, Pageable pageable);
    
    Page<TransactionDto> getTransactionsByType(String transactionType, Pageable pageable);
    
    Page<TransactionDto> getTransactionsByPaymentMethod(String paymentMethod, Pageable pageable);
    
    Page<TransactionDto> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Page<TransactionDto> getTransactionsByOutletAndDateRange(Long outletId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    TransactionDto updateTransaction(Long id, TransactionDto transactionDto);
    
    TransactionDto cancelTransaction(Long id, String reason);
    
    TransactionDto voidTransaction(Long id, String reason);
    
    TransactionDto refundTransaction(Long id, BigDecimal refundAmount, String reason);
    
    String generateReceipt(Long transactionId);
    
    BigDecimal calculateTotalAmount(BigDecimal subtotal, BigDecimal taxAmount, BigDecimal discountAmount);
    
    BigDecimal calculateTaxAmount(BigDecimal subtotal, BigDecimal taxRate);
    
    BigDecimal calculateChangeAmount(BigDecimal totalAmount, BigDecimal amountPaid);
    
    Integer calculateLoyaltyPoints(BigDecimal totalAmount);
    
    Double getTotalSalesByOutlet(Long outletId);
    
    Long getTransactionCountByOutlet(Long outletId);
    
    List<TransactionDto> getRecentTransactionsByCustomer(Long customerId, int limit);
    
    String generateTransactionNumber();
    
    String generateReceiptNumber();
} 