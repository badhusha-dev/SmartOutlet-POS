package com.smartoutlet.auth.repository;

import com.smartoutlet.auth.domain.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    
    Optional<Permission> findByName(String name);
    
    Set<Permission> findByNameIn(Set<String> names);
    
    boolean existsByName(String name);
    
    List<Permission> findByResource(String resource);
    
    List<Permission> findByAction(String action);
    
    @Query("SELECT p FROM Permission p WHERE p.isActive = true")
    Iterable<Permission> findAllActivePermissions();
    
    @Query("SELECT DISTINCT p.resource FROM Permission p ORDER BY p.resource")
    List<String> findAllDistinctResources();
    
    @Query("SELECT DISTINCT p.action FROM Permission p ORDER BY p.action")
    List<String> findAllDistinctActions();
}