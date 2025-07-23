package com.smartoutlet.product.application.service.impl;

import com.smartoutlet.product.api.dto.ProductRequest;
import com.smartoutlet.product.api.dto.ProductResponse;
import com.smartoutlet.product.api.dto.StockUpdateRequest;
import com.smartoutlet.product.application.service.ProductApplicationService;
import com.smartoutlet.product.entity.Product;
import com.smartoutlet.product.exception.ProductNotFoundException;
import com.smartoutlet.product.exception.ProductAlreadyExistsException;
import com.smartoutlet.product.repository.ProductRepository;
import com.smartoutlet.product.domain.event.ProductEvent;
import com.smartoutlet.product.domain.event.StockEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductApplicationServiceImpl implements ProductApplicationService {
    
    private final ProductRepository productRepository;
    // private final ProductEventProducer eventProducer; // Temporarily commented out
    
    @Override
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating product with SKU: {}", request.getSku());
        
        // Check if product with SKU already exists
        if (productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Product with SKU " + request.getSku() + " already exists");
        }
        
        // Create product entity
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(request.getCategory());
        product.setIsActive(true);
        
        Product savedProduct = productRepository.save(product);
        
        // Publish event - temporarily commented out
        /*
        ProductEvent event = ProductEvent.builder()
                .eventType("PRODUCT_CREATED")
                .productId(savedProduct.getId())
                .productName(savedProduct.getName())
                .sku(savedProduct.getSku())
                .timestamp(LocalDateTime.now())
                .build();
        
        eventProducer.publishProductCreated(event);
        */
        
        return mapToResponse(savedProduct);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToResponse(product);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
        return mapToResponse(product);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        
        Product updatedProduct = productRepository.save(product);
        
        // Publish event
        ProductEvent event = ProductEvent.builder()
                .eventType("PRODUCT_UPDATED")
                .productId(updatedProduct.getId())
                .productName(updatedProduct.getName())
                .sku(updatedProduct.getSku())
                .timestamp(LocalDateTime.now())
                .build();
        
        // eventProducer.publishProductUpdated(event); // Temporarily commented out
        
        return mapToResponse(updatedProduct);
    }
    
    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        productRepository.delete(product);
        
        // Publish event
        ProductEvent event = ProductEvent.builder()
                .eventType("PRODUCT_DELETED")
                .productId(product.getId())
                .productName(product.getName())
                .sku(product.getSku())
                .timestamp(LocalDateTime.now())
                .build();
        
        // eventProducer.publishProductDeleted(event); // Temporarily commented out
    }
    
    @Override
    public ProductResponse updateStock(Long id, StockUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        Integer previousStock = product.getStockQuantity();
        product.setStockQuantity(request.getNewStockQuantity());
        
        Product updatedProduct = productRepository.save(product);
        
        // Publish stock event
        StockEvent event = StockEvent.builder()
                .eventType("STOCK_UPDATED")
                .productId(updatedProduct.getId())
                .productName(updatedProduct.getName())
                .sku(updatedProduct.getSku())
                .currentStock(updatedProduct.getStockQuantity())
                .previousStock(previousStock)
                .changeAmount(updatedProduct.getStockQuantity() - previousStock)
                .changeType(updatedProduct.getStockQuantity() > previousStock ? "INCREASE" : "DECREASE")
                .timestamp(LocalDateTime.now())
                .reason(request.getReason())
                .build();
        
        // eventProducer.publishStockUpdated(event); // Temporarily commented out
        
        // Check for low stock or out of stock alerts
        if (updatedProduct.isOutOfStock()) {
            StockEvent outOfStockEvent = StockEvent.builder()
                    .eventType("OUT_OF_STOCK_ALERT")
                    .productId(updatedProduct.getId())
                    .productName(updatedProduct.getName())
                    .sku(updatedProduct.getSku())
                    .currentStock(updatedProduct.getStockQuantity())
                    .timestamp(LocalDateTime.now())
                    .build();
            // eventProducer.publishOutOfStockAlert(outOfStockEvent); // Temporarily commented out
        } else if (updatedProduct.isLowStock()) {
            StockEvent lowStockEvent = StockEvent.builder()
                    .eventType("LOW_STOCK_ALERT")
                    .productId(updatedProduct.getId())
                    .productName(updatedProduct.getName())
                    .sku(updatedProduct.getSku())
                    .currentStock(updatedProduct.getStockQuantity())
                    .timestamp(LocalDateTime.now())
                    .build();
            // eventProducer.publishLowStockAlert(lowStockEvent); // Temporarily commented out
        }
        
        return mapToResponse(updatedProduct);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query) {
        return productRepository.searchProducts(query).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts(Integer threshold) {
        return productRepository.findLowStockProducts(threshold).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .sku(product.getSku())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
} 