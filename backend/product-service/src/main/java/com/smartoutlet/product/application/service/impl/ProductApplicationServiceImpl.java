package com.smartoutlet.product.application.service.impl;

import com.smartoutlet.product.application.service.ProductApplicationService;
import com.smartoutlet.product.api.dto.ProductRequest;
import com.smartoutlet.product.api.dto.ProductResponse;
import com.smartoutlet.product.api.dto.StockUpdateRequest;
import com.smartoutlet.product.entity.Product;
import com.smartoutlet.product.entity.StockMovement;
import com.smartoutlet.product.entity.MovementType;
import com.smartoutlet.product.repository.ProductRepository;
import com.smartoutlet.product.repository.StockMovementRepository;
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
public class ProductApplicationServiceImpl implements ProductApplicationService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating product with SKU: {}", request.getSku());
        
        if (productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Product with SKU " + request.getSku() + " already exists");
        }
        
        if (request.getBarcode() != null && productRepository.existsByBarcode(request.getBarcode())) {
            throw new RuntimeException("Product with barcode " + request.getBarcode() + " already exists");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setPrice(request.getPrice());
        product.setCostPrice(request.getCostPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setBrand(request.getBrand());
        product.setSupplier(request.getSupplier());
        product.setUnitOfMeasure(request.getUnitOfMeasure());
        product.setWeight(request.getWeight());
        product.setDimensions(request.getDimensions());
        product.setImageUrl(request.getImageUrl());
        product.setTags(request.getTags());
        product.setIsActive(true);
        product.setIsTaxable(request.getIsTaxable());
        product.setTaxRate(request.getTaxRate());
        product.setMinStockLevel(request.getMinStockLevel());
        product.setMaxStockLevel(request.getMaxStockLevel());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with ID: {}", savedProduct.getId());
        
        return mapToProductResponse(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        log.info("Fetching product by ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        return mapToProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        log.info("Fetching product by SKU: {}", sku);
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
        return mapToProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        log.info("Fetching all products");
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        log.info("Fetching products by category ID: {}", categoryId);
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query) {
        log.info("Searching products with query: {}", query);
        return productRepository.findAll().stream()
                .filter(product -> product.getName().toLowerCase().contains(query.toLowerCase()) ||
                                 product.getSku().toLowerCase().contains(query.toLowerCase()))
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts(Integer threshold) {
        log.info("Fetching low stock products with threshold: {}", threshold);
        return productRepository.findAll().stream()
                .filter(product -> product.getStockQuantity() <= threshold)
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getOutOfStockProducts() {
        log.info("Fetching out of stock products");
        return productRepository.findAll().stream()
                .filter(Product::isOutOfStock)
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        log.info("Updating product with ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        // Check for SKU conflicts
        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Product with SKU " + request.getSku() + " already exists");
        }

        // Check for barcode conflicts
        if (request.getBarcode() != null && !request.getBarcode().equals(product.getBarcode()) && 
            productRepository.existsByBarcode(request.getBarcode())) {
            throw new RuntimeException("Product with barcode " + request.getBarcode() + " already exists");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setPrice(request.getPrice());
        product.setCostPrice(request.getCostPrice());
        product.setBrand(request.getBrand());
        product.setSupplier(request.getSupplier());
        product.setUnitOfMeasure(request.getUnitOfMeasure());
        product.setWeight(request.getWeight());
        product.setDimensions(request.getDimensions());
        product.setImageUrl(request.getImageUrl());
        product.setTags(request.getTags());
        product.setIsTaxable(request.getIsTaxable());
        product.setTaxRate(request.getTaxRate());
        product.setMinStockLevel(request.getMinStockLevel());
        product.setMaxStockLevel(request.getMaxStockLevel());
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);
        log.info("Product updated successfully with ID: {}", updatedProduct.getId());
        
        return mapToProductResponse(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product with ID: {}", id);
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
        log.info("Product deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional
    public ProductResponse updateStock(Long id, StockUpdateRequest request) {
        log.info("Updating stock for product ID: {} with quantity: {}", id, request.getQuantity());
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        int previousStock = product.getStockQuantity();
        int newStock = previousStock + request.getQuantity();

        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock. Available: " + previousStock + ", Requested: " + Math.abs(request.getQuantity()));
        }

        product.setStockQuantity(newStock);
        product.setUpdatedAt(LocalDateTime.now());
        Product updatedProduct = productRepository.save(product);

        // Create stock movement record
        StockMovement stockMovement = new StockMovement();
        stockMovement.setProduct(product);
        stockMovement.setQuantity(request.getQuantity());
        stockMovement.setPreviousStock(previousStock);
        stockMovement.setNewStock(newStock);
        stockMovement.setMovementType(request.getQuantity() > 0 ? MovementType.IN : MovementType.OUT);
        stockMovement.setReason(request.getReason());
        stockMovement.setReferenceType(request.getReferenceType());
        stockMovement.setReferenceId(request.getReferenceId());
        stockMovement.setOutletId(request.getOutletId());
        stockMovement.setUserId(request.getUserId());
        stockMovement.setCreatedAt(LocalDateTime.now());
        
        stockMovementRepository.save(stockMovement);

        log.info("Stock updated successfully for product ID: {}. Previous: {}, New: {}", 
                id, previousStock, newStock);
        
        return mapToProductResponse(updatedProduct);
    }

    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setSku(product.getSku());
        response.setBarcode(product.getBarcode());
        response.setPrice(product.getPrice());
        response.setCostPrice(product.getCostPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        response.setBrand(product.getBrand());
        response.setSupplier(product.getSupplier());
        response.setUnitOfMeasure(product.getUnitOfMeasure());
        response.setWeight(product.getWeight());
        response.setDimensions(product.getDimensions());
        response.setImageUrl(product.getImageUrl());
        response.setTags(product.getTags());
        response.setIsActive(product.getIsActive());
        response.setIsTaxable(product.getIsTaxable());
        response.setTaxRate(product.getTaxRate());
        response.setMinStockLevel(product.getMinStockLevel());
        response.setMaxStockLevel(product.getMaxStockLevel());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }
} 