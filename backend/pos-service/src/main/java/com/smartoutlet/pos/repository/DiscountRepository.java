package com.smartoutlet.pos.repository;

import com.smartoutlet.pos.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    
    Optional<Discount> findByDiscountCode(String discountCode);
    
    List<Discount> findByIsActiveTrue();
    
    List<Discount> findByDiscountType(Discount.DiscountType discountType);
    
    @Query("SELECT d FROM Discount d WHERE d.isActive = true AND " +
           "(d.validFrom IS NULL OR d.validFrom <= :now) AND " +
           "(d.validTo IS NULL OR d.validTo >= :now) AND " +
           "(d.maxUses IS NULL OR d.currentUses < d.maxUses)")
    List<Discount> findValidDiscounts(@Param("now") LocalDateTime now);
    
    @Query("SELECT d FROM Discount d WHERE d.discountCode = :code AND d.isActive = true AND " +
           "(d.validFrom IS NULL OR d.validFrom <= :now) AND " +
           "(d.validTo IS NULL OR d.validTo >= :now) AND " +
           "(d.maxUses IS NULL OR d.currentUses < d.maxUses)")
    Optional<Discount> findValidDiscountByCode(@Param("code") String code, @Param("now") LocalDateTime now);
    
    @Query("SELECT d FROM Discount d WHERE d.appliesToAllProducts = true OR " +
           "d.applicableProductIds LIKE %:productId% OR " +
           "d.applicableCategoryIds LIKE %:categoryId%")
    List<Discount> findApplicableDiscounts(@Param("productId") String productId, 
                                          @Param("categoryId") String categoryId);
} 