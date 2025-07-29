package com.smartoutlet.pos.service;

import com.smartoutlet.pos.dto.DiscountDto;

import java.util.List;

public interface DiscountService {
    
    DiscountDto createDiscount(DiscountDto discountDto);
    
    DiscountDto getDiscountById(Long id);
    
    DiscountDto getDiscountByCode(String code);
    
    List<DiscountDto> getAllDiscounts();
    
    List<DiscountDto> getActiveDiscounts();
    
    List<DiscountDto> getValidDiscounts();
    
    DiscountDto updateDiscount(Long id, DiscountDto discountDto);
    
    void deleteDiscount(Long id);
    
    DiscountDto activateDiscount(Long id);
    
    DiscountDto deactivateDiscount(Long id);
    
    DiscountDto applyDiscount(String code);
    
    List<DiscountDto> getApplicableDiscounts(String productIds, String categoryIds);
    
    boolean validateDiscount(String code);
} 