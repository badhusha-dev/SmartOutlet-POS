package com.smartoutlet.pos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "customers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true)
    private String email;
    
    @Column
    private String phone;
    
    @Column
    private String address;
    
    @Column
    private String city;
    
    @Column
    private String state;
    
    @Column
    private String zipCode;
    
    @Column
    private String country;
    
    @Column(name = "loyalty_points", nullable = false)
    @Builder.Default
    private Integer loyaltyPoints = 0;
    
    @Column(name = "total_spent", nullable = false)
    @Builder.Default
    private Double totalSpent = 0.0;
    
    @Column(name = "visit_count", nullable = false)
    @Builder.Default
    private Integer visitCount = 0;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "customer_type")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CustomerType customerType = CustomerType.REGULAR;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;
    
    public enum CustomerType {
        REGULAR, VIP, PREMIUM, WHOLESALE
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public void addLoyaltyPoints(Integer points) {
        this.loyaltyPoints += points;
    }
    
    public void addToTotalSpent(Double amount) {
        this.totalSpent += amount;
        this.visitCount++;
    }
} 