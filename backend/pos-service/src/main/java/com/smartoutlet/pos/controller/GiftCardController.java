package com.smartoutlet.pos.controller;

import com.smartoutlet.common.dto.ApiResponseDTO;
import com.smartoutlet.common.security.annotations.RequirePermission;
import com.smartoutlet.pos.dto.GiftCardDto;
import com.smartoutlet.pos.service.GiftCardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gift-cards")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Gift Cards", description = "Gift card management endpoints")
public class GiftCardController {

    private final GiftCardService giftCardService;

    @PostMapping
    @Operation(summary = "Create a new gift card", description = "Create a new gift card with initial balance")
    @RequirePermission("giftcard:create")
    public ResponseEntity<ApiResponseDTO<GiftCardDto>> createGiftCard(@RequestBody GiftCardDto giftCardDto) {
        log.info("Creating new gift card: {}", giftCardDto.getGiftCardNumber());
        GiftCardDto createdGiftCard = giftCardService.createGiftCard(giftCardDto);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card created successfully", createdGiftCard));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get gift card by ID", description = "Retrieve a specific gift card by its ID")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<GiftCardDto>> getGiftCardById(
            @Parameter(description = "Gift card ID", example = "1")
            @PathVariable Long id) {
        log.info("Fetching gift card with ID: {}", id);
        GiftCardDto giftCard = giftCardService.getGiftCardById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card retrieved successfully", giftCard));
    }

    @GetMapping("/number/{giftCardNumber}")
    @Operation(summary = "Get gift card by number", description = "Retrieve a gift card by its number")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<GiftCardDto>> getGiftCardByNumber(
            @Parameter(description = "Gift card number", example = "GC123456789")
            @PathVariable String giftCardNumber) {
        log.info("Fetching gift card with number: {}", giftCardNumber);
        GiftCardDto giftCard = giftCardService.getGiftCardByNumber(giftCardNumber);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card retrieved successfully", giftCard));
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate gift card", description = "Validate a gift card with security code")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<GiftCardDto>> validateGiftCard(
            @Parameter(description = "Gift card number", example = "GC123456789")
            @RequestParam String giftCardNumber,
            @Parameter(description = "Security code", example = "123")
            @RequestParam String securityCode) {
        log.info("Validating gift card: {}", giftCardNumber);
        GiftCardDto giftCard = giftCardService.validateGiftCard(giftCardNumber, securityCode);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card validated successfully", giftCard));
    }

    @GetMapping
    @Operation(summary = "Get all gift cards", description = "Retrieve all available gift cards")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<List<GiftCardDto>>> getAllGiftCards() {
        log.info("Fetching all gift cards");
        List<GiftCardDto> giftCards = giftCardService.getAllGiftCards();
        return ResponseEntity.ok(ApiResponseDTO.success("All gift cards retrieved successfully", giftCards));
    }

