package com.smartoutlet.pos.service.impl;

import com.smartoutlet.pos.dto.GiftCardDto;
import com.smartoutlet.pos.entity.GiftCard;
import com.smartoutlet.pos.exception.ResourceNotFoundException;
import com.smartoutlet.pos.repository.GiftCardRepository;
import com.smartoutlet.pos.service.GiftCardService;
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
public class GiftCardServiceImpl implements GiftCardService {
    
    private final GiftCardRepository giftCardRepository;
    
    @Override
    public GiftCardDto createGiftCard(GiftCardDto giftCardDto) {
        GiftCard giftCard = mapToEntity(giftCardDto);
        giftCard.setCreatedAt(LocalDateTime.now());
        giftCard.setUpdatedAt(LocalDateTime.now());
        
        GiftCard savedGiftCard = giftCardRepository.save(giftCard);
        return mapToDto(savedGiftCard);
    }
    
    @Override
    public GiftCardDto getGiftCardById(Long id) {
        GiftCard giftCard = giftCardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gift card not found with id: " + id));
        return mapToDto(giftCard);
    }
    
    @Override
    public GiftCardDto getGiftCardByNumber(String giftCardNumber) {
        GiftCard giftCard = giftCardRepository.findByGiftCardNumber(giftCardNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Gift card not found with number: " + giftCardNumber));
        return mapToDto(giftCard);
    }
    
    @Override
    public GiftCardDto validateGiftCard(String giftCardNumber, String securityCode) {
        GiftCard giftCard = giftCardRepository.findByGiftCardNumberAndSecurityCode(giftCardNumber, securityCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid gift card number or security code"));
        
        if (!giftCard.isValid()) {
            throw new RuntimeException("Gift card is not valid or has expired");
        }
        
        return mapToDto(giftCard);
    }
    
    @Override
    public List<GiftCardDto> getAllGiftCards() {
        return giftCardRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<GiftCardDto> getValidGiftCards() {
        return giftCardRepository.findValidGiftCards(LocalDateTime.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<GiftCardDto> getGiftCardsByStatus(String status) {
        GiftCard.GiftCardStatus giftCardStatus = GiftCard.GiftCardStatus.valueOf(status.toUpperCase());
        return giftCardRepository.findByStatus(giftCardStatus)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public GiftCardDto updateGiftCard(Long id, GiftCardDto giftCardDto) {
        GiftCard existingGiftCard = giftCardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gift card not found with id: " + id));
        
        existingGiftCard.setHolderName(giftCardDto.getHolderName());
        existingGiftCard.setExpiryDate(giftCardDto.getExpiryDate());
        existingGiftCard.setStatus(GiftCard.GiftCardStatus.valueOf(giftCardDto.getStatus().toUpperCase()));
        existingGiftCard.setUpdatedAt(LocalDateTime.now());
        
        GiftCard updatedGiftCard = giftCardRepository.save(existingGiftCard);
        return mapToDto(updatedGiftCard);
    }
    
    @Override
    public void deleteGiftCard(Long id) {
        GiftCard giftCard = giftCardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gift card not found with id: " + id));
        giftCardRepository.delete(giftCard);
    }
    
    @Override
    public GiftCardDto useGiftCard(String giftCardNumber, Double amount) {
        GiftCard giftCard = giftCardRepository.findValidGiftCardByNumber(giftCardNumber, LocalDateTime.now())
                .orElseThrow(() -> new ResourceNotFoundException("Valid gift card not found with number: " + giftCardNumber));
        
        if (!giftCard.canUseAmount(amount)) {
            throw new RuntimeException("Insufficient balance on gift card");
        }
        
        giftCard.deductAmount(amount);
        giftCard.setUpdatedAt(LocalDateTime.now());
        
        GiftCard updatedGiftCard = giftCardRepository.save(giftCard);
        return mapToDto(updatedGiftCard);
    }
    
    @Override
    public GiftCardDto addBalance(String giftCardNumber, Double amount) {
        GiftCard giftCard = giftCardRepository.findByGiftCardNumber(giftCardNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Gift card not found with number: " + giftCardNumber));
        
        giftCard.setCurrentBalance(giftCard.getCurrentBalance() + amount);
        giftCard.setUpdatedAt(LocalDateTime.now());
        
        GiftCard updatedGiftCard = giftCardRepository.save(giftCard);
        return mapToDto(updatedGiftCard);
    }
    
    @Override
    public Double getGiftCardBalance(String giftCardNumber) {
        GiftCard giftCard = giftCardRepository.findByGiftCardNumber(giftCardNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Gift card not found with number: " + giftCardNumber));
        return giftCard.getCurrentBalance();
    }
    
    @Override
    public boolean isGiftCardValid(String giftCardNumber) {
        return giftCardRepository.findValidGiftCardByNumber(giftCardNumber, LocalDateTime.now()).isPresent();
    }
    
    @Override
    public Double getTotalActiveGiftCardBalance() {
        Double total = giftCardRepository.getTotalActiveGiftCardBalance();
        return total != null ? total : 0.0;
    }
    
    @Override
    public Long getActiveGiftCardCount() {
        Long count = giftCardRepository.getActiveGiftCardCount();
        return count != null ? count : 0L;
    }
    
    private GiftCardDto mapToDto(GiftCard giftCard) {
        return GiftCardDto.builder()
                .id(giftCard.getId())
                .giftCardNumber(giftCard.getGiftCardNumber())
                .holderName(giftCard.getHolderName())
                .originalValue(giftCard.getOriginalValue())
                .currentBalance(giftCard.getCurrentBalance())
                .status(giftCard.getStatus().name())
                .issueDate(giftCard.getIssueDate())
                .expiryDate(giftCard.getExpiryDate())
                .purchasedBy(giftCard.getPurchasedBy())
                .giftCardType(giftCard.getGiftCardType().name())
                .securityCode(giftCard.getSecurityCode())
                .isValid(giftCard.isValid())
                .validationMessage(giftCard.isValid() ? "Gift card is valid" : "Gift card is invalid or expired")
                .createdAt(giftCard.getCreatedAt())
                .updatedAt(giftCard.getUpdatedAt())
                .build();
    }
    
    private GiftCard mapToEntity(GiftCardDto giftCardDto) {
        return GiftCard.builder()
                .giftCardNumber(giftCardDto.getGiftCardNumber())
                .holderName(giftCardDto.getHolderName())
                .originalValue(giftCardDto.getOriginalValue())
                .currentBalance(giftCardDto.getCurrentBalance() != null ? giftCardDto.getCurrentBalance() : giftCardDto.getOriginalValue())
                .status(GiftCard.GiftCardStatus.valueOf(giftCardDto.getStatus() != null ? giftCardDto.getStatus().toUpperCase() : "ACTIVE"))
                .expiryDate(giftCardDto.getExpiryDate())
                .purchasedBy(giftCardDto.getPurchasedBy())
                .giftCardType(GiftCard.GiftCardType.valueOf(giftCardDto.getGiftCardType() != null ? giftCardDto.getGiftCardType().toUpperCase() : "PHYSICAL"))
                .securityCode(giftCardDto.getSecurityCode())
                .build();
    }
} 