package com.smartoutlet.pos.service.impl;

import com.smartoutlet.pos.dto.RefundDto;
import com.smartoutlet.pos.entity.Refund;
import com.smartoutlet.pos.entity.RefundItem;
import com.smartoutlet.pos.exception.ResourceNotFoundException;
import com.smartoutlet.pos.repository.RefundRepository;
import com.smartoutlet.pos.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RefundServiceImpl implements RefundService {
    
    private final RefundRepository refundRepository;
    
    @Override
    public RefundDto createRefund(RefundDto refundDto) {
        Refund refund = mapToEntity(refundDto);
        refund.setProcessedAt(LocalDateTime.now());
        refund.setCreatedAt(LocalDateTime.now());
        refund.setUpdatedAt(LocalDateTime.now());
        
        Refund savedRefund = refundRepository.save(refund);
        return mapToDto(savedRefund);
    }
    
    @Override
    public RefundDto getRefundById(Long id) {
        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Refund not found with id: " + id));
        return mapToDto(refund);
    }
    
    @Override
    public List<RefundDto> getAllRefunds() {
        return refundRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RefundDto> getRefundsByTransactionId(Long transactionId) {
        return refundRepository.findByOriginalTransactionId(transactionId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RefundDto> getRefundsByCustomerId(Long customerId) {
        return refundRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RefundDto> getRefundsByStatus(String status) {
        Refund.RefundStatus refundStatus = Refund.RefundStatus.valueOf(status.toUpperCase());
        return refundRepository.findByStatus(refundStatus)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<RefundDto> getRefundsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return refundRepository.findByProcessedAtBetween(startDate, endDate)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public RefundDto updateRefundStatus(Long id, String status) {
        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Refund not found with id: " + id));
        
        refund.setStatus(Refund.RefundStatus.valueOf(status.toUpperCase()));
        refund.setUpdatedAt(LocalDateTime.now());
        
        Refund updatedRefund = refundRepository.save(refund);
        return mapToDto(updatedRefund);
    }
    
    @Override
    public RefundDto reprintReceipt(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new ResourceNotFoundException("Refund not found with id: " + refundId));
        
        refund.setReceiptReprinted(true);
        refund.setUpdatedAt(LocalDateTime.now());
        
        Refund updatedRefund = refundRepository.save(refund);
        return mapToDto(updatedRefund);
    }
    
    @Override
    public Double getTotalRefundsForPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        Double total = refundRepository.getTotalRefundsForPeriod(startDate, endDate);
        return total != null ? total : 0.0;
    }
    
    @Override
    public Long getRefundCountForPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        Long count = refundRepository.getRefundCountForPeriod(startDate, endDate);
        return count != null ? count : 0L;
    }
    
    private RefundDto mapToDto(Refund refund) {
        return RefundDto.builder()
                .id(refund.getId())
                .originalTransactionId(refund.getOriginalTransactionId())
                .refundAmount(refund.getRefundAmount())
                .reason(refund.getReason())
                .status(refund.getStatus().name())
                .refundMethod(refund.getRefundMethod().name())
                .processedBy(refund.getProcessedBy())
                .customerId(refund.getCustomer() != null ? refund.getCustomer().getId() : null)
                .customerName(refund.getCustomer() != null ? refund.getCustomer().getFullName() : null)
                .refundItems(refund.getRefundItems() != null ? 
                    refund.getRefundItems().stream().map(this::mapRefundItemToDto).collect(Collectors.toList()) : null)
                .processedAt(refund.getProcessedAt())
                .notes(refund.getNotes())
                .receiptReprinted(refund.getReceiptReprinted())
                .createdAt(refund.getCreatedAt())
                .updatedAt(refund.getUpdatedAt())
                .build();
    }
    
    private com.smartoutlet.pos.dto.RefundItemDto mapRefundItemToDto(RefundItem refundItem) {
        return com.smartoutlet.pos.dto.RefundItemDto.builder()
                .id(refundItem.getId())
                .originalItemId(refundItem.getOriginalItemId())
                .productId(refundItem.getProductId())
                .productName(refundItem.getProductName())
                .quantity(refundItem.getQuantity())
                .unitPrice(refundItem.getUnitPrice())
                .refundAmount(refundItem.getRefundAmount())
                .reason(refundItem.getReason())
                .isReturned(refundItem.getIsReturned())
                .build();
    }
    
    private Refund mapToEntity(RefundDto refundDto) {
        return Refund.builder()
                .originalTransactionId(refundDto.getOriginalTransactionId())
                .refundAmount(refundDto.getRefundAmount())
                .reason(refundDto.getReason())
                .status(Refund.RefundStatus.valueOf(refundDto.getStatus().toUpperCase()))
                .refundMethod(Refund.RefundMethod.valueOf(refundDto.getRefundMethod().toUpperCase()))
                .processedBy(refundDto.getProcessedBy())
                .notes(refundDto.getNotes())
                .receiptReprinted(refundDto.getReceiptReprinted() != null ? refundDto.getReceiptReprinted() : false)
                .build();
    }
} 