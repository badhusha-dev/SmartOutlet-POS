package com.smartoutlet.product.service;

import com.smartoutlet.product.dto.CategoryRequest;
import com.smartoutlet.product.dto.CategoryResponse;
import com.smartoutlet.product.entity.Category;
import com.smartoutlet.product.exception.ProductAlreadyExistsException;
import com.smartoutlet.product.exception.ProductNotFoundException;
import com.smartoutlet.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        
        if (categoryRepository.existsByName(request.getName())) {
            throw new ProductAlreadyExistsException("Category with name '" + request.getName() + "' already exists");
        }
        
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setParentId(request.getParentId());
        category.setIsActive(request.getIsActive());
        category.setSortOrder(request.getSortOrder());
        
        Category savedCategory = categoryRepository.save(category);
        log.info("Category created successfully: {}", savedCategory.getName());
        
        return convertToCategoryResponse(savedCategory);
    }
    
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Category not found with id: " + id));
        
        return convertToCategoryResponse(category);
    }
    
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllActiveCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrueOrderBySortOrder();
        return categories.stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CategoryResponse> getRootCategories() {
        List<Category> categories = categoryRepository.findByParentIdIsNullAndIsActiveTrueOrderBySortOrder();
        return categories.stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByParent(Long parentId) {
        List<Category> categories = categoryRepository.findByParentIdOrderBySortOrder(parentId);
        return categories.stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getAllCategories(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Category> categories = categoryRepository.findAll(pageable);
        
        return categories.map(this::convertToCategoryResponse);
    }
    
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        log.info("Updating category: {}", id);
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Category not found with id: " + id));
        
        // Check if name is being changed and if new name already exists
        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new ProductAlreadyExistsException("Category with name '" + request.getName() + "' already exists");
        }
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setParentId(request.getParentId());
        category.setIsActive(request.getIsActive());
        category.setSortOrder(request.getSortOrder());
        
        Category updatedCategory = categoryRepository.save(category);
        log.info("Category updated successfully: {}", updatedCategory.getName());
        
        return convertToCategoryResponse(updatedCategory);
    }
    
    public void deleteCategory(Long id) {
        log.info("Deleting category: {}", id);
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Category not found with id: " + id));
        
        // Check if category has child categories
        if (categoryRepository.existsByParentId(id)) {
            throw new RuntimeException("Cannot delete category with subcategories");
        }
        
        // Check if category has products
        Long productCount = categoryRepository.countActiveProductsByCategoryId(id);
        if (productCount > 0) {
            throw new RuntimeException("Cannot delete category with " + productCount + " products");
        }
        
        // Soft delete by marking as inactive
        category.setIsActive(false);
        categoryRepository.save(category);
        
        log.info("Category deleted successfully: {}", category.getName());
    }
    
    private CategoryResponse convertToCategoryResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setParentId(category.getParentId());
        response.setIsActive(category.getIsActive());
        response.setSortOrder(category.getSortOrder());
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());
        
        // Get product count for this category
        Long productCount = categoryRepository.countActiveProductsByCategoryId(category.getId());
        response.setProductCount(productCount.intValue());
        
        return response;
    }
}