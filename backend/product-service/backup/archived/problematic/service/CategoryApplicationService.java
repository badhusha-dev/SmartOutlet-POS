package com.smartoutlet.product.application.service;

import com.smartoutlet.product.api.dto.CategoryRequest;
import com.smartoutlet.product.api.dto.CategoryResponse;

import java.util.List;

public interface CategoryApplicationService {
    
    CategoryResponse createCategory(CategoryRequest request);
    
    CategoryResponse getCategoryById(Long id);
    
    List<CategoryResponse> getAllCategories();
    
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    
    void deleteCategory(Long id);
    
    List<CategoryResponse> searchCategories(String query);
} 