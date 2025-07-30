package com.smartoutlet.auth.repository;

import com.smartoutlet.auth.domain.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Optional<Role> findByName(String name);
    
    Set<Role> findByNameIn(Set<String> names);
    
    boolean existsByName(String name);
    
    @Query("SELECT r FROM Role r WHERE r.isActive = true")
    Iterable<Role> findAllActiveRoles();
    
    @Query("SELECT r FROM Role r JOIN FETCH r.permissions WHERE r.name = :name")
    Optional<Role> findByNameWithPermissions(String name);
    
    @Query("SELECT r FROM Role r WHERE r.isSystemRole = false")
    Iterable<Role> findAllNonSystemRoles();
}