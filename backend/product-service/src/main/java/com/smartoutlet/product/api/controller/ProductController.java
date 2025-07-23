package com.smartoutlet.product.api.controller;

import com.smartoutlet.product.api.dto.ApiResponseDTO;
import com.smartoutlet.product.api.dto.ProductRequest;
import com.smartoutlet.product.api.dto.ProductResponse;
import com.smartoutlet.product.application.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "Product catalog and inventory management")
public class ProductController {
    
    private final ProductService productService;
    
    @PostMapping
    @Operation(summary = "Create product", description = "Create a new product in the catalog")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Product created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Product already exists")
    })
    public ResponseEntity<ApiResponseDTO<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        log.info("Creating product: {}", request.getName());
        
        ProductResponse product = productService.createProduct(request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponseDTO.success("Product created successfully", product)
        );
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve product details by ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponseDTO<ProductResponse>> getProductById(@PathVariable Long id) {
        log.info("Getting product by ID: {}", id);
        
        ProductResponse product = productService.getProductById(id);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Product found", product)
        );
    }
    
    @GetMapping("/sku/{sku}")
    @Operation(summary = "Get product by SKU", description = "Retrieve product details by SKU")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product found")
    public ResponseEntity<ApiResponseDTO<ProductResponse>> getProductBySku(@PathVariable String sku) {
        log.info("Getting product by SKU: {}", sku);
        
        ProductResponse product = productService.getProductBySku(sku);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Product found", product)
        );
    }
    
    @GetMapping("/barcode/{barcode}")
    @Operation(summary = "Get product by barcode", description = "Retrieve product details by barcode")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product found")
    public ResponseEntity<ApiResponseDTO<ProductResponse>> getProductByBarcode(@PathVariable String barcode) {
        log.info("Getting product by barcode: {}", barcode);
        
        ProductResponse product = productService.getProductByBarcode(barcode);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Product found", product)
        );
    }
    
    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve all products with pagination")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    public ResponseEntity<ApiResponseDTO<Page<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Getting all products - page: {}, size: {}", page, size);
        
        Page<ProductResponse> products = productService.getAllProducts(page, size, sortBy, sortDir);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Products retrieved successfully", products)
        );
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get active products", description = "Retrieve all active products")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active products retrieved successfully")
    public ResponseEntity<ApiResponseDTO<List<ProductResponse>>> getActiveProducts() {
        log.info("Getting active products");
        
        List<ProductResponse> products = productService.getActiveProducts();
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Active products retrieved successfully", products)
        );
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Search products by keyword")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Products found")
    public ResponseEntity<ApiResponseDTO<Page<ProductResponse>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching products with keyword: {}", keyword);
        
        Page<ProductResponse> products = productService.searchProducts(keyword, page, size);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Products found", products)
        );
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category", description = "Retrieve products by category ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Products found")
    public ResponseEntity<ApiResponseDTO<Page<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Getting products by category: {}", categoryId);
        
        Page<ProductResponse> products = productService.getProductsByCategory(categoryId, page, size);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Products found", products)
        );
    }
    
    @GetMapping("/low-stock")
    @Operation(summary = "Get low stock products", description = "Retrieve products with low stock levels")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Low stock products found")
    public ResponseEntity<ApiResponseDTO<List<ProductResponse>>> getLowStockProducts() {
        log.info("Getting low stock products");
        
        List<ProductResponse> products = productService.getLowStockProducts();
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Low stock products found", products)
        );
    }
    
    @GetMapping("/out-of-stock")
    @Operation(summary = "Get out of stock products", description = "Retrieve products that are out of stock")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Out of stock products found")
    public ResponseEntity<ApiResponseDTO<List<ProductResponse>>> getOutOfStockProducts() {
        log.info("Getting out of stock products");
        
        List<ProductResponse> products = productService.getOutOfStockProducts();
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Out of stock products found", products)
        );
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Update product details")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponseDTO<ProductResponse>> updateProduct(
            @PathVariable Long id, 
            @Valid @RequestBody ProductRequest request) {
        
        log.info("Updating product: {}", id);
        
        ProductResponse product = productService.updateProduct(id, request);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Product updated successfully", product)
        );
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product", description = "Soft delete product by marking as inactive")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponseDTO<Void>> deleteProduct(@PathVariable Long id) {
        log.info("Deleting product: {}", id);
        
        productService.deleteProduct(id);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Product deleted successfully")
        );
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the product service is running")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Service is healthy")
    public ResponseEntity<ApiResponseDTO<String>> healthCheck() {
        return ResponseEntity.ok(
            ApiResponseDTO.success("Product service is running", "OK")
        );
    }
} 