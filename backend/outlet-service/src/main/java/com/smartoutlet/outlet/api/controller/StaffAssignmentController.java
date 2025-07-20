package com.smartoutlet.outlet.api.controller;

import com.smartoutlet.outlet.api.dto.ApiResponse;
import com.smartoutlet.outlet.api.dto.StaffAssignmentRequest;
import com.smartoutlet.outlet.api.dto.StaffAssignmentResponse;
import com.smartoutlet.outlet.application.service.StaffAssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/staff-assignments")
@RequiredArgsConstructor
@Tag(name = "Staff Assignment Management", description = "Staff assignment operations")
public class StaffAssignmentController {
    
    private final StaffAssignmentService staffAssignmentService;
    
    @PostMapping
    @Operation(summary = "Assign staff to outlet", description = "Assign a staff member to an outlet")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Staff assigned successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Staff already assigned")
    })
    public ResponseEntity<ApiResponse<StaffAssignmentResponse>> assignStaff(@Valid @RequestBody StaffAssignmentRequest request) {
        log.info("Assigning staff to outlet: userId={}, outletId={}", request.getUserId(), request.getOutletId());
        
        StaffAssignmentResponse assignment = staffAssignmentService.assignStaff(request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success("Staff assigned successfully", assignment)
        );
    }
    
    @GetMapping("/outlet/{outletId}")
    @Operation(summary = "Get staff by outlet", description = "Retrieve all staff assigned to an outlet")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Staff found")
    })
    public ResponseEntity<ApiResponse<List<StaffAssignmentResponse>>> getStaffByOutlet(@PathVariable Long outletId) {
        log.info("Getting staff for outlet: {}", outletId);
        
        List<StaffAssignmentResponse> staff = staffAssignmentService.getStaffByOutlet(outletId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Staff retrieved successfully", staff)
        );
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get outlets by user", description = "Retrieve all outlets assigned to a user")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Outlets found")
    })
    public ResponseEntity<ApiResponse<List<StaffAssignmentResponse>>> getOutletsByUser(@PathVariable Long userId) {
        log.info("Getting outlets for user: {}", userId);
        
        List<StaffAssignmentResponse> assignments = staffAssignmentService.getOutletsByUser(userId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Outlets retrieved successfully", assignments)
        );
    }
    
    @PutMapping("/{assignmentId}")
    @Operation(summary = "Update staff assignment", description = "Update staff assignment details")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Assignment updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    public ResponseEntity<ApiResponse<StaffAssignmentResponse>> updateAssignment(
            @PathVariable Long assignmentId, 
            @Valid @RequestBody StaffAssignmentRequest request) {
        
        log.info("Updating staff assignment: {}", assignmentId);
        
        StaffAssignmentResponse assignment = staffAssignmentService.updateAssignment(assignmentId, request);
        
        return ResponseEntity.ok(
            ApiResponse.success("Assignment updated successfully", assignment)
        );
    }
    
    @DeleteMapping("/{assignmentId}")
    @Operation(summary = "Remove staff assignment", description = "Remove staff assignment by marking as inactive")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Assignment removed successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    public ResponseEntity<ApiResponse<Void>> removeAssignment(@PathVariable Long assignmentId) {
        log.info("Removing staff assignment: {}", assignmentId);
        
        staffAssignmentService.removeAssignment(assignmentId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Assignment removed successfully")
        );
    }
    
    @GetMapping("/{assignmentId}")
    @Operation(summary = "Get assignment by ID", description = "Retrieve staff assignment details by ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Assignment found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    public ResponseEntity<ApiResponse<StaffAssignmentResponse>> getAssignmentById(@PathVariable Long assignmentId) {
        log.info("Getting assignment by ID: {}", assignmentId);
        
        StaffAssignmentResponse assignment = staffAssignmentService.getAssignmentById(assignmentId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Assignment found", assignment)
        );
    }
} 