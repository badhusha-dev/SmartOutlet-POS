package com.smartoutlet.outlet.controller;

import com.smartoutlet.outlet.dto.ApiResponse;
import com.smartoutlet.outlet.dto.OutletRequest;
import com.smartoutlet.outlet.dto.OutletResponse;
import com.smartoutlet.outlet.service.OutletService;
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
@RequestMapping("/outlets")
@RequiredArgsConstructor
@Tag(name = "Outlet Management", description = "Outlet CRUD operations and management")
public class OutletController {
    
    private final OutletService outletService;
    
    @PostMapping
    @Operation(summary = "Create outlet", description = "Create a new outlet")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Outlet created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Outlet already exists")
    })
    public ResponseEntity<ApiResponse<OutletResponse>> createOutlet(@Valid @RequestBody OutletRequest request) {
        log.info("Creating outlet: {}", request.getName());
        
        OutletResponse outlet = outletService.createOutlet(request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success("Outlet created successfully", outlet)
        );
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get outlet by ID", description = "Retrieve outlet details by ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Outlet found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Outlet not found")
    })
    public ResponseEntity<ApiResponse<OutletResponse>> getOutletById(@PathVariable Long id) {
        log.info("Getting outlet by ID: {}", id);
        
        OutletResponse outlet = outletService.getOutletById(id);
        
        return ResponseEntity.ok(
            ApiResponse.success("Outlet found", outlet)
        );
    }
    
    @GetMapping
    @Operation(summary = "Get all outlets", description = "Retrieve all outlets with pagination")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Outlets retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Page<OutletResponse>>> getAllOutlets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Getting all outlets - page: {}, size: {}", page, size);
        
        Page<OutletResponse> outlets = outletService.getAllOutlets(page, size, sortBy, sortDir);
        
        return ResponseEntity.ok(
            ApiResponse.success("Outlets retrieved successfully", outlets)
        );
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get active outlets", description = "Retrieve all active outlets")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active outlets retrieved successfully")
    public ResponseEntity<ApiResponse<List<OutletResponse>>> getActiveOutlets() {
        log.info("Getting active outlets");
        
        List<OutletResponse> outlets = outletService.getActiveOutlets();
        
        return ResponseEntity.ok(
            ApiResponse.success("Active outlets retrieved successfully", outlets)
        );
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search outlets", description = "Search outlets by keyword")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Outlets found")
    public ResponseEntity<ApiResponse<Page<OutletResponse>>> searchOutlets(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Searching outlets with keyword: {}", keyword);
        
        Page<OutletResponse> outlets = outletService.searchOutlets(keyword, page, size);
        
        return ResponseEntity.ok(
            ApiResponse.success("Outlets found", outlets)
        );
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update outlet", description = "Update outlet details")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Outlet updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Outlet not found")
    })
    public ResponseEntity<ApiResponse<OutletResponse>> updateOutlet(
            @PathVariable Long id, 
            @Valid @RequestBody OutletRequest request) {
        
        log.info("Updating outlet: {}", id);
        
        OutletResponse outlet = outletService.updateOutlet(id, request);
        
        return ResponseEntity.ok(
            ApiResponse.success("Outlet updated successfully", outlet)
        );
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete outlet", description = "Soft delete outlet by marking as inactive")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Outlet deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Outlet not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteOutlet(@PathVariable Long id) {
        log.info("Deleting outlet: {}", id);
        
        outletService.deleteOutlet(id);
        
        return ResponseEntity.ok(
            ApiResponse.success("Outlet deleted successfully")
        );
    }
    
    @GetMapping("/manager/{managerId}")
    @Operation(summary = "Get outlets by manager", description = "Retrieve outlets managed by a specific manager")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Outlets found")
    public ResponseEntity<ApiResponse<List<OutletResponse>>> getOutletsByManagerId(@PathVariable Long managerId) {
        log.info("Getting outlets by manager ID: {}", managerId);
        
        List<OutletResponse> outlets = outletService.getOutletsByManagerId(managerId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Outlets found", outlets)
        );
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the outlet service is running")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Service is healthy")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
            ApiResponse.success("Outlet service is running", "OK")
        );
    }
}