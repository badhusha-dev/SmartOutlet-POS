package com.smartoutlet.auth.repository;

import com.smartoutlet.auth.entity.Tenant;
import com.smartoutlet.auth.enums.SubscriptionPlan;
import com.smartoutlet.auth.enums.TenantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    Optional<Tenant> findByCode(String code);

    List<Tenant> findByStatus(TenantStatus status);

    List<Tenant> findBySubscriptionPlan(SubscriptionPlan subscriptionPlan);

    List<Tenant> findByStatusAndSubscriptionPlan(TenantStatus status, SubscriptionPlan subscriptionPlan);

    boolean existsByCode(String code);

    boolean existsByName(String name);

    @Query("SELECT t FROM Tenant t WHERE t.status = 'ACTIVE'")
    List<Tenant> findAllActiveTenants();

    @Query("SELECT COUNT(t) FROM Tenant t WHERE t.status = :status")
    long countByStatus(@Param("status") TenantStatus status);

    @Query("SELECT t FROM Tenant t WHERE t.name LIKE %:name%")
    List<Tenant> findByNameContaining(@Param("name") String name);

    @Query("SELECT t FROM Tenant t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(t.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Tenant> searchTenants(@Param("searchTerm") String searchTerm);
}