    @GetMapping("/valid")
    @Operation(summary = "Get valid gift cards", description = "Retrieve all valid and active gift cards")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<List<GiftCardDto>>> getValidGiftCards() {
        log.info("Fetching valid gift cards");
        List<GiftCardDto> giftCards = giftCardService.getValidGiftCards();
        return ResponseEntity.ok(ApiResponseDTO.success("Valid gift cards retrieved successfully", giftCards));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get gift cards by status", description = "Retrieve gift cards by their status")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<List<GiftCardDto>>> getGiftCardsByStatus(
            @Parameter(description = "Gift card status", example = "ACTIVE")
            @PathVariable String status) {
        log.info("Fetching gift cards with status: {}", status);
        List<GiftCardDto> giftCards = giftCardService.getGiftCardsByStatus(status);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift cards retrieved successfully", giftCards));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update gift card", description = "Update an existing gift card")
    @RequirePermission("giftcard:update")
    public ResponseEntity<ApiResponseDTO<GiftCardDto>> updateGiftCard(
            @Parameter(description = "Gift card ID", example = "1")
            @PathVariable Long id,
            @RequestBody GiftCardDto giftCardDto) {
        log.info("Updating gift card with ID: {}", id);
        GiftCardDto updatedGiftCard = giftCardService.updateGiftCard(id, giftCardDto);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card updated successfully", updatedGiftCard));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete gift card", description = "Delete a gift card")
    @RequirePermission("giftcard:delete")
    public ResponseEntity<ApiResponseDTO<Void>> deleteGiftCard(
            @Parameter(description = "Gift card ID", example = "1")
            @PathVariable Long id) {
        log.info("Deleting gift card with ID: {}", id);
        giftCardService.deleteGiftCard(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card deleted successfully", null));
    }

    @PostMapping("/use")
    @Operation(summary = "Use gift card", description = "Use a gift card for payment")
    @RequirePermission("giftcard:update")
    public ResponseEntity<ApiResponseDTO<GiftCardDto>> useGiftCard(
            @Parameter(description = "Gift card number", example = "GC123456789")
            @RequestParam String giftCardNumber,
            @Parameter(description = "Amount to use", example = "50.00")
            @RequestParam Double amount) {
        log.info("Using gift card: {} for amount: {}", giftCardNumber, amount);
        GiftCardDto usedGiftCard = giftCardService.useGiftCard(giftCardNumber, amount);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card used successfully", usedGiftCard));
    }

    @PostMapping("/add-balance")
    @Operation(summary = "Add balance to gift card", description = "Add funds to an existing gift card")
    @RequirePermission("giftcard:update")
    public ResponseEntity<ApiResponseDTO<GiftCardDto>> addBalance(
            @Parameter(description = "Gift card number", example = "GC123456789")
            @RequestParam String giftCardNumber,
            @Parameter(description = "Amount to add", example = "25.00")
            @RequestParam Double amount) {
        log.info("Adding balance to gift card: {} amount: {}", giftCardNumber, amount);
        GiftCardDto updatedGiftCard = giftCardService.addBalance(giftCardNumber, amount);
        return ResponseEntity.ok(ApiResponseDTO.success("Balance added successfully", updatedGiftCard));
    }

    @GetMapping("/balance/{giftCardNumber}")
    @Operation(summary = "Get gift card balance", description = "Get the current balance of a gift card")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<Double>> getGiftCardBalance(
            @Parameter(description = "Gift card number", example = "GC123456789")
            @PathVariable String giftCardNumber) {
        log.info("Fetching balance for gift card: {}", giftCardNumber);
        Double balance = giftCardService.getGiftCardBalance(giftCardNumber);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card balance retrieved successfully", balance));
    }

    @GetMapping("/validate/{giftCardNumber}")
    @Operation(summary = "Check if gift card is valid", description = "Check if a gift card is valid and active")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<Boolean>> isGiftCardValid(
            @Parameter(description = "Gift card number", example = "GC123456789")
            @PathVariable String giftCardNumber) {
        log.info("Checking validity of gift card: {}", giftCardNumber);
        boolean isValid = giftCardService.isGiftCardValid(giftCardNumber);
        return ResponseEntity.ok(ApiResponseDTO.success("Gift card validation completed", isValid));
    }

    @GetMapping("/stats/total-balance")
    @Operation(summary = "Get total active gift card balance", description = "Get the total balance across all active gift cards")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<Double>> getTotalActiveGiftCardBalance() {
        log.info("Fetching total active gift card balance");
        Double totalBalance = giftCardService.getTotalActiveGiftCardBalance();
        return ResponseEntity.ok(ApiResponseDTO.success("Total active gift card balance retrieved successfully", totalBalance));
    }

    @GetMapping("/stats/active-count")
    @Operation(summary = "Get active gift card count", description = "Get the count of active gift cards")
    @RequirePermission("giftcard:read")
    public ResponseEntity<ApiResponseDTO<Long>> getActiveGiftCardCount() {
        log.info("Fetching active gift card count");
        Long count = giftCardService.getActiveGiftCardCount();
        return ResponseEntity.ok(ApiResponseDTO.success("Active gift card count retrieved successfully", count));
    }
}