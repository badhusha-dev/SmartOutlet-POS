package com.smartoutlet.product.application.service;

import com.smartoutlet.product.api.dto.*;
import com.smartoutlet.product.domain.model.Product;
import com.smartoutlet.product.domain.model.Category;
import com.smartoutlet.product.infrastructure.config.ProductNotFoundException;
import com.smartoutlet.product.infrastructure.config.ProductAlreadyExistsException;
import com.smartoutlet.product.infrastructure.persistence.ProductRepository;
import com.smartoutlet.product.infrastructure.persistence.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Product Service Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private Category testCategory;
    private ProductRequest productRequest;

    @BeforeEach
    void setUp() {
        // Setup test category
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Test Category");
        testCategory.setDescription("Test Description");
        testCategory.setIsActive(true);
        testCategory.setCreatedAt(LocalDateTime.now());

        // Setup test product
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setDescription("Test Description");
        testProduct.setSku("TEST-001");
        testProduct.setBarcode("1234567890123");
        testProduct.setPrice(BigDecimal.valueOf(10.99));
        testProduct.setCost(BigDecimal.valueOf(5.99));
        testProduct.setCategory(testCategory);
        testProduct.setStockQuantity(100);
        testProduct.setMinStockLevel(10);
        testProduct.setIsActive(true);
        testProduct.setCreatedAt(LocalDateTime.now());
        testProduct.setUpdatedAt(LocalDateTime.now());

        // Setup test request
        productRequest = ProductRequest.builder()
                .name("New Product")
                .description("New Description")
                .sku("NEW-001")
                .barcode("9876543210987")
                .price(BigDecimal.valueOf(15.99))
                .cost(BigDecimal.valueOf(8.99))
                .categoryId(1L)
                .stockQuantity(50)
                .minStockLevel(5)
                .build();
    }

    @Test
    @DisplayName("Should create product successfully")
    void shouldCreateProductSuccessfully() {
        // Given
        when(productRepository.findBySku("NEW-001")).thenReturn(Optional.empty());
        when(productRepository.findByBarcode("9876543210987")).thenReturn(Optional.empty());
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        ProductResponse result = productService.createProduct(productRequest);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Product", result.getName());
        assertEquals("Test Description", result.getDescription());
        assertTrue(result.getIsActive());

        verify(productRepository).findBySku("NEW-001");
        verify(productRepository).findByBarcode("9876543210987");
        verify(categoryRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
        verify(kafkaTemplate).send(eq("product-events"), any());
    }

    @Test
    @DisplayName("Should throw ProductAlreadyExistsException when SKU exists")
    void shouldThrowProductAlreadyExistsExceptionWhenSkuExists() {
        // Given
        when(productRepository.findBySku("NEW-001")).thenReturn(Optional.of(testProduct));

        // When & Then
        assertThrows(ProductAlreadyExistsException.class, () -> {
            productService.createProduct(productRequest);
        });

        verify(productRepository).findBySku("NEW-001");
        verify(productRepository, never()).save(any(Product.class));
        verify(kafkaTemplate, never()).send(anyString(), any());
    }

    @Test
    @DisplayName("Should throw ProductAlreadyExistsException when barcode exists")
    void shouldThrowProductAlreadyExistsExceptionWhenBarcodeExists() {
        // Given
        when(productRepository.findBySku("NEW-001")).thenReturn(Optional.empty());
        when(productRepository.findByBarcode("9876543210987")).thenReturn(Optional.of(testProduct));

        // When & Then
        assertThrows(ProductAlreadyExistsException.class, () -> {
            productService.createProduct(productRequest);
        });

        verify(productRepository).findBySku("NEW-001");
        verify(productRepository).findByBarcode("9876543210987");
        verify(productRepository, never()).save(any(Product.class));
        verify(kafkaTemplate, never()).send(anyString(), any());
    }

    @Test
    @DisplayName("Should get product by ID successfully")
    void shouldGetProductByIdSuccessfully() {
        // Given
        Long productId = 1L;
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // When
        ProductResponse result = productService.getProductById(productId);

        // Then
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Test Product", result.getName());
        assertEquals("Test Description", result.getDescription());

        verify(productRepository).findById(productId);
    }

    @Test
    @DisplayName("Should throw ProductNotFoundException when product not found by ID")
    void shouldThrowProductNotFoundExceptionWhenNotFoundById() {
        // Given
        Long productId = 999L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ProductNotFoundException.class, () -> {
            productService.getProductById(productId);
        });

        verify(productRepository).findById(productId);
    }

    @Test
    @DisplayName("Should get all products successfully")
    void shouldGetAllProductsSuccessfully() {
        // Given
        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Second Product");
        product2.setIsActive(true);

        List<Product> products = Arrays.asList(testProduct, product2);
        Page<Product> productPage = new PageImpl<>(products);
        when(productRepository.findAll(any(Pageable.class))).thenReturn(productPage);

        // When
        Page<ProductResponse> result = productService.getAllProducts(0, 10, "name", "asc");

        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals("Test Product", result.getContent().get(0).getName());
        assertEquals("Second Product", result.getContent().get(1).getName());

        verify(productRepository).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("Should update product successfully")
    void shouldUpdateProductSuccessfully() {
        // Given
        Long productId = 1L;
        ProductRequest updateRequest = ProductRequest.builder()
                .name("Updated Product")
                .description("Updated Description")
                .sku("UPD-001")
                .barcode("1111111111111")
                .price(BigDecimal.valueOf(20.99))
                .cost(BigDecimal.valueOf(10.99))
                .categoryId(1L)
                .stockQuantity(75)
                .minStockLevel(15)
                .build();

        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        ProductResponse result = productService.updateProduct(productId, updateRequest);

        // Then
        assertNotNull(result);
        verify(productRepository).findById(productId);
        verify(categoryRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
        verify(kafkaTemplate).send(eq("product-events"), any());
    }

    @Test
    @DisplayName("Should delete product successfully")
    void shouldDeleteProductSuccessfully() {
        // Given
        Long productId = 1L;
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // When
        productService.deleteProduct(productId);

        // Then
        verify(productRepository).findById(productId);
        verify(productRepository).save(any(Product.class));
        verify(kafkaTemplate).send(eq("product-events"), any());
    }

    @Test
    @DisplayName("Should search products by name successfully")
    void shouldSearchProductsByNameSuccessfully() {
        // Given
        String searchQuery = "Test";
        List<Product> products = Arrays.asList(testProduct);
        Page<Product> productPage = new PageImpl<>(products);
        when(productRepository.findByNameContainingIgnoreCaseAndIsActive(eq(searchQuery), eq(true), any(Pageable.class)))
                .thenReturn(productPage);

        // When
        Page<ProductResponse> result = productService.searchProducts(searchQuery, 0, 10, "name", "asc");

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Product", result.getContent().get(0).getName());

        verify(productRepository).findByNameContainingIgnoreCaseAndIsActive(eq(searchQuery), eq(true), any(Pageable.class));
    }

    @Test
    @DisplayName("Should get products by category successfully")
    void shouldGetProductsByCategorySuccessfully() {
        // Given
        Long categoryId = 1L;
        List<Product> products = Arrays.asList(testProduct);
        Page<Product> productPage = new PageImpl<>(products);
        when(productRepository.findByCategoryIdAndIsActive(eq(categoryId), eq(true), any(Pageable.class)))
                .thenReturn(productPage);

        // When
        Page<ProductResponse> result = productService.getProductsByCategory(categoryId, 0, 10, "name", "asc");

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Product", result.getContent().get(0).getName());

        verify(productRepository).findByCategoryIdAndIsActive(eq(categoryId), eq(true), any(Pageable.class));
    }

    @Test
    @DisplayName("Should get low stock products successfully")
    void shouldGetLowStockProductsSuccessfully() {
        // Given
        testProduct.setStockQuantity(5); // Below min stock level
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findLowStockProducts()).thenReturn(products);

        // When
        List<ProductResponse> result = productService.getLowStockProducts();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getName());

        verify(productRepository).findLowStockProducts();
    }

    @Test
    @DisplayName("Should update stock quantity successfully")
    void shouldUpdateStockQuantitySuccessfully() {
        // Given
        Long productId = 1L;
        Integer newQuantity = 150;
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        ProductResponse result = productService.updateStock(productId, newQuantity);

        // Then
        assertNotNull(result);
        verify(productRepository).findById(productId);
        verify(productRepository).save(any(Product.class));
        verify(kafkaTemplate).send(eq("product-events"), any());
    }

    @Test
    @DisplayName("Should handle category not found when creating product")
    void shouldHandleCategoryNotFoundWhenCreatingProduct() {
        // Given
        when(productRepository.findBySku("NEW-001")).thenReturn(Optional.empty());
        when(productRepository.findByBarcode("9876543210987")).thenReturn(Optional.empty());
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            productService.createProduct(productRequest);
        });

        verify(productRepository).findBySku("NEW-001");
        verify(productRepository).findByBarcode("9876543210987");
        verify(categoryRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
    }
}