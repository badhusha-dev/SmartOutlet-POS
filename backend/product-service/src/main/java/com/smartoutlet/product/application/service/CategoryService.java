package com.smartoutlet.product.application.service;

import com.smartoutlet.product.api.dto.CategoryRequest;
import com.smartoutlet.product.api.dto.CategoryResponse;
import com.smartoutlet.product.entity.Category;
import com.smartoutlet.product.repository.CategoryRepository;
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
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public CategoryResponse createCategory(CategoryRequest request) {
        log.info("Creating category: {}", request.getName());
        
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .isActive(true)
                .build();
        
        Category savedCategory = categoryRepository.save(category);
        
        return convertToCategoryResponse(savedCategory);
    }
    
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        return convertToCategoryResponse(category);
    }
    
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getAllCategories(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categories = categoryRepository.findAll(pageable);
        
        return categories.map(this::convertToCategoryResponse);
    }
    
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllActiveCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrue();
        return categories.stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CategoryResponse> getRootCategories() {
        List<Category> categories = categoryRepository.findRootCategories();
        return categories.stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByParent(Long parentId) {
        List<Category> categories = categoryRepository.findSubCategories(parentId);
        return categories.stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }
    
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        log.info("Updating category: {}", id);
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        Category updatedCategory = categoryRepository.save(category);
        
        return convertToCategoryResponse(updatedCategory);
    }
    
    public void deleteCategory(Long id) {
        log.info("Deleting category: {}", id);
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        category.setIsActive(false);
        categoryRepository.save(category);
    }
    
    private CategoryResponse convertToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
} 