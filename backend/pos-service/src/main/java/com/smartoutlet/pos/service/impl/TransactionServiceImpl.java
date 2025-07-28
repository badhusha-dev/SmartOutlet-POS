package com.smartoutlet.pos.service.impl;

import com.smartoutlet.pos.dto.TransactionDto;
import com.smartoutlet.pos.dto.TransactionItemDto;
import com.smartoutlet.pos.entity.Transaction;
import com.smartoutlet.pos.entity.TransactionItem;
import com.smartoutlet.pos.exception.ResourceNotFoundException;
import com.smartoutlet.pos.repository.TransactionRepository;
import com.smartoutlet.pos.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;
    
    @Value("${app.pos.receipt-number-prefix:RCP}")
    private String receiptNumberPrefix;
    
    @Value("${app.pos.tax-rate:0.08}")
    private BigDecimal taxRate;
    
    @Override
    public TransactionDto createTransaction(TransactionDto transactionDto) {
        log.info("Creating new transaction for outlet: {}", transactionDto.getOutletId());
        
        // Generate transaction number if not provided
        if (transactionDto.getTransactionNumber() == null) {
            transactionDto.setTransactionNumber(generateTransactionNumber());
        }
        
        // Calculate amounts
        BigDecimal subtotal = transactionDto.getSubtotal();
        BigDecimal taxAmount = calculateTaxAmount(subtotal, taxRate);
        BigDecimal discountAmount = transactionDto.getDiscountAmount() != null ? transactionDto.getDiscountAmount() : BigDecimal.ZERO;
        BigDecimal totalAmount = calculateTotalAmount(subtotal, taxAmount, discountAmount);
        BigDecimal changeAmount = calculateChangeAmount(totalAmount, transactionDto.getAmountPaid());
        
        // Calculate loyalty points
        Integer loyaltyPoints = calculateLoyaltyPoints(totalAmount);
        
        // Create transaction entity
        Transaction transaction = Transaction.builder()
                .transactionNumber(transactionDto.getTransactionNumber())
                .outletId(transactionDto.getOutletId())
                .outletName(transactionDto.getOutletName())
                .cashierId(transactionDto.getCashierId())
                .cashierName(transactionDto.getCashierName())
                .customerId(transactionDto.getCustomerId())
                .customerName(transactionDto.getCustomerName())
                .customerEmail(transactionDto.getCustomerEmail())
                .customerPhone(transactionDto.getCustomerPhone())
                .transactionType(Transaction.TransactionType.valueOf(transactionDto.getTransactionType()))
                .paymentMethod(Transaction.PaymentMethod.valueOf(transactionDto.getPaymentMethod()))
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .amountPaid(transactionDto.getAmountPaid())
                .changeAmount(changeAmount)
                .status(Transaction.TransactionStatus.COMPLETED)
                .receiptNumber(generateReceiptNumber())
                .notes(transactionDto.getNotes())
                .loyaltyPointsEarned(loyaltyPoints)
                .loyaltyPointsRedeemed(transactionDto.getLoyaltyPointsRedeemed() != null ? transactionDto.getLoyaltyPointsRedeemed() : 0)
                .discountCode(transactionDto.getDiscountCode())
                .discountPercentage(transactionDto.getDiscountPercentage())
                .build();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Transaction created successfully with ID: {}", savedTransaction.getId());
        
        return convertToDto(savedTransaction);
    }
    
    @Override
    public TransactionDto getTransactionById(Long id) {
        log.info("Fetching transaction by ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        return convertToDto(transaction);
    }
    
    @Override
    public TransactionDto getTransactionByNumber(String transactionNumber) {
        log.info("Fetching transaction by number: {}", transactionNumber);
        Transaction transaction = transactionRepository.findByTransactionNumber(transactionNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with number: " + transactionNumber));
        return convertToDto(transaction);
    }
    
    @Override
    public TransactionDto getTransactionByReceiptNumber(String receiptNumber) {
        log.info("Fetching transaction by receipt number: {}", receiptNumber);
        Transaction transaction = transactionRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with receipt number: " + receiptNumber));
        return convertToDto(transaction);
    }
    
    @Override
    public Page<TransactionDto> getAllTransactions(Pageable pageable) {
        log.info("Fetching all transactions with pagination");
        return transactionRepository.findAll(pageable).map(this::convertToDto);
    }
    
    @Override
    public Page<TransactionDto> getTransactionsByOutlet(Long outletId, Pageable pageable) {
        log.info("Fetching transactions for outlet: {}", outletId);
        return transactionRepository.findByOutletId(outletId, pageable).map(this::convertToDto);
    }
    
    @Override
    public Page<TransactionDto> getTransactionsByCashier(Long cashierId, Pageable pageable) {
        log.info("Fetching transactions for cashier: {}", cashierId);
        return transactionRepository.findByCashierId(cashierId, pageable).map(this::convertToDto);
    }
    
    @Override
    public Page<TransactionDto> getTransactionsByCustomer(Long customerId, Pageable pageable) {
        log.info("Fetching transactions for customer: {}", customerId);
        return transactionRepository.findByCustomerId(customerId, pageable).map(this::convertToDto);
    }
    
    @Override
    public Page<TransactionDto> getTransactionsByStatus(String status, Pageable pageable) {
        log.info("Fetching transactions with status: {}", status);
        return transactionRepository.findByStatus(Transaction.TransactionStatus.valueOf(status), pageable).map(this::convertToDto);
    }
    
    @Override
    public Page<TransactionDto> getTransactionsByType(String transactionType, Pageable pageable) {
        log.info("Fetching transactions with type: {}", transactionType);
        return transactionRepository.findByTransactionType(Transaction.TransactionType.valueOf(transactionType), pageable).map(this::convertToDto);
    }
    
    @Override
    public Page<TransactionDto> getTransactionsByPaymentMethod(String paymentMethod, Pageable pageable) {
        log.info("Fetching transactions with payment method: {}", paymentMethod);
        return transactionRepository.findByPaymentMethod(Transaction.PaymentMethod.valueOf(paymentMethod), pageable).map(this::convertToDto);
    }
    
    @Override
    public Page<TransactionDto> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        log.info("Fetching transactions between {} and {}", startDate, endDate);
        return transactionRepository.findByDateRange(startDate, endDate, pageable).map(this::convertToDto);
    }
    
    @Override
    public Page<TransactionDto> getTransactionsByOutletAndDateRange(Long outletId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        log.info("Fetching transactions for outlet {} between {} and {}", outletId, startDate, endDate);
        return transactionRepository.findByOutletIdAndDateRange(outletId, startDate, endDate, pageable).map(this::convertToDto);
    }
    
    @Override
    public TransactionDto updateTransaction(Long id, TransactionDto transactionDto) {
        log.info("Updating transaction with ID: {}", id);
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        
        // Update fields
        existingTransaction.setNotes(transactionDto.getNotes());
        existingTransaction.setStatus(Transaction.TransactionStatus.valueOf(transactionDto.getStatus()));
        
        Transaction updatedTransaction = transactionRepository.save(existingTransaction);
        log.info("Transaction updated successfully with ID: {}", updatedTransaction.getId());
        
        return convertToDto(updatedTransaction);
    }
    
    @Override
    public TransactionDto cancelTransaction(Long id, String reason) {
        log.info("Cancelling transaction with ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        
        transaction.setStatus(Transaction.TransactionStatus.CANCELLED);
        transaction.setNotes(reason);
        
        Transaction cancelledTransaction = transactionRepository.save(transaction);
        log.info("Transaction cancelled successfully with ID: {}", cancelledTransaction.getId());
        
        return convertToDto(cancelledTransaction);
    }
    
    @Override
    public TransactionDto voidTransaction(Long id, String reason) {
        log.info("Voiding transaction with ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        
        transaction.setStatus(Transaction.TransactionStatus.VOIDED);
        transaction.setNotes(reason);
        
        Transaction voidedTransaction = transactionRepository.save(transaction);
        log.info("Transaction voided successfully with ID: {}", voidedTransaction.getId());
        
        return convertToDto(voidedTransaction);
    }
    
    @Override
    public TransactionDto refundTransaction(Long id, BigDecimal refundAmount, String reason) {
        log.info("Processing refund for transaction with ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + id));
        
        transaction.setStatus(Transaction.TransactionStatus.REFUNDED);
        transaction.setNotes("Refund: " + reason + " - Amount: " + refundAmount);
        
        Transaction refundedTransaction = transactionRepository.save(transaction);
        log.info("Transaction refunded successfully with ID: {}", refundedTransaction.getId());
        
        return convertToDto(refundedTransaction);
    }
    
    @Override
    public String generateReceipt(Long transactionId) {
        log.info("Generating receipt for transaction: {}", transactionId);
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + transactionId));
        
        // Generate receipt content
        StringBuilder receipt = new StringBuilder();
        receipt.append("=== SMART OUTLET RECEIPT ===\n");
        receipt.append("Receipt #: ").append(transaction.getReceiptNumber()).append("\n");
        receipt.append("Transaction #: ").append(transaction.getTransactionNumber()).append("\n");
        receipt.append("Date: ").append(transaction.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        receipt.append("Cashier: ").append(transaction.getCashierName()).append("\n");
        receipt.append("Customer: ").append(transaction.getCustomerName() != null ? transaction.getCustomerName() : "Walk-in Customer").append("\n");
        receipt.append("----------------------------------------\n");
        receipt.append("Subtotal: $").append(transaction.getSubtotal()).append("\n");
        receipt.append("Tax: $").append(transaction.getTaxAmount()).append("\n");
        receipt.append("Discount: $").append(transaction.getDiscountAmount()).append("\n");
        receipt.append("Total: $").append(transaction.getTotalAmount()).append("\n");
        receipt.append("Paid: $").append(transaction.getAmountPaid()).append("\n");
        receipt.append("Change: $").append(transaction.getChangeAmount()).append("\n");
        receipt.append("Payment Method: ").append(transaction.getPaymentMethod()).append("\n");
        receipt.append("Loyalty Points Earned: ").append(transaction.getLoyaltyPointsEarned()).append("\n");
        receipt.append("========================================\n");
        receipt.append("Thank you for your purchase!\n");
        
        return receipt.toString();
    }
    
    @Override
    public BigDecimal calculateTotalAmount(BigDecimal subtotal, BigDecimal taxAmount, BigDecimal discountAmount) {
        return subtotal.add(taxAmount).subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);
    }
    
    @Override
    public BigDecimal calculateTaxAmount(BigDecimal subtotal, BigDecimal taxRate) {
        return subtotal.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
    }
    
    @Override
    public BigDecimal calculateChangeAmount(BigDecimal totalAmount, BigDecimal amountPaid) {
        return amountPaid.subtract(totalAmount).setScale(2, RoundingMode.HALF_UP);
    }
    
    @Override
    public Integer calculateLoyaltyPoints(BigDecimal totalAmount) {
        // 1 point per dollar spent
        return totalAmount.intValue();
    }
    
    @Override
    public Double getTotalSalesByOutlet(Long outletId) {
        return transactionRepository.getTotalSalesByOutlet(outletId);
    }
    
    @Override
    public Long getTransactionCountByOutlet(Long outletId) {
        return transactionRepository.getTransactionCountByOutlet(outletId);
    }
    
    @Override
    public List<TransactionDto> getRecentTransactionsByCustomer(Long customerId, int limit) {
        return transactionRepository.findRecentTransactionsByCustomer(customerId, 
                org.springframework.data.domain.PageRequest.of(0, limit))
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public String generateTransactionNumber() {
        return "TXN-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
    }
    
    @Override
    public String generateReceiptNumber() {
        return receiptNumberPrefix + "-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
    }
    
    private TransactionDto convertToDto(Transaction transaction) {
        return TransactionDto.builder()
                .id(transaction.getId())
                .transactionNumber(transaction.getTransactionNumber())
                .outletId(transaction.getOutletId())
                .outletName(transaction.getOutletName())
                .cashierId(transaction.getCashierId())
                .cashierName(transaction.getCashierName())
                .customerId(transaction.getCustomerId())
                .customerName(transaction.getCustomerName())
                .customerEmail(transaction.getCustomerEmail())
                .customerPhone(transaction.getCustomerPhone())
                .transactionType(transaction.getTransactionType().name())
                .paymentMethod(transaction.getPaymentMethod().name())
                .subtotal(transaction.getSubtotal())
                .taxAmount(transaction.getTaxAmount())
                .discountAmount(transaction.getDiscountAmount())
                .totalAmount(transaction.getTotalAmount())
                .amountPaid(transaction.getAmountPaid())
                .changeAmount(transaction.getChangeAmount())
                .status(transaction.getStatus().name())
                .receiptNumber(transaction.getReceiptNumber())
                .notes(transaction.getNotes())
                .loyaltyPointsEarned(transaction.getLoyaltyPointsEarned())
                .loyaltyPointsRedeemed(transaction.getLoyaltyPointsRedeemed())
                .discountCode(transaction.getDiscountCode())
                .discountPercentage(transaction.getDiscountPercentage())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
} 