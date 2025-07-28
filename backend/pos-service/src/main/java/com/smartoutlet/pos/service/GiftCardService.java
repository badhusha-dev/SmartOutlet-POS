package com.smartoutlet.pos.service;

import com.smartoutlet.pos.dto.GiftCardDto;

import java.util.List;

public interface GiftCardService {
    
    GiftCardDto createGiftCard(GiftCardDto giftCardDto);
    
    GiftCardDto getGiftCardById(Long id);
    
    GiftCardDto getGiftCardByNumber(String giftCardNumber);
    
    GiftCardDto validateGiftCard(String giftCardNumber, String securityCode);
    
    List<GiftCardDto> getAllGiftCards();
    
    List<GiftCardDto> getValidGiftCards();
    
    List<GiftCardDto> getGiftCardsByStatus(String status);
    
    GiftCardDto updateGiftCard(Long id, GiftCardDto giftCardDto);
    
    void deleteGiftCard(Long id);
    
    GiftCardDto useGiftCard(String giftCardNumber, Double amount);
    
    GiftCardDto addBalance(String giftCardNumber, Double amount);
    
    Double getGiftCardBalance(String giftCardNumber);
    
    boolean isGiftCardValid(String giftCardNumber);
    
    Double getTotalActiveGiftCardBalance();
    
    Long getActiveGiftCardCount();
} 