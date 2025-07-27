package com.smartoutlet.pos.repository;

import com.smartoutlet.pos.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmail(String email);
    
    Optional<Customer> findByPhone(String phone);
    
    List<Customer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    
    List<Customer> findByCustomerType(Customer.CustomerType customerType);
    
    List<Customer> findByIsActiveTrue();
    
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Customer> searchCustomers(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT c FROM Customer c WHERE c.loyaltyPoints >= :minPoints ORDER BY c.loyaltyPoints DESC")
    List<Customer> findByLoyaltyPointsGreaterThanEqual(@Param("minPoints") Integer minPoints);
    
    @Query("SELECT c FROM Customer c WHERE c.totalSpent >= :minSpent ORDER BY c.totalSpent DESC")
    List<Customer> findByTotalSpentGreaterThanEqual(@Param("minSpent") Double minSpent);
    
    @Query("SELECT c FROM Customer c WHERE c.visitCount >= :minVisits ORDER BY c.visitCount DESC")
    List<Customer> findByVisitCountGreaterThanEqual(@Param("minVisits") Integer minVisits);
    
    @Query("SELECT c FROM Customer c WHERE c.createdAt >= :startDate ORDER BY c.createdAt DESC")
    List<Customer> findNewCustomers(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT c FROM Customer c WHERE c.updatedAt >= :startDate ORDER BY c.updatedAt DESC")
    List<Customer> findRecentlyUpdatedCustomers(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.customerType = :customerType")
    Long countByCustomerType(@Param("customerType") Customer.CustomerType customerType);
    
    @Query("SELECT AVG(c.totalSpent) FROM Customer c WHERE c.totalSpent > 0")
    Double getAverageCustomerSpending();
    
    @Query("SELECT SUM(c.loyaltyPoints) FROM Customer c")
    Long getTotalLoyaltyPoints();
} 