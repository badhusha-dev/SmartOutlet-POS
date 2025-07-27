package com.smartoutlet.pos.service.impl;

import com.smartoutlet.pos.dto.OrderHistoryDto;
import com.smartoutlet.pos.entity.Transaction;
import com.smartoutlet.pos.exception.ResourceNotFoundException;
import com.smartoutlet.pos.repository.TransactionRepository;
import com.smartoutlet.pos.service.OrderHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderHistoryServiceImpl implements OrderHistoryService {
    
    private final TransactionRepository transactionRepository;
    
    @Override
    public List<OrderHistoryDto> getAllOrders() {
        return transactionRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public OrderHistoryDto getOrderById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToDto(transaction);
    }
    
    @Override
    public List<OrderHistoryDto> getOrdersByCustomerId(Long customerId) {
        return transactionRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderHistoryDto> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByTransactionDateBetween(startDate, endDate)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderHistoryDto> getOrdersByStatus(String status) {
        return transactionRepository.findByStatus(Transaction.TransactionStatus.valueOf(status.toUpperCase()))
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderHistoryDto> getOrdersByPaymentMethod(String paymentMethod) {
        return transactionRepository.findByPaymentMethod(Transaction.PaymentMethod.valueOf(paymentMethod.toUpperCase()))
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderHistoryDto> getOrdersByOutletId(Long outletId) {
        return transactionRepository.findByOutletId(outletId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderHistoryDto> getOrdersByStaffMember(String staffMember) {
        return transactionRepository.findByProcessedBy(staffMember)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderHistoryDto> searchOrders(String searchTerm) {
        // This would typically involve a more complex search query
        // For now, we'll search by customer name
        return transactionRepository.findAll()
                .stream()
                .filter(t -> t.getCustomer() != null && 
                        (t.getCustomer().getFirstName().toLowerCase().contains(searchTerm.toLowerCase()) ||
                         t.getCustomer().getLastName().toLowerCase().contains(searchTerm.toLowerCase()) ||
                         t.getTransactionNumber().toLowerCase().contains(searchTerm.toLowerCase())))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderHistoryDto> getOrdersWithDiscounts() {
        return transactionRepository.findAll()
                .stream()
                .filter(t -> t.getDiscountAmount() != null && t.getDiscountAmount() > 0)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderHistoryDto> getOrdersByAmountRange(Double minAmount, Double maxAmount) {
        return transactionRepository.findAll()
                .stream()
                .filter(t -> t.getTotalAmount() >= minAmount && t.getTotalAmount() <= maxAmount)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Double getTotalSalesForPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByTransactionDateBetween(startDate, endDate)
                .stream()
                .mapToDouble(Transaction::getTotalAmount)
                .sum();
    }
    
    @Override
    public Long getOrderCountForPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return (long) transactionRepository.findByTransactionDateBetween(startDate, endDate).size();
    }
    
    private OrderHistoryDto mapToDto(Transaction transaction) {
        return OrderHistoryDto.builder()
                .id(transaction.getId())
                .transactionId(transaction.getId())
                .transactionNumber(transaction.getTransactionNumber())
                .customerId(transaction.getCustomer() != null ? transaction.getCustomer().getId() : null)
                .customerName(transaction.getCustomer() != null ? transaction.getCustomer().getFullName() : null)
                .customerEmail(transaction.getCustomer() != null ? transaction.getCustomer().getEmail() : null)
                .totalAmount(transaction.getTotalAmount())
                .status(transaction.getStatus().name())
                .paymentMethod(transaction.getPaymentMethod().name())
                .processedBy(transaction.getProcessedBy())
                .outletId(transaction.getOutletId())
                .outletName("Downtown Store") // Mock outlet name
                .transactionDate(transaction.getTransactionDate())
                .items(transaction.getItems() != null ? 
                    transaction.getItems().stream().map(this::mapTransactionItemToDto).collect(Collectors.toList()) : null)
                .discountAmount(transaction.getDiscountAmount())
                .taxAmount(transaction.getTaxAmount())
                .receiptNumber(transaction.getTransactionNumber().replace("TXN", "RCPT"))
                .receiptReprinted(false) // Mock value
                .notes(transaction.getNotes())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
    
    private com.smartoutlet.pos.dto.TransactionItemDto mapTransactionItemToDto(com.smartoutlet.pos.entity.TransactionItem item) {
        return com.smartoutlet.pos.dto.TransactionItemDto.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
} 