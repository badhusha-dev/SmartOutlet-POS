package com.smartoutlet.recipe.controller;

import com.smartoutlet.recipe.dto.request.RecipeCreateRequest;
import com.smartoutlet.recipe.dto.request.RawMaterialCreateRequest;
import com.smartoutlet.recipe.dto.response.RecipeResponse;
import com.smartoutlet.recipe.dto.response.RawMaterialResponse;
import com.smartoutlet.recipe.entity.MaterialStatus;
import com.smartoutlet.recipe.entity.RecipeStatus;
import com.smartoutlet.recipe.entity.UnitOfMeasure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipe")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Recipe Management", description = "APIs for managing recipes, raw materials, and BOM")
public class RecipeController {
    
    // Raw Materials Management
    @GetMapping("/raw-materials")
    @PreAuthorize("hasAuthority('RECIPE_READ')")
    @Operation(summary = "Get raw materials", description = "Retrieve raw materials with filtering and pagination")
    public ResponseEntity<Page<RawMaterialResponse>> getRawMaterials(
            @RequestParam(required = false) @Parameter(description = "Category filter") String category,
            @RequestParam(required = false) @Parameter(description = "Status filter") MaterialStatus status,
            @RequestParam(required = false) @Parameter(description = "Vendor ID filter") Long vendorId,
            @RequestParam(required = false) @Parameter(description = "Search term") String search,
            @RequestParam(defaultValue = "0") @Parameter(description = "Page number") int page,
            @RequestParam(defaultValue = "20") @Parameter(description = "Page size") int size,
            @RequestParam(defaultValue = "name") @Parameter(description = "Sort field") String sortBy,
            @RequestParam(defaultValue = "asc") @Parameter(description = "Sort direction") String sortDir) {
        
        // Mock implementation - replace with actual service
        log.info("Fetching raw materials with filters - category: {}, status: {}, search: {}", 
                category, status, search);
        
        // Return mock data for now
        return ResponseEntity.ok(Page.empty());
    }
    
