package com.smartoutlet.pos.service.impl;

import com.smartoutlet.pos.dto.DiscountDto;
import com.smartoutlet.pos.entity.Discount;
import com.smartoutlet.pos.exception.ResourceNotFoundException;
import com.smartoutlet.pos.repository.DiscountRepository;
import com.smartoutlet.pos.service.DiscountService;
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
public class DiscountServiceImpl implements DiscountService {
    
    private final DiscountRepository discountRepository;
    
    @Override
    public DiscountDto createDiscount(DiscountDto discountDto) {
        Discount discount = mapToEntity(discountDto);
        discount.setCreatedAt(LocalDateTime.now());
        discount.setUpdatedAt(LocalDateTime.now());
        
        Discount savedDiscount = discountRepository.save(discount);
        return mapToDto(savedDiscount);
    }
    
    @Override
    public DiscountDto getDiscountById(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with id: " + id));
        return mapToDto(discount);
    }
    
    @Override
    public DiscountDto getDiscountByCode(String code) {
        Discount discount = discountRepository.findByDiscountCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with code: " + code));
        return mapToDto(discount);
    }
    
    @Override
    public List<DiscountDto> getAllDiscounts() {
        return discountRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<DiscountDto> getActiveDiscounts() {
        return discountRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<DiscountDto> getValidDiscounts() {
        return discountRepository.findValidDiscounts(LocalDateTime.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public DiscountDto updateDiscount(Long id, DiscountDto discountDto) {
        Discount existingDiscount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with id: " + id));
        
        existingDiscount.setDiscountCode(discountDto.getDiscountCode());
        existingDiscount.setDiscountName(discountDto.getDiscountName());
        existingDiscount.setDiscountType(Discount.DiscountType.valueOf(discountDto.getDiscountType().toUpperCase()));
        existingDiscount.setDiscountValue(discountDto.getDiscountValue());
        existingDiscount.setMinimumPurchase(discountDto.getMinimumPurchase());
        existingDiscount.setMaximumDiscount(discountDto.getMaximumDiscount());
        existingDiscount.setValidFrom(discountDto.getValidFrom());
        existingDiscount.setValidTo(discountDto.getValidTo());
        existingDiscount.setMaxUses(discountDto.getMaxUses());
        existingDiscount.setAppliesToAllProducts(discountDto.getAppliesToAllProducts());
        existingDiscount.setApplicableProductIds(discountDto.getApplicableProductIds());
        existingDiscount.setApplicableCategoryIds(discountDto.getApplicableCategoryIds());
        existingDiscount.setDescription(discountDto.getDescription());
        existingDiscount.setUpdatedAt(LocalDateTime.now());
        
        Discount updatedDiscount = discountRepository.save(existingDiscount);
        return mapToDto(updatedDiscount);
    }
    
    @Override
    public void deleteDiscount(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with id: " + id));
        discountRepository.delete(discount);
    }
    
    @Override
    public DiscountDto activateDiscount(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with id: " + id));
        discount.setIsActive(true);
        discount.setUpdatedAt(LocalDateTime.now());
        
        Discount updatedDiscount = discountRepository.save(discount);
        return mapToDto(updatedDiscount);
    }
    
    @Override
    public DiscountDto deactivateDiscount(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount not found with id: " + id));
        discount.setIsActive(false);
        discount.setUpdatedAt(LocalDateTime.now());
        
        Discount updatedDiscount = discountRepository.save(discount);
        return mapToDto(updatedDiscount);
    }
    
    @Override
    public DiscountDto applyDiscount(String code) {
        Discount discount = discountRepository.findValidDiscountByCode(code, LocalDateTime.now())
                .orElseThrow(() -> new ResourceNotFoundException("Valid discount not found with code: " + code));
        
        discount.incrementUsage();
        discount.setUpdatedAt(LocalDateTime.now());
        
        Discount updatedDiscount = discountRepository.save(discount);
        return mapToDto(updatedDiscount);
    }
    
    @Override
    public List<DiscountDto> getApplicableDiscounts(String productIds, String categoryIds) {
        return discountRepository.findApplicableDiscounts(productIds, categoryIds)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public boolean validateDiscount(String code) {
        return discountRepository.findValidDiscountByCode(code, LocalDateTime.now()).isPresent();
    }
    
    private DiscountDto mapToDto(Discount discount) {
        return DiscountDto.builder()
                .id(discount.getId())
                .discountCode(discount.getDiscountCode())
                .discountName(discount.getDiscountName())
                .discountType(discount.getDiscountType().name())
                .discountValue(discount.getDiscountValue())
                .minimumPurchase(discount.getMinimumPurchase())
                .maximumDiscount(discount.getMaximumDiscount())
                .isActive(discount.getIsActive())
                .validFrom(discount.getValidFrom())
                .validTo(discount.getValidTo())
                .maxUses(discount.getMaxUses())
                .currentUses(discount.getCurrentUses())
                .appliesToAllProducts(discount.getAppliesToAllProducts())
                .applicableProductIds(discount.getApplicableProductIds())
                .applicableCategoryIds(discount.getApplicableCategoryIds())
                .description(discount.getDescription())
                .createdAt(discount.getCreatedAt())
                .updatedAt(discount.getUpdatedAt())
                .build();
    }
    
    private Discount mapToEntity(DiscountDto discountDto) {
        return Discount.builder()
                .discountCode(discountDto.getDiscountCode())
                .discountName(discountDto.getDiscountName())
                .discountType(Discount.DiscountType.valueOf(discountDto.getDiscountType().toUpperCase()))
                .discountValue(discountDto.getDiscountValue())
                .minimumPurchase(discountDto.getMinimumPurchase())
                .maximumDiscount(discountDto.getMaximumDiscount())
                .isActive(discountDto.getIsActive() != null ? discountDto.getIsActive() : true)
                .validFrom(discountDto.getValidFrom())
                .validTo(discountDto.getValidTo())
                .maxUses(discountDto.getMaxUses())
                .currentUses(discountDto.getCurrentUses() != null ? discountDto.getCurrentUses() : 0)
                .appliesToAllProducts(discountDto.getAppliesToAllProducts() != null ? discountDto.getAppliesToAllProducts() : true)
                .applicableProductIds(discountDto.getApplicableProductIds())
                .applicableCategoryIds(discountDto.getApplicableCategoryIds())
                .description(discountDto.getDescription())
                .build();
    }
} 