package com.smartoutlet.product.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Product category information")
public class CategoryDto {
    
    @Schema(description = "Unique category identifier", example = "1")
    private Long id;
    
    @Schema(description = "Category name", example = "Beverages")
    private String name;
    
    @Schema(description = "Category description", example = "Hot and cold beverages including coffee, tea, and soft drinks")
    private String description;
    
    @Schema(description = "Category code", example = "BEV")
    private String code;
    
    @Schema(description = "Parent category ID (for subcategories)", example = "1")
    private Long parentId;
    
    @Schema(description = "Category level in hierarchy", example = "1")
    private Integer level;
    
    @Schema(description = "Category status", example = "ACTIVE", allowableValues = {"ACTIVE", "INACTIVE"})
    private String status;
    
    @Schema(description = "Category image URL", example = "https://example.com/images/beverages.jpg")
    private String imageUrl;
    
    @Schema(description = "Number of products in this category", example = "25")
    private Integer productCount;
    
    @Schema(description = "Sort order for display", example = "1")
    private Integer sortOrder;
    
    @Schema(description = "Category color for UI", example = "#3B82F6")
    private String color;
    
    @Schema(description = "Creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2024-01-15T14:45:00")
    private LocalDateTime updatedAt;
} 