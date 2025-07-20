package com.smartoutlet.product.infrastructure.persistence;

import com.smartoutlet.product.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    boolean existsByName(String name);
    
    List<Category> findByActiveTrue();
    
    List<Category> findByParentIdIsNull();
    
    List<Category> findByParentId(Long parentId);
    
    @Query("SELECT c FROM Category c WHERE c.active = true ORDER BY c.sortOrder ASC, c.name ASC")
    List<Category> findActiveCategoriesOrdered();
    
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Category> searchCategories(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(c) FROM Category c WHERE c.parentId = :parentId")
    long countByParentId(@Param("parentId") Long parentId);
} 