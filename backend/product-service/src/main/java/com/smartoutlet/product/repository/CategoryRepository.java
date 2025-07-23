package com.smartoutlet.product.repository;

import com.smartoutlet.product.entity.Category;
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
    
    List<Category> findByIsActiveTrue();
    
    List<Category> findByIsActiveTrueOrderBySortOrder();
    
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL")
    List<Category> findRootCategories();
    
    @Query("SELECT c FROM Category c WHERE c.parent.id = :parentId")
    List<Category> findSubCategories(@Param("parentId") Long parentId);
    
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL AND c.isActive = true")
    List<Category> findActiveRootCategories();
    
    @Query("SELECT c FROM Category c WHERE c.parent.id = :parentId AND c.isActive = true")
    List<Category> findActiveSubCategories(@Param("parentId") Long parentId);
    
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:searchTerm% AND c.isActive = true")
    List<Category> searchByName(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    long countActiveProductsByCategoryId(@Param("categoryId") Long categoryId);
} 