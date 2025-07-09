package com.smartoutlet.auth.repository;

import com.smartoutlet.auth.entity.User;
import com.smartoutlet.auth.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameAndTenantId(String username, Long tenantId);

    Optional<User> findByEmailAndTenantId(String email, Long tenantId);

    List<User> findByTenantId(Long tenantId);

    List<User> findByRole(Role role);

    List<User> findByTenantIdAndRole(Long tenantId, Role role);

    List<User> findByIsActive(Boolean isActive);

    List<User> findByIsLocked(Boolean isLocked);

    List<User> findByTenantIdAndIsActive(Long tenantId, Boolean isActive);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsernameAndTenantId(String username, Long tenantId);

    boolean existsByEmailAndTenantId(String email, Long tenantId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.tenant.id = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.tenant.id = :tenantId AND u.isActive = true")
    long countActiveUsersByTenantId(@Param("tenantId") Long tenantId);

    @Query("SELECT u FROM User u WHERE u.tenant.id = :tenantId AND u.isActive = true AND u.isLocked = false")
    List<User> findActiveUsersByTenantId(@Param("tenantId") Long tenantId);

    @Query("SELECT u FROM User u WHERE u.failedLoginAttempts >= :maxAttempts AND u.isLocked = false")
    List<User> findUsersExceedingLoginAttempts(@Param("maxAttempts") Integer maxAttempts);

    @Query("SELECT u FROM User u WHERE u.lastLoginAt < :cutoffDate")
    List<User> findInactiveUsersSince(@Param("cutoffDate") LocalDateTime cutoffDate);

    @Modifying
    @Query("UPDATE User u SET u.isLocked = true WHERE u.failedLoginAttempts >= :maxAttempts")
    int lockUsersExceedingLoginAttempts(@Param("maxAttempts") Integer maxAttempts);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0, u.isLocked = false WHERE u.id = :userId")
    int resetUserLoginAttempts(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id = :userId")
    int updateLastLoginTime(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime);
}