    @PostMapping("/raw-materials")
    @PreAuthorize("hasAuthority('RECIPE_WRITE')")
    @Operation(summary = "Create raw material", description = "Add a new raw material to the system")
    public ResponseEntity<RawMaterialResponse> createRawMaterial(
            @Valid @RequestBody RawMaterialCreateRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        
        log.info("Creating raw material: {} by user: {}", request.getName(), userId);
        
        // Mock implementation
        RawMaterialResponse response = RawMaterialResponse.builder()
                .id(1L)
                .materialCode(request.getMaterialCode())
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .unitOfMeasure(request.getUnitOfMeasure())
                .baseUnitCost(request.getBaseUnitCost())
                .currentStock(BigDecimal.ZERO)
                .status(MaterialStatus.ACTIVE)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/raw-materials/{id}")
    @PreAuthorize("hasAuthority('RECIPE_READ')")
    @Operation(summary = "Get raw material by ID", description = "Retrieve detailed information about a raw material")
    public ResponseEntity<RawMaterialResponse> getRawMaterial(
            @PathVariable @Parameter(description = "Raw material ID") Long id) {
        
        log.info("Fetching raw material with ID: {}", id);
        
        // Mock implementation
        RawMaterialResponse response = RawMaterialResponse.builder()
                .id(id)
                .materialCode("RM-001")
                .name("Premium Flour")
                .description("High-quality wheat flour for baking")
                .category("Grains")
                .unitOfMeasure(UnitOfMeasure.KILOGRAM)
                .baseUnitCost(BigDecimal.valueOf(2.50))
                .currentStock(BigDecimal.valueOf(150.0))
                .status(MaterialStatus.ACTIVE)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/raw-materials/{id}")
    @PreAuthorize("hasAuthority('RECIPE_WRITE')")
    @Operation(summary = "Update raw material", description = "Update an existing raw material")
    public ResponseEntity<RawMaterialResponse> updateRawMaterial(
            @PathVariable @Parameter(description = "Raw material ID") Long id,
            @Valid @RequestBody RawMaterialCreateRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        
        log.info("Updating raw material {} by user: {}", id, userId);
        
        // Mock implementation
        RawMaterialResponse response = RawMaterialResponse.builder()
                .id(id)
                .materialCode(request.getMaterialCode())
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .unitOfMeasure(request.getUnitOfMeasure())
                .baseUnitCost(request.getBaseUnitCost())
                .status(MaterialStatus.ACTIVE)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    // Recipes Management
    @GetMapping("/recipes")
    @PreAuthorize("hasAuthority('RECIPE_READ')")
    @Operation(summary = "Get recipes", description = "Retrieve recipes with filtering and pagination")
    public ResponseEntity<Page<RecipeResponse>> getRecipes(
            @RequestParam(required = false) @Parameter(description = "Product ID filter") Long productId,
            @RequestParam(required = false) @Parameter(description = "Status filter") RecipeStatus status,
            @RequestParam(required = false) @Parameter(description = "Search term") String search,
            @RequestParam(defaultValue = "0") @Parameter(description = "Page number") int page,
            @RequestParam(defaultValue = "20") @Parameter(description = "Page size") int size,
            @RequestParam(defaultValue = "name") @Parameter(description = "Sort field") String sortBy,
            @RequestParam(defaultValue = "asc") @Parameter(description = "Sort direction") String sortDir) {
        
        log.info("Fetching recipes with filters - productId: {}, status: {}, search: {}", 
                productId, status, search);
        
        // Return mock data for now
        return ResponseEntity.ok(Page.empty());
    }
    
    @PostMapping("/recipes")
    @PreAuthorize("hasAuthority('RECIPE_WRITE')")
    @Operation(summary = "Create recipe", description = "Create a new recipe with ingredients")
    public ResponseEntity<RecipeResponse> createRecipe(
            @Valid @RequestBody RecipeCreateRequest request,
            @RequestHeader("X-User-ID") Long userId) {
        
        log.info("Creating recipe: {} by user: {}", request.getName(), userId);
        
        // Mock implementation
        RecipeResponse response = RecipeResponse.builder()
                .id(1L)
                .productId(request.getProductId())
                .recipeCode(request.getRecipeCode())
                .name(request.getName())
                .description(request.getDescription())
                .version(1)
                .batchSize(request.getBatchSize())
                .batchUnit(request.getBatchUnit())
                .status(RecipeStatus.DRAFT)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/recipes/{id}")
    @PreAuthorize("hasAuthority('RECIPE_READ')")
    @Operation(summary = "Get recipe by ID", description = "Retrieve detailed recipe information including ingredients")
    public ResponseEntity<RecipeResponse> getRecipe(
            @PathVariable @Parameter(description = "Recipe ID") Long id) {
        
        log.info("Fetching recipe with ID: {}", id);
        
        // Mock implementation
        RecipeResponse response = RecipeResponse.builder()
                .id(id)
                .productId(1L)
                .recipeCode("RCP-001")
                .name("Classic Chocolate Cake")
                .description("Traditional chocolate cake recipe")
                .version(1)
                .batchSize(BigDecimal.valueOf(10))
                .batchUnit(UnitOfMeasure.PIECE)
                .status(RecipeStatus.ACTIVE)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    // Recipe Costing and Analysis
    @GetMapping("/recipes/{id}/cost-analysis")
    @PreAuthorize("hasAuthority('RECIPE_READ')")
    @Operation(summary = "Get recipe cost analysis", description = "Analyze recipe costs and ingredient breakdown")
    public ResponseEntity<Map<String, Object>> getRecipeCostAnalysis(
            @PathVariable @Parameter(description = "Recipe ID") Long id,
            @RequestParam(defaultValue = "1") @Parameter(description = "Batch quantity") Integer batchQuantity) {
        
        log.info("Analyzing costs for recipe {} with batch quantity: {}", id, batchQuantity);
        
        // Mock cost analysis
        Map<String, Object> costAnalysis = Map.of(
                "recipeId", id,
                "batchQuantity", batchQuantity,
                "materialCost", BigDecimal.valueOf(15.50),
                "laborCost", BigDecimal.valueOf(8.00),
                "overheadCost", BigDecimal.valueOf(3.25),
                "totalCost", BigDecimal.valueOf(26.75),
                "costPerUnit", BigDecimal.valueOf(2.68),
                "profitMargin", BigDecimal.valueOf(40.0),
                "suggestedSellingPrice", BigDecimal.valueOf(3.75)
        );
        
        return ResponseEntity.ok(costAnalysis);
    }
    
    @GetMapping("/recipes/product/{productId}/forecast")
    @PreAuthorize("hasAuthority('RECIPE_READ')")
    @Operation(summary = "Get material forecast", description = "Forecast raw material usage based on sales projections")
    public ResponseEntity<Map<String, Object>> getMaterialForecast(
            @PathVariable @Parameter(description = "Product ID") Long productId,
            @RequestParam(defaultValue = "30") @Parameter(description = "Forecast days") Integer days,
            @RequestParam(defaultValue = "100") @Parameter(description = "Expected sales quantity") Integer expectedSales) {
        
        log.info("Generating material forecast for product {} for {} days with {} expected sales", 
                productId, days, expectedSales);
        
        // Mock forecast data
        Map<String, Object> forecast = Map.of(
                "productId", productId,
                "forecastPeriodDays", days,
                "expectedSalesQuantity", expectedSales,
                "materialRequirements", List.of(
                        Map.of("materialId", 1L, "materialName", "Flour", "requiredQuantity", 50.0, "unit", "kg"),
                        Map.of("materialId", 2L, "materialName", "Sugar", "requiredQuantity", 25.0, "unit", "kg"),
                        Map.of("materialId", 3L, "materialName", "Cocoa", "requiredQuantity", 15.0, "unit", "kg")
                ),
                "totalEstimatedCost", BigDecimal.valueOf(245.50),
                "recommendedOrders", List.of(
                        Map.of("vendorId", 1L, "vendorName", "Premium Ingredients Ltd", "materials", List.of("Flour", "Sugar")),
                        Map.of("vendorId", 2L, "vendorName", "Cocoa Specialists", "materials", List.of("Cocoa"))
                )
        );
        
        return ResponseEntity.ok(forecast);
    }
    
    // Vendor Management
    @GetMapping("/vendors")
    @PreAuthorize("hasAuthority('RECIPE_READ')")
    @Operation(summary = "Get vendors", description = "Retrieve vendor list with materials they supply")
    public ResponseEntity<List<Map<String, Object>>> getVendors(
            @RequestParam(required = false) @Parameter(description = "Material ID filter") Long materialId) {
        
        log.info("Fetching vendors for material: {}", materialId);
        
        // Mock vendor data
        List<Map<String, Object>> vendors = List.of(
                Map.of(
                        "id", 1L,
                        "vendorCode", "VND-001",
                        "name", "Premium Ingredients Ltd",
                        "contactPerson", "John Smith",
                        "email", "orders@premium-ingredients.com",
                        "phone", "+1-555-0123",
                        "leadTimeDays", 5,
                        "qualityRating", 4.8,
                        "overallRating", 4.6,
                        "materialsSupplied", List.of("Flour", "Sugar", "Salt", "Baking Powder")
                ),
                Map.of(
                        "id", 2L,
                        "vendorCode", "VND-002", 
                        "name", "Cocoa Specialists",
                        "contactPerson", "Maria Garcia",
                        "email", "supply@cocoaspecialists.com",
                        "phone", "+1-555-0456",
                        "leadTimeDays", 7,
                        "qualityRating", 4.9,
                        "overallRating", 4.7,
                        "materialsSupplied", List.of("Cocoa Powder", "Chocolate Chips", "Vanilla Extract")
                )
        );
        
        return ResponseEntity.ok(vendors);
    }
    
    @GetMapping("/vendors/{vendorId}/reorder-planning")
    @PreAuthorize("hasAuthority('RECIPE_READ')")
    @Operation(summary = "Get vendor reorder planning", description = "Generate reorder recommendations for a specific vendor")
    public ResponseEntity<Map<String, Object>> getVendorReorderPlanning(
            @PathVariable @Parameter(description = "Vendor ID") Long vendorId,
            @RequestParam(defaultValue = "30") @Parameter(description = "Planning horizon days") Integer planningDays) {
        
        log.info("Generating reorder planning for vendor {} with {} days horizon", vendorId, planningDays);
        
        // Mock reorder planning
        Map<String, Object> reorderPlan = Map.of(
                "vendorId", vendorId,
                "vendorName", "Premium Ingredients Ltd",
                "planningHorizonDays", planningDays,
                "recommendedOrders", List.of(
                        Map.of(
                                "materialId", 1L,
                                "materialName", "Premium Flour",
                                "currentStock", 45.5,
                                "reorderPoint", 50.0,
                                "recommendedQuantity", 100.0,
                                "unit", "kg",
                                "estimatedCost", 250.00,
                                "urgency", "MEDIUM",
                                "expectedDeliveryDate", "2024-02-15"
                        ),
                        Map.of(
                                "materialId", 2L,
                                "materialName", "Cane Sugar",
                                "currentStock", 15.0,
                                "reorderPoint", 25.0,
                                "recommendedQuantity", 75.0,
                                "unit", "kg",
                                "estimatedCost", 112.50,
                                "urgency", "HIGH",
                                "expectedDeliveryDate", "2024-02-12"
                        )
                ),
                "totalEstimatedCost", BigDecimal.valueOf(362.50),
                "minimumOrderValue", BigDecimal.valueOf(200.00),
                "meetsMinimumOrder", true
        );
        
        return ResponseEntity.ok(reorderPlan);
    }
    
    // Utility endpoints
    @GetMapping("/units-of-measure")
    @Operation(summary = "Get units of measure", description = "Retrieve all available units of measure")
    public ResponseEntity<List<Map<String, Object>>> getUnitsOfMeasure() {
        
        List<Map<String, Object>> units = Arrays.stream(UnitOfMeasure.values())
                .map(uom -> Map.<String, Object>of(
                        "value", uom.name(),
                        "symbol", uom.getSymbol(),
                        "displayName", uom.getDisplayName(),
                        "category", uom.getCategory()
                ))
                .toList();
        
        return ResponseEntity.ok(units);
    }
    
    @GetMapping("/material-categories")
    @Operation(summary = "Get material categories", description = "Retrieve all material categories")
    public ResponseEntity<List<String>> getMaterialCategories() {
        
        List<String> categories = List.of(
                "Grains & Cereals",
                "Dairy Products", 
                "Proteins",
                "Vegetables",
                "Fruits",
                "Spices & Seasonings",
                "Oils & Fats",
                "Sweeteners",
                "Beverages",
                "Preservatives",
                "Packaging Materials",
                "Cleaning Supplies"
        );
        
        return ResponseEntity.ok(categories);
    }
}