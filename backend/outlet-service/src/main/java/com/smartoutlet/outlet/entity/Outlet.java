package com.smartoutlet.outlet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "outlets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Outlet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Outlet name is required")
    @Size(max = 100, message = "Outlet name cannot exceed 100 characters")
    @Column(name = "name", length = 100)
    private String name;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @NotBlank(message = "Address is required")
    @Column(name = "address", length = 255)
    private String address;
    
    @Column(name = "city", length = 50)
    private String city;
    
    @Column(name = "state", length = 50)
    private String state;
    
    @Column(name = "postal_code", length = 20)
    private String postalCode;
    
    @Column(name = "country", length = 50)
    private String country;
    
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "manager_id")
    private Long managerId;
    
    @Column(name = "manager_name", length = 100)
    private String managerName;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "opening_hours", length = 255)
    private String openingHours;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "outlet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<StaffAssignment> staffAssignments;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public Outlet(String name, String address, String city, String managerId) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.managerName = managerId;
    }
}