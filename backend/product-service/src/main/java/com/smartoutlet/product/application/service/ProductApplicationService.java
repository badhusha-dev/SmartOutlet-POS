package com.smartoutlet.product.application.service;

import com.smartoutlet.product.api.dto.ProductRequest;
import com.smartoutlet.product.api.dto.ProductResponse;
import com.smartoutlet.product.api.dto.StockUpdateRequest;
import java.util.List;

public interface ProductApplicationService {
    
    ProductResponse createProduct(ProductRequest request);
    
    ProductResponse getProductById(Long id);
    
    ProductResponse getProductBySku(String sku);
    
    List<ProductResponse> getAllProducts();
    
    List<ProductResponse> getProductsByCategory(Long categoryId);
    
    ProductResponse updateProduct(Long id, ProductRequest request);
    
    void deleteProduct(Long id);
    
    ProductResponse updateStock(Long id, StockUpdateRequest request);
    
    List<ProductResponse> searchProducts(String query);
    
    List<ProductResponse> getLowStockProducts(Integer threshold);
    
    List<ProductResponse> getOutOfStockProducts();
} 