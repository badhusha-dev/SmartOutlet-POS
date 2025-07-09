package com.smartoutlet.product.repository;

import com.smartoutlet.product.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    List<Category> findByIsActiveTrueOrderBySortOrder();
    
    List<Category> findByParentIdOrderBySortOrder(Long parentId);
    
    List<Category> findByParentIdIsNullAndIsActiveTrueOrderBySortOrder();
    
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    Page<Category> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT c FROM Category c WHERE c.isActive = :isActive")
    Page<Category> findByIsActive(@Param("isActive") Boolean isActive, Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    Long countActiveProductsByCategoryId(@Param("categoryId") Long categoryId);
    
    Boolean existsByName(String name);
    
    Boolean existsByParentId(Long parentId);
}