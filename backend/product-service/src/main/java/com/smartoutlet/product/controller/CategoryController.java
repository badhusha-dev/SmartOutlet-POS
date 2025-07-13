package com.smartoutlet.product.controller;

import com.smartoutlet.product.dto.ApiResponseDTO;
import com.smartoutlet.product.dto.CategoryRequest;
import com.smartoutlet.product.dto.CategoryResponse;
import com.smartoutlet.product.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "Product category management")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @PostMapping
    @Operation(summary = "Create category", description = "Create a new product category")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Category created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "409", description = "Category already exists")
    })
    public ResponseEntity<ApiResponseDTO<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        log.info("Creating category: {}", request.getName());
        
        CategoryResponse category = categoryService.createCategory(request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponseDTO.success("Category created successfully", category)
        );
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Retrieve category details by ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Category found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ApiResponseDTO<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        log.info("Getting category by ID: {}", id);
        CategoryResponse category = categoryService.getCategoryById(id);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Category found", category)
        );
    }
    
    @GetMapping
    @Operation(summary = "Get all categories", description = "Retrieve all categories with pagination")
    @ApiResponse(responseCode = "200", description = "Categories retrieved successfully")
    public ResponseEntity<ApiResponseDTO<Page<CategoryResponse>>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "sortOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Getting all categories - page: {}, size: {}", page, size);
        
        Page<CategoryResponse> categories = categoryService.getAllCategories(page, size, sortBy, sortDir);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Categories retrieved successfully", categories)
        );
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get active categories", description = "Retrieve all active categories")
    @ApiResponse(responseCode = "200", description = "Active categories retrieved successfully")
    public ResponseEntity<ApiResponseDTO<List<CategoryResponse>>> getActiveCategories() {
        log.info("Getting active categories");
        
        List<CategoryResponse> categories = categoryService.getAllActiveCategories();
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Active categories retrieved successfully", categories)
        );
    }
    
    @GetMapping("/root")
    @Operation(summary = "Get root categories", description = "Retrieve top-level categories")
    @ApiResponse(responseCode = "200", description = "Root categories retrieved successfully")
    public ResponseEntity<ApiResponseDTO<List<CategoryResponse>>> getRootCategories() {
        log.info("Getting root categories");
        
        List<CategoryResponse> categories = categoryService.getRootCategories();
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Root categories retrieved successfully", categories)
        );
    }
    
    @GetMapping("/parent/{parentId}")
    @Operation(summary = "Get categories by parent", description = "Retrieve categories by parent ID")
    @ApiResponse(responseCode = "200", description = "Categories found")
    public ResponseEntity<ApiResponseDTO<List<CategoryResponse>>> getCategoriesByParent(@PathVariable Long parentId) {
        log.info("Getting categories by parent ID: {}", parentId);
        
        List<CategoryResponse> categories = categoryService.getCategoriesByParent(parentId);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Categories found", categories)
        );
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update category", description = "Update category details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Category updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ApiResponseDTO<CategoryResponse>> updateCategory(
            @PathVariable Long id, 
            @Valid @RequestBody CategoryRequest request) {
        
        log.info("Updating category: {}", id);
        
        CategoryResponse category = categoryService.updateCategory(id, request);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Category updated successfully", category)
        );
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category", description = "Soft delete category by marking as inactive")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Category deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Cannot delete category with products or subcategories"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ApiResponseDTO> deleteCategory(@PathVariable Long id) {
        log.info("Deleting category: {}", id);
        
        categoryService.deleteCategory(id);
        
        return ResponseEntity.ok(
            ApiResponseDTO.success("Category deleted successfully")
        );
    }
}