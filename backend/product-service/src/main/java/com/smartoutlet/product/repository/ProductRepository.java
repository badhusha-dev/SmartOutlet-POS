package com.smartoutlet.product.repository;

import com.smartoutlet.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySku(String sku);
    
    Optional<Product> findByBarcode(String barcode);
    
    List<Product> findByIsActiveTrueOrderByName();
    
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.minStockLevel AND p.isActive = true")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= 0 AND p.isActive = true")
    List<Product> findOutOfStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword% OR p.sku LIKE %:keyword% OR p.brand LIKE %:keyword%")
    Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice AND p.isActive = true")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.brand = :brand AND p.isActive = true")
    Page<Product> findByBrand(@Param("brand") String brand, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = :isActive")
    Page<Product> findByIsActive(@Param("isActive") Boolean isActive, Pageable pageable);
    
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL AND p.isActive = true ORDER BY p.brand")
    List<String> findAllBrands();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isActive = true")
    Long countActiveProducts();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity <= p.minStockLevel AND p.isActive = true")
    Long countLowStockProducts();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity <= 0 AND p.isActive = true")
    Long countOutOfStockProducts();
    
    @Query("SELECT SUM(p.stockQuantity * p.price) FROM Product p WHERE p.isActive = true")
    BigDecimal calculateTotalInventoryValue();
    
    Boolean existsBySku(String sku);
    
    Boolean existsByBarcode(String barcode);
    
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.stockMovements WHERE p.id = :id")
    Optional<Product> findByIdWithStockMovements(@Param("id") Long id);
}