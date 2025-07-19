package com.smartoutlet.product.application.service;

import com.smartoutlet.product.api.dto.ProductRequest;
import com.smartoutlet.product.api.dto.ProductResponse;
import com.smartoutlet.product.api.dto.StockUpdateRequest;
import com.smartoutlet.product.entity.Product;
import com.smartoutlet.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating product: {}", request.getName());
        
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setIsActive(true);
        
        Product savedProduct = productRepository.save(product);
        
        return convertToProductResponse(savedProduct);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        return convertToProductResponse(product);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
        
        return convertToProductResponse(product);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductByBarcode(String barcode) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new RuntimeException("Product not found with barcode: " + barcode));
        
        return convertToProductResponse(product);
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findAll(pageable);
        
        return products.map(this::convertToProductResponse);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getActiveProducts() {
        List<Product> products = productRepository.findByIsActiveTrue();
        return products.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByKeyword(keyword, pageable);
        return products.map(this::convertToProductResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        return products.map(this::convertToProductResponse);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts() {
        List<Product> products = productRepository.findLowStockProducts(10);
        return products.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getOutOfStockProducts() {
        List<Product> products = productRepository.findOutOfStockProducts();
        return products.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }
    
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        log.info("Updating product: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        
        Product updatedProduct = productRepository.save(product);
        
        return convertToProductResponse(updatedProduct);
    }
    
    public ProductResponse updateStock(Long productId, StockUpdateRequest request) {
        log.info("Updating stock for product: {}", productId);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        Integer newStock = product.getStockQuantity() + request.getQuantity();
        product.setStockQuantity(newStock);
        
        Product updatedProduct = productRepository.save(product);
        
        return convertToProductResponse(updatedProduct);
    }
    
    public void deleteProduct(Long id) {
        log.info("Deleting product: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setIsActive(false);
        productRepository.save(product);
    }
    
    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .sku(product.getSku())
                .barcode(product.getBarcode())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
} 