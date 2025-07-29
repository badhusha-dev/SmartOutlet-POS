package com.smartoutlet.pos.controller;

import com.smartoutlet.common.dto.ApiResponseDTO;
import com.smartoutlet.common.security.annotations.RequirePermission;
import com.smartoutlet.pos.dto.CustomerDto;
import com.smartoutlet.pos.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pos/customers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Customer Management", description = "APIs for managing customers, loyalty points, and customer search")
public class CustomerController {
    
    private final CustomerService customerService;
    
    @GetMapping
    @Operation(summary = "Get all customers", description = "Retrieve all active customers")
    @RequirePermission("customer:read")
    public ResponseEntity<ApiResponseDTO<List<CustomerDto>>> getAllCustomers() {
        List<CustomerDto> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponseDTO.success("Customers retrieved successfully", customers));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID", description = "Retrieve a specific customer by their ID")
    @RequirePermission("customer:read")
    public ResponseEntity<ApiResponseDTO<CustomerDto>> getCustomerById(@PathVariable Long id) {
        CustomerDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer retrieved successfully", customer));
    }
    
    @PostMapping
    @Operation(summary = "Create new customer", description = "Create a new customer profile")
    @RequirePermission("customer:create")
    public ResponseEntity<ApiResponseDTO<CustomerDto>> createCustomer(@RequestBody CustomerDto customerDto) {
        CustomerDto createdCustomer = customerService.createCustomer(customerDto);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer created successfully", createdCustomer));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update customer", description = "Update an existing customer profile")
    @RequirePermission("customer:update")
    public ResponseEntity<ApiResponseDTO<CustomerDto>> updateCustomer(@PathVariable Long id, @RequestBody CustomerDto customerDto) {
        CustomerDto updatedCustomer = customerService.updateCustomer(id, customerDto);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer updated successfully", updatedCustomer));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer", description = "Deactivate a customer (soft delete)")
    @RequirePermission("customer:delete")
    public ResponseEntity<ApiResponseDTO<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer deleted successfully", null));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search customers", description = "Search customers by name, email, or phone")
    @RequirePermission("customer:read")
    public ResponseEntity<ApiResponseDTO<List<CustomerDto>>> searchCustomers(@RequestParam String searchTerm) {
        List<CustomerDto> customers = customerService.searchCustomers(searchTerm);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer search completed", customers));
    }
    
    @GetMapping("/email/{email}")
    @Operation(summary = "Get customer by email", description = "Retrieve a customer by their email address")
    @RequirePermission("customer:read")
    public ResponseEntity<ApiResponseDTO<CustomerDto>> getCustomerByEmail(@PathVariable String email) {
        CustomerDto customer = customerService.getCustomerByEmail(email);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer retrieved successfully", customer));
    }
    
    @GetMapping("/phone/{phone}")
    @Operation(summary = "Get customer by phone", description = "Retrieve a customer by their phone number")
    @RequirePermission("customer:read")
    public ResponseEntity<ApiResponseDTO<CustomerDto>> getCustomerByPhone(@PathVariable String phone) {
        CustomerDto customer = customerService.getCustomerByPhone(phone);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer retrieved successfully", customer));
    }
    
    @GetMapping("/type/{customerType}")
    @Operation(summary = "Get customers by type", description = "Retrieve customers by their type (REGULAR, VIP, PREMIUM, WHOLESALE)")
    @RequirePermission("customer:read")
    public ResponseEntity<ApiResponseDTO<List<CustomerDto>>> getCustomersByType(@PathVariable String customerType) {
        List<CustomerDto> customers = customerService.getCustomersByType(customerType);
        return ResponseEntity.ok(ApiResponseDTO.success("Customers retrieved successfully", customers));
    }
    
    @PostMapping("/{id}/loyalty-points")
    @Operation(summary = "Add loyalty points", description = "Add loyalty points to a customer's account")
    @RequirePermission("customer:update")
    public ResponseEntity<ApiResponseDTO<CustomerDto>> addLoyaltyPoints(@PathVariable Long id, @RequestParam Integer points) {
        CustomerDto updatedCustomer = customerService.addLoyaltyPoints(id, points);
        return ResponseEntity.ok(ApiResponseDTO.success("Loyalty points added successfully", updatedCustomer));
    }
    
    @PostMapping("/{id}/spending")
    @Operation(summary = "Update customer spending", description = "Update customer's total spending and visit count")
    @RequirePermission("customer:update")
    public ResponseEntity<ApiResponseDTO<CustomerDto>> updateCustomerSpending(@PathVariable Long id, @RequestParam Double amount) {
        CustomerDto updatedCustomer = customerService.updateCustomerSpending(id, amount);
        return ResponseEntity.ok(ApiResponseDTO.success("Customer spending updated successfully", updatedCustomer));
    }
    
    @GetMapping("/top/spending")
    @Operation(summary = "Get top customers by spending", description = "Retrieve top customers ranked by total spending")
    @RequirePermission("customer:read")
    public ResponseEntity<ApiResponseDTO<List<CustomerDto>>> getTopCustomersBySpending(@RequestParam(defaultValue = "10") int limit) {
        List<CustomerDto> customers = customerService.getTopCustomersBySpending(limit);
        return ResponseEntity.ok(ApiResponseDTO.success("Top customers retrieved successfully", customers));
    }
    
    @GetMapping("/top/loyalty-points")
    @Operation(summary = "Get top customers by loyalty points", description = "Retrieve top customers ranked by loyalty points")
    @RequirePermission("customer:read")
    public ResponseEntity<ApiResponseDTO<List<CustomerDto>>> getTopCustomersByLoyaltyPoints(@RequestParam(defaultValue = "10") int limit) {
        List<CustomerDto> customers = customerService.getTopCustomersByLoyaltyPoints(limit);
        return ResponseEntity.ok(ApiResponseDTO.success("Top customers by loyalty points retrieved successfully", customers));
    }
} 