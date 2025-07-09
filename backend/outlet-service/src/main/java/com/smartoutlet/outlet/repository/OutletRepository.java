package com.smartoutlet.outlet.repository;

import com.smartoutlet.outlet.entity.Outlet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutletRepository extends JpaRepository<Outlet, Long> {
    
    Optional<Outlet> findByName(String name);
    
    List<Outlet> findByIsActiveTrue();
    
    List<Outlet> findByCity(String city);
    
    List<Outlet> findByState(String state);
    
    List<Outlet> findByManagerId(Long managerId);
    
    @Query("SELECT o FROM Outlet o WHERE o.name LIKE %:keyword% OR o.address LIKE %:keyword% OR o.city LIKE %:keyword%")
    Page<Outlet> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT o FROM Outlet o WHERE o.isActive = :isActive")
    Page<Outlet> findByIsActive(@Param("isActive") Boolean isActive, Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Outlet o WHERE o.isActive = true")
    Long countActiveOutlets();
    
    @Query("SELECT o FROM Outlet o LEFT JOIN FETCH o.staffAssignments WHERE o.id = :id")
    Optional<Outlet> findByIdWithStaff(@Param("id") Long id);
}