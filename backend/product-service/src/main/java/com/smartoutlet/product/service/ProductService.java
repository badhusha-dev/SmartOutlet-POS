package com.smartoutlet.product.service;

import com.smartoutlet.product.dto.*;
import com.smartoutlet.product.entity.Category;
import com.smartoutlet.product.entity.Product;
import com.smartoutlet.product.entity.StockMovement;
import com.smartoutlet.product.exception.ProductNotFoundException;
import com.smartoutlet.product.exception.ProductAlreadyExistsException;
import com.smartoutlet.product.exception.InsufficientStockException;
import com.smartoutlet.product.repository.CategoryRepository;
import com.smartoutlet.product.repository.ProductRepository;
import com.smartoutlet.product.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Value("${app.product.low-stock-threshold:10}")
    private Integer defaultLowStockThreshold;
    
    @Value("${app.product.enable-stock-alerts:true}")
    private Boolean enableStockAlerts;
    
    private static final String STOCK_EVENTS_TOPIC = "stock-events";
    
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating product: {}", request.getName());
        
        // Check if product with same SKU already exists
        if (productRepository.existsBySku(request.getSku())) {
            throw new ProductAlreadyExistsException("Product with SKU '" + request.getSku() + "' already exists");
        }
        
        // Check if barcode already exists (if provided)
        if (request.getBarcode() != null && productRepository.existsByBarcode(request.getBarcode())) {
            throw new ProductAlreadyExistsException("Product with barcode '" + request.getBarcode() + "' already exists");
        }
        
        Product product = new Product();
        mapRequestToProduct(request, product);
        
        Product savedProduct = productRepository.save(product);
        
        // Create initial stock movement if stock quantity > 0
        if (savedProduct.getStockQuantity() > 0) {
            createStockMovement(savedProduct, StockMovement.MovementType.IN, 
                              savedProduct.getStockQuantity(), 0, savedProduct.getStockQuantity(),
                              "Initial stock", "INITIAL_STOCK", null, null);
        }
        
        log.info("Product created successfully: {}", savedProduct.getName());
        return convertToProductResponse(savedProduct);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        
        return convertToProductResponse(product);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with SKU: " + sku));
        
        return convertToProductResponse(product);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductByBarcode(String barcode) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with barcode: " + barcode));
        
        return convertToProductResponse(product);
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productRepository.findAll(pageable);
        
        return products.map(this::convertToProductResponse);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getActiveProducts() {
        List<Product> products = productRepository.findByIsActiveTrueOrderByName();
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
        List<Product> products = productRepository.findLowStockProducts();
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
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        
        // Check if SKU is being changed and if new SKU already exists
        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySku(request.getSku())) {
            throw new ProductAlreadyExistsException("Product with SKU '" + request.getSku() + "' already exists");
        }
        
        // Check if barcode is being changed and if new barcode already exists
        if (request.getBarcode() != null && !request.getBarcode().equals(product.getBarcode()) 
            && productRepository.existsByBarcode(request.getBarcode())) {
            throw new ProductAlreadyExistsException("Product with barcode '" + request.getBarcode() + "' already exists");
        }
        
        mapRequestToProduct(request, product);
        Product updatedProduct = productRepository.save(product);
        
        log.info("Product updated successfully: {}", updatedProduct.getName());
        return convertToProductResponse(updatedProduct);
    }
    
    public ProductResponse updateStock(Long productId, StockUpdateRequest request) {
        log.info("Updating stock for product: {} with movement: {}", productId, request.getMovementType());
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));
        
        Integer previousStock = product.getStockQuantity();
        Integer newStock;
        
        switch (request.getMovementType()) {
            case IN:
                newStock = previousStock + request.getQuantity();
                break;
            case OUT:
                if (previousStock < request.getQuantity()) {
                    throw new InsufficientStockException("Insufficient stock. Available: " + previousStock + ", Requested: " + request.getQuantity());
                }
                newStock = previousStock - request.getQuantity();
                break;
            case TRANSFER:
                // For transfers, this could be either IN or OUT depending on the outlet
                // For now, treating it as OUT from current outlet
                if (previousStock < request.getQuantity()) {
                    throw new InsufficientStockException("Insufficient stock for transfer. Available: " + previousStock + ", Requested: " + request.getQuantity());
                }
                newStock = previousStock - request.getQuantity();
                break;
            default:
                throw new IllegalArgumentException("Invalid movement type: " + request.getMovementType());
        }
        
        product.setStockQuantity(newStock);
        Product updatedProduct = productRepository.save(product);
        
        // Create stock movement record
        createStockMovement(product, request.getMovementType(), request.getQuantity(),
                          previousStock, newStock, request.getReason(), request.getReferenceType(),
                          request.getOutletId(), request.getUserId());
        
        // Check and publish stock alerts
        checkAndPublishStockAlerts(updatedProduct, previousStock);
        
        log.info("Stock updated successfully for product: {} from {} to {}", 
                 product.getName(), previousStock, newStock);
        
        return convertToProductResponse(updatedProduct);
    }
    
    public void deleteProduct(Long id) {
        log.info("Deleting product: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        
        // Soft delete by marking as inactive
        product.setIsActive(false);
        productRepository.save(product);
        
        log.info("Product deleted successfully: {}", product.getName());
    }
    
    private void mapRequestToProduct(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setPrice(request.getPrice());
        product.setCostPrice(request.getCostPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setMinStockLevel(request.getMinStockLevel());
        product.setMaxStockLevel(request.getMaxStockLevel());
        product.setUnitOfMeasure(request.getUnitOfMeasure());
        product.setWeight(request.getWeight());
        product.setDimensions(request.getDimensions());
        product.setBrand(request.getBrand());
        product.setSupplier(request.getSupplier());
        product.setIsActive(request.getIsActive());
        product.setIsTaxable(request.getIsTaxable());
        product.setTaxRate(request.getTaxRate());
        product.setImageUrl(request.getImageUrl());
        product.setTags(request.getTags());
        
        // Set category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            product.setCategory(category);
        }
    }
    
    private ProductResponse convertToProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setSku(product.getSku());
        response.setBarcode(product.getBarcode());
        response.setPrice(product.getPrice());
        response.setCostPrice(product.getCostPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setMinStockLevel(product.getMinStockLevel());
        response.setMaxStockLevel(product.getMaxStockLevel());
        response.setUnitOfMeasure(product.getUnitOfMeasure());
        response.setWeight(product.getWeight());
        response.setDimensions(product.getDimensions());
        response.setBrand(product.getBrand());
        response.setSupplier(product.getSupplier());
        response.setIsActive(product.getIsActive());
        response.setIsTaxable(product.getIsTaxable());
        response.setTaxRate(product.getTaxRate());
        response.setImageUrl(product.getImageUrl());
        response.setTags(product.getTags());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }
        
        // Set calculated fields
        response.setIsLowStock(product.isLowStock());
        response.setIsOutOfStock(product.isOutOfStock());
        response.setProfitMargin(product.getProfitMargin());
        response.setStockStatus(response.getStockStatus());
        
        return response;
    }
    
    private void createStockMovement(Product product, StockMovement.MovementType movementType,
                                   Integer quantity, Integer previousStock, Integer newStock,
                                   String reason, String referenceType, Long outletId, Long userId) {
        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setMovementType(movementType);
        movement.setQuantity(quantity);
        movement.setPreviousStock(previousStock);
        movement.setNewStock(newStock);
        movement.setReason(reason);
        movement.setReferenceType(referenceType);
        movement.setOutletId(outletId);
        movement.setUserId(userId);
        
        stockMovementRepository.save(movement);
    }
    
    private void checkAndPublishStockAlerts(Product product, Integer previousStock) {
        if (!enableStockAlerts) {
            return;
        }
        
        try {
            // Check for out of stock
            if (product.isOutOfStock() && previousStock > 0) {
                publishStockEvent("OUT_OF_STOCK", product, previousStock);
            }
            // Check for low stock
            else if (product.isLowStock() && !product.isOutOfStock() && 
                     previousStock > product.getMinStockLevel()) {
                publishStockEvent("LOW_STOCK", product, previousStock);
            }
            // Stock replenished
            else if (previousStock <= product.getMinStockLevel() && product.getStockQuantity() > product.getMinStockLevel()) {
                publishStockEvent("STOCK_REPLENISHED", product, previousStock);
            }
        } catch (Exception e) {
            log.error("Failed to publish stock alert for product: {}", product.getId(), e);
        }
    }
    
    private void publishStockEvent(String eventType, Product product, Integer previousStock) {
        StockEvent event = new StockEvent(
                eventType,
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getStockQuantity(),
                product.getMinStockLevel(),
                previousStock
        );
        
        if (product.getCategory() != null) {
            event.setCategoryId(product.getCategory().getId());
            event.setCategoryName(product.getCategory().getName());
        }
        
        event.setPrice(product.getPrice());
        
        kafkaTemplate.send(STOCK_EVENTS_TOPIC, event);
        log.info("Published stock event: {} for product: {}", eventType, product.getName());
    }
}