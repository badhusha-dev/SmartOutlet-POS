package com.smartoutlet.pos.repository;

import com.smartoutlet.pos.entity.GiftCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GiftCardRepository extends JpaRepository<GiftCard, Long> {
    
    Optional<GiftCard> findByGiftCardNumber(String giftCardNumber);
    
    Optional<GiftCard> findByGiftCardNumberAndSecurityCode(String giftCardNumber, String securityCode);
    
    List<GiftCard> findByStatus(GiftCard.GiftCardStatus status);
    
    List<GiftCard> findByHolderNameContainingIgnoreCase(String holderName);
    
    List<GiftCard> findByPurchasedBy(String purchasedBy);
    
    List<GiftCard> findByGiftCardType(GiftCard.GiftCardType giftCardType);
    
    @Query("SELECT gc FROM GiftCard gc WHERE gc.currentBalance > 0 AND gc.status = 'ACTIVE' AND " +
           "(gc.expiryDate IS NULL OR gc.expiryDate > :now)")
    List<GiftCard> findValidGiftCards(@Param("now") LocalDateTime now);
    
    @Query("SELECT gc FROM GiftCard gc WHERE gc.giftCardNumber = :cardNumber AND " +
           "gc.currentBalance > 0 AND gc.status = 'ACTIVE' AND " +
           "(gc.expiryDate IS NULL OR gc.expiryDate > :now)")
    Optional<GiftCard> findValidGiftCardByNumber(@Param("cardNumber") String cardNumber, 
                                                @Param("now") LocalDateTime now);
    
    @Query("SELECT SUM(gc.currentBalance) FROM GiftCard gc WHERE gc.status = 'ACTIVE'")
    Double getTotalActiveGiftCardBalance();
    
    @Query("SELECT COUNT(gc) FROM GiftCard gc WHERE gc.status = 'ACTIVE' AND gc.currentBalance > 0")
    Long getActiveGiftCardCount();
} 