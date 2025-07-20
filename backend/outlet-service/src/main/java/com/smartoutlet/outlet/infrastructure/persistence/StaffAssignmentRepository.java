package com.smartoutlet.outlet.infrastructure.persistence;

import com.smartoutlet.outlet.domain.model.StaffAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffAssignmentRepository extends JpaRepository<StaffAssignment, Long> {
    
    List<StaffAssignment> findByOutletId(Long outletId);
    
    List<StaffAssignment> findByUserId(Long userId);
    
    List<StaffAssignment> findByOutletIdAndIsActiveTrue(Long outletId);
    
    List<StaffAssignment> findByUserIdAndIsActiveTrue(Long userId);
    
    Optional<StaffAssignment> findByUserIdAndOutletId(Long userId, Long outletId);
    
    @Query("SELECT sa FROM StaffAssignment sa WHERE sa.outlet.id = :outletId AND sa.isActive = true")
    List<StaffAssignment> findActiveStaffByOutletId(@Param("outletId") Long outletId);
    
    @Query("SELECT COUNT(sa) FROM StaffAssignment sa WHERE sa.outlet.id = :outletId AND sa.isActive = true")
    Long countActiveStaffByOutletId(@Param("outletId") Long outletId);
    
    Boolean existsByUserIdAndOutletIdAndIsActiveTrue(Long userId, Long outletId);
}