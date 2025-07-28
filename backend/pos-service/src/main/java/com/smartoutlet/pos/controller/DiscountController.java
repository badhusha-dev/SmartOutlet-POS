package com.smartoutlet.pos.controller;

import com.smartoutlet.common.dto.ApiResponseDTO;
import com.smartoutlet.common.security.annotations.RequirePermission;
import com.smartoutlet.pos.dto.DiscountDto;
import com.smartoutlet.pos.service.DiscountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/discounts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Discounts", description = "Discount management endpoints")
public class DiscountController {

    private final DiscountService discountService;

    @PostMapping
    @Operation(summary = "Create a new discount", description = "Create a new discount code or promotion")
    @RequirePermission("discount:create")
    public ResponseEntity<ApiResponseDTO<DiscountDto>> createDiscount(@RequestBody DiscountDto discountDto) {
        log.info("Creating new discount: {}", discountDto.getDiscountCode());
        DiscountDto createdDiscount = discountService.createDiscount(discountDto);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount created successfully", createdDiscount));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get discount by ID", description = "Retrieve a specific discount by its ID")
    @RequirePermission("discount:read")
    public ResponseEntity<ApiResponseDTO<DiscountDto>> getDiscountById(
            @Parameter(description = "Discount ID", example = "1")
            @PathVariable Long id) {
        log.info("Fetching discount with ID: {}", id);
        DiscountDto discount = discountService.getDiscountById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount retrieved successfully", discount));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get discount by code", description = "Retrieve a discount by its code")
    @RequirePermission("discount:read")
    public ResponseEntity<ApiResponseDTO<DiscountDto>> getDiscountByCode(
            @Parameter(description = "Discount code", example = "SAVE20")
            @PathVariable String code) {
        log.info("Fetching discount with code: {}", code);
        DiscountDto discount = discountService.getDiscountByCode(code);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount retrieved successfully", discount));
    }

    @GetMapping
    @Operation(summary = "Get all discounts", description = "Retrieve all available discounts")
    @RequirePermission("discount:read")
    public ResponseEntity<ApiResponseDTO<List<DiscountDto>>> getAllDiscounts() {
        log.info("Fetching all discounts");
        List<DiscountDto> discounts = discountService.getAllDiscounts();
        return ResponseEntity.ok(ApiResponseDTO.success("All discounts retrieved successfully", discounts));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active discounts", description = "Retrieve all currently active discounts")
    @RequirePermission("discount:read")
    public ResponseEntity<ApiResponseDTO<List<DiscountDto>>> getActiveDiscounts() {
        log.info("Fetching active discounts");
        List<DiscountDto> discounts = discountService.getActiveDiscounts();
        return ResponseEntity.ok(ApiResponseDTO.success("Active discounts retrieved successfully", discounts));
    }

    @GetMapping("/valid")
    @Operation(summary = "Get valid discounts", description = "Retrieve all valid and applicable discounts")
    @RequirePermission("discount:read")
    public ResponseEntity<ApiResponseDTO<List<DiscountDto>>> getValidDiscounts() {
        log.info("Fetching valid discounts");
        List<DiscountDto> discounts = discountService.getValidDiscounts();
        return ResponseEntity.ok(ApiResponseDTO.success("Valid discounts retrieved successfully", discounts));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update discount", description = "Update an existing discount")
    @RequirePermission("discount:update")
    public ResponseEntity<ApiResponseDTO<DiscountDto>> updateDiscount(
            @Parameter(description = "Discount ID", example = "1")
            @PathVariable Long id,
            @RequestBody DiscountDto discountDto) {
        log.info("Updating discount with ID: {}", id);
        DiscountDto updatedDiscount = discountService.updateDiscount(id, discountDto);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount updated successfully", updatedDiscount));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete discount", description = "Delete a discount")
    @RequirePermission("discount:delete")
    public ResponseEntity<ApiResponseDTO<Void>> deleteDiscount(
            @Parameter(description = "Discount ID", example = "1")
            @PathVariable Long id) {
        log.info("Deleting discount with ID: {}", id);
        discountService.deleteDiscount(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount deleted successfully", null));
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate discount", description = "Activate a discount")
    @RequirePermission("discount:update")
    public ResponseEntity<ApiResponseDTO<DiscountDto>> activateDiscount(
            @Parameter(description = "Discount ID", example = "1")
            @PathVariable Long id) {
        log.info("Activating discount with ID: {}", id);
        DiscountDto activatedDiscount = discountService.activateDiscount(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount activated successfully", activatedDiscount));
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate discount", description = "Deactivate a discount")
    @RequirePermission("discount:update")
    public ResponseEntity<ApiResponseDTO<DiscountDto>> deactivateDiscount(
            @Parameter(description = "Discount ID", example = "1")
            @PathVariable Long id) {
        log.info("Deactivating discount with ID: {}", id);
        DiscountDto deactivatedDiscount = discountService.deactivateDiscount(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount deactivated successfully", deactivatedDiscount));
    }

    @PostMapping("/apply")
    @Operation(summary = "Apply discount", description = "Apply a discount code to a transaction")
    @RequirePermission("discount:read")
    public ResponseEntity<ApiResponseDTO<DiscountDto>> applyDiscount(
            @Parameter(description = "Discount code", example = "SAVE20")
            @RequestParam String code) {
        log.info("Applying discount code: {}", code);
        DiscountDto appliedDiscount = discountService.applyDiscount(code);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount applied successfully", appliedDiscount));
    }

    @GetMapping("/applicable")
    @Operation(summary = "Get applicable discounts", description = "Get discounts applicable to specific products or categories")
    @RequirePermission("discount:read")
    public ResponseEntity<ApiResponseDTO<List<DiscountDto>>> getApplicableDiscounts(
            @Parameter(description = "Product IDs (comma-separated)", example = "1,2,3")
            @RequestParam(required = false) String productIds,
            @Parameter(description = "Category IDs (comma-separated)", example = "1,2")
            @RequestParam(required = false) String categoryIds) {
        log.info("Fetching applicable discounts for products: {}, categories: {}", productIds, categoryIds);
        List<DiscountDto> discounts = discountService.getApplicableDiscounts(productIds, categoryIds);
        return ResponseEntity.ok(ApiResponseDTO.success("Applicable discounts retrieved successfully", discounts));
    }

    @GetMapping("/validate/{code}")
    @Operation(summary = "Validate discount", description = "Check if a discount code is valid")
    @RequirePermission("discount:read")
    public ResponseEntity<ApiResponseDTO<Boolean>> validateDiscount(
            @Parameter(description = "Discount code", example = "SAVE20")
            @PathVariable String code) {
        log.info("Validating discount code: {}", code);
        boolean isValid = discountService.validateDiscount(code);
        return ResponseEntity.ok(ApiResponseDTO.success("Discount validation completed", isValid));
    }
}