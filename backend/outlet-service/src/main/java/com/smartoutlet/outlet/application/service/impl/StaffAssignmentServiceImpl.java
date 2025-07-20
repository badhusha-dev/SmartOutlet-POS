package com.smartoutlet.outlet.application.service.impl;

import com.smartoutlet.outlet.api.dto.StaffAssignmentRequest;
import com.smartoutlet.outlet.api.dto.StaffAssignmentResponse;
import com.smartoutlet.outlet.application.service.StaffAssignmentService;
import com.smartoutlet.outlet.domain.model.Outlet;
import com.smartoutlet.outlet.domain.model.StaffAssignment;
import com.smartoutlet.outlet.domain.event.StaffAssignmentEvent;
import com.smartoutlet.outlet.infrastructure.config.KafkaConfig;
import com.smartoutlet.outlet.infrastructure.persistence.OutletRepository;
import com.smartoutlet.outlet.infrastructure.persistence.StaffAssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class StaffAssignmentServiceImpl implements StaffAssignmentService {
    
    private final StaffAssignmentRepository staffAssignmentRepository;
    private final OutletRepository outletRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Override
    public StaffAssignmentResponse assignStaff(StaffAssignmentRequest request) {
        log.info("Assigning staff to outlet: userId={}, outletId={}", request.getUserId(), request.getOutletId());
        
        // Check if outlet exists
        Outlet outlet = outletRepository.findById(request.getOutletId())
                .orElseThrow(() -> new RuntimeException("Outlet not found with id: " + request.getOutletId()));
        
        // Check if staff is already assigned to this outlet
        if (staffAssignmentRepository.existsByUserIdAndOutletIdAndIsActiveTrue(request.getUserId(), request.getOutletId())) {
            throw new RuntimeException("Staff is already assigned to this outlet");
        }
        
        StaffAssignment assignment = new StaffAssignment();
        assignment.setUserId(request.getUserId());
        assignment.setUsername(request.getUsername());
        assignment.setUserEmail(request.getUserEmail());
        assignment.setUserFullName(request.getUserFullName());
        assignment.setOutlet(outlet);
        assignment.setRole(request.getRole());
        assignment.setIsActive(true);
        
        StaffAssignment savedAssignment = staffAssignmentRepository.save(assignment);
        
        // Publish staff assignment event to Kafka
        publishStaffAssignmentEvent("ASSIGNED", savedAssignment);
        
        log.info("Staff assigned successfully: userId={}, outletId={}", request.getUserId(), request.getOutletId());
        return convertToStaffAssignmentResponse(savedAssignment);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StaffAssignmentResponse> getStaffByOutlet(Long outletId) {
        List<StaffAssignment> assignments = staffAssignmentRepository.findActiveStaffByOutletId(outletId);
        return assignments.stream()
                .map(this::convertToStaffAssignmentResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StaffAssignmentResponse> getOutletsByUser(Long userId) {
        List<StaffAssignment> assignments = staffAssignmentRepository.findByUserIdAndIsActiveTrue(userId);
        return assignments.stream()
                .map(this::convertToStaffAssignmentResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public StaffAssignmentResponse updateAssignment(Long assignmentId, StaffAssignmentRequest request) {
        log.info("Updating staff assignment: {}", assignmentId);
        
        StaffAssignment assignment = staffAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Staff assignment not found with id: " + assignmentId));
        
        assignment.setUsername(request.getUsername());
        assignment.setUserEmail(request.getUserEmail());
        assignment.setUserFullName(request.getUserFullName());
        assignment.setRole(request.getRole());
        
        StaffAssignment updatedAssignment = staffAssignmentRepository.save(assignment);
        
        // Publish staff assignment update event to Kafka
        publishStaffAssignmentEvent("UPDATED", updatedAssignment);
        
        log.info("Staff assignment updated successfully: {}", assignmentId);
        return convertToStaffAssignmentResponse(updatedAssignment);
    }
    
    @Override
    public void removeAssignment(Long assignmentId) {
        log.info("Removing staff assignment: {}", assignmentId);
        
        StaffAssignment assignment = staffAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Staff assignment not found with id: " + assignmentId));
        
        assignment.setIsActive(false);
        staffAssignmentRepository.save(assignment);
        
        // Publish staff assignment removal event to Kafka
        publishStaffAssignmentEvent("REMOVED", assignment);
        
        log.info("Staff assignment removed successfully: {}", assignmentId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public StaffAssignmentResponse getAssignmentById(Long assignmentId) {
        StaffAssignment assignment = staffAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Staff assignment not found with id: " + assignmentId));
        
        return convertToStaffAssignmentResponse(assignment);
    }
    
    private void publishStaffAssignmentEvent(String eventType, StaffAssignment assignment) {
        try {
            StaffAssignmentEvent event = StaffAssignmentEvent.builder()
                    .eventType(eventType)
                    .assignmentId(assignment.getId())
                    .outletId(assignment.getOutlet().getId())
                    .outletName(assignment.getOutlet().getName())
                    .userId(assignment.getUserId())
                    .username(assignment.getUsername())
                    .userEmail(assignment.getUserEmail())
                    .userFullName(assignment.getUserFullName())
                    .role(assignment.getRole())
                    .isActive(assignment.getIsActive())
                    .assignedAt(assignment.getAssignedAt())
                    .timestamp(java.time.LocalDateTime.now())
                    .action(eventType.toLowerCase())
                    .performedBy("system")
                    .build();
            
            kafkaTemplate.send(KafkaConfig.STAFF_ASSIGNMENT_EVENTS_TOPIC, event);
            log.info("Published staff assignment event: {} for assignment: {}", eventType, assignment.getId());
        } catch (Exception e) {
            log.error("Failed to publish staff assignment event: {}", e.getMessage(), e);
        }
    }
    
    private StaffAssignmentResponse convertToStaffAssignmentResponse(StaffAssignment assignment) {
        return new StaffAssignmentResponse(
                assignment.getId(),
                assignment.getUserId(),
                assignment.getUsername(),
                assignment.getUserEmail(),
                assignment.getUserFullName(),
                assignment.getOutlet().getId(),
                assignment.getOutlet().getName(),
                assignment.getRole(),
                assignment.getAssignedAt(),
                assignment.getIsActive()
        );
    }
} 