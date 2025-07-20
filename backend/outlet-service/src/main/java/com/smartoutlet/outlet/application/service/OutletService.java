package com.smartoutlet.outlet.application.service;

import com.smartoutlet.outlet.infrastructure.config.KafkaConfig;
import com.smartoutlet.outlet.api.dto.*;
import com.smartoutlet.outlet.domain.model.Outlet;
import com.smartoutlet.outlet.domain.model.StaffAssignment;
import com.smartoutlet.outlet.domain.event.OutletEvent;
import com.smartoutlet.outlet.infrastructure.config.OutletNotFoundException;
import com.smartoutlet.outlet.infrastructure.config.OutletAlreadyExistsException;
import com.smartoutlet.outlet.infrastructure.persistence.OutletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OutletService {
    
    private final OutletRepository outletRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public OutletResponse createOutlet(OutletRequest request) {
        log.info("Creating outlet: {}", request.getName());
        
        // Check if outlet with the same name already exists
        if (outletRepository.findByName(request.getName()).isPresent()) {
            throw new OutletAlreadyExistsException("Outlet with name '" + request.getName() + "' already exists");
        }
        
        Outlet outlet = new Outlet();
        outlet.setName(request.getName());
        outlet.setDescription(request.getDescription());
        outlet.setAddress(request.getAddress());
        outlet.setCity(request.getCity());
        outlet.setState(request.getState());
        outlet.setPostalCode(request.getPostalCode());
        outlet.setCountry(request.getCountry());
        outlet.setPhoneNumber(request.getPhoneNumber());
        outlet.setEmail(request.getEmail());
        outlet.setManagerId(request.getManagerId());
        outlet.setManagerName(request.getManagerName());
        outlet.setOpeningHours(request.getOpeningHours());
        outlet.setIsActive(request.getIsActive());
        
        Outlet savedOutlet = outletRepository.save(outlet);
        
        // Publish outlet creation event to Kafka
        publishOutletEvent("CREATED", savedOutlet);
        
        log.info("Outlet created successfully: {}", savedOutlet.getName());
        return convertToOutletResponse(savedOutlet);
    }
    
    @Transactional(readOnly = true)
    public OutletResponse getOutletById(Long id) {
        Outlet outlet = outletRepository.findByIdWithStaff(id)
                .orElseThrow(() -> new OutletNotFoundException("Outlet not found with id: " + id));
        
        return convertToOutletResponse(outlet);
    }
    
    @Transactional(readOnly = true)
    public Page<OutletResponse> getAllOutlets(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Outlet> outlets = outletRepository.findAll(pageable);
        
        return outlets.map(this::convertToOutletResponse);
    }
    
    @Transactional(readOnly = true)
    public List<OutletResponse> getActiveOutlets() {
        List<Outlet> outlets = outletRepository.findByIsActiveTrue();
        return outlets.stream()
                .map(this::convertToOutletResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<OutletResponse> searchOutlets(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Outlet> outlets = outletRepository.findByKeyword(keyword, pageable);
        return outlets.map(this::convertToOutletResponse);
    }
    
    public OutletResponse updateOutlet(Long id, OutletRequest request) {
        log.info("Updating outlet: {}", id);
        
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new OutletNotFoundException("Outlet not found with id: " + id));
        
        outlet.setName(request.getName());
        outlet.setDescription(request.getDescription());
        outlet.setAddress(request.getAddress());
        outlet.setCity(request.getCity());
        outlet.setState(request.getState());
        outlet.setPostalCode(request.getPostalCode());
        outlet.setCountry(request.getCountry());
        outlet.setPhoneNumber(request.getPhoneNumber());
        outlet.setEmail(request.getEmail());
        outlet.setManagerId(request.getManagerId());
        outlet.setManagerName(request.getManagerName());
        outlet.setOpeningHours(request.getOpeningHours());
        outlet.setIsActive(request.getIsActive());
        
        Outlet updatedOutlet = outletRepository.save(outlet);
        
        // Publish outlet update event to Kafka
        publishOutletEvent("UPDATED", updatedOutlet);
        
        log.info("Outlet updated successfully: {}", updatedOutlet.getName());
        return convertToOutletResponse(updatedOutlet);
    }
    
    public void deleteOutlet(Long id) {
        log.info("Deleting outlet: {}", id);
        
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new OutletNotFoundException("Outlet not found with id: " + id));
        
        // Soft delete by marking as inactive
        outlet.setIsActive(false);
        outletRepository.save(outlet);
        
        // Publish outlet deletion event to Kafka
        publishOutletEvent("DELETED", outlet);
        
        log.info("Outlet deleted successfully: {}", outlet.getName());
    }
    
    @Transactional(readOnly = true)
    public List<OutletResponse> getOutletsByManagerId(Long managerId) {
        List<Outlet> outlets = outletRepository.findByManagerId(managerId);
        return outlets.stream()
                .map(this::convertToOutletResponse)
                .collect(Collectors.toList());
    }
    
    private void publishOutletEvent(String eventType, Outlet outlet) {
        try {
            String location = String.format("%s, %s", outlet.getAddress(), outlet.getCity());
            OutletEvent event = new OutletEvent(
                    eventType,
                    outlet.getId(),
                    outlet.getName(),
                    location,
                    outlet.getManagerId(),
                    outlet.getManagerName(),
                    outlet.getIsActive()
            );
            
            kafkaTemplate.send(KafkaConfig.OUTLET_EVENTS_TOPIC, event);
            log.info("Published outlet event: {} for outlet: {}", eventType, outlet.getName());
        } catch (Exception e) {
            log.error("Failed to publish outlet event: {}", e.getMessage(), e);
        }
    }
    
    private OutletResponse convertToOutletResponse(Outlet outlet) {
        OutletResponse response = new OutletResponse();
        response.setId(outlet.getId());
        response.setName(outlet.getName());
        response.setDescription(outlet.getDescription());
        response.setAddress(outlet.getAddress());
        response.setCity(outlet.getCity());
        response.setState(outlet.getState());
        response.setPostalCode(outlet.getPostalCode());
        response.setCountry(outlet.getCountry());
        response.setPhoneNumber(outlet.getPhoneNumber());
        response.setEmail(outlet.getEmail());
        response.setManagerId(outlet.getManagerId());
        response.setManagerName(outlet.getManagerName());
        response.setIsActive(outlet.getIsActive());
        response.setOpeningHours(outlet.getOpeningHours());
        response.setCreatedAt(outlet.getCreatedAt());
        response.setUpdatedAt(outlet.getUpdatedAt());
        
        if (outlet.getStaffAssignments() != null) {
            List<StaffAssignmentResponse> staffResponses = outlet.getStaffAssignments().stream()
                    .filter(StaffAssignment::getIsActive)
                    .map(this::convertToStaffAssignmentResponse)
                    .collect(Collectors.toList());
            response.setStaffAssignments(staffResponses);
        }
        
        return response;
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