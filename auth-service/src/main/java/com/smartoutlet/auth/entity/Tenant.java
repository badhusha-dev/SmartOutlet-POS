package com.smartoutlet.auth.entity;

import com.smartoutlet.auth.enums.SubscriptionPlan;
import com.smartoutlet.auth.enums.TenantStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tenants")
@EntityListeners(AuditingEntityListener.class)
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tenant name is required")
    @Size(max = 255, message = "Tenant name must not exceed 255 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Tenant code is required")
    @Size(max = 50, message = "Tenant code must not exceed 50 characters")
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TenantStatus status = TenantStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_plan", nullable = false)
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.BASIC;

    @Min(value = 1, message = "Maximum outlets must be at least 1")
    @Max(value = 100, message = "Maximum outlets cannot exceed 100")
    @Column(name = "max_outlets", nullable = false)
    private Integer maxOutlets = 1;

    @Min(value = 1, message = "Maximum users must be at least 1")
    @Max(value = 1000, message = "Maximum users cannot exceed 1000")
    @Column(name = "max_users", nullable = false)
    private Integer maxUsers = 5;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> users;

    // Constructors
    public Tenant() {}

    public Tenant(String name, String code, String description, 
                 TenantStatus status, SubscriptionPlan subscriptionPlan,
                 Integer maxOutlets, Integer maxUsers) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.status = status;
        this.subscriptionPlan = subscriptionPlan;
        this.maxOutlets = maxOutlets;
        this.maxUsers = maxUsers;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TenantStatus getStatus() {
        return status;
    }

    public void setStatus(TenantStatus status) {
        this.status = status;
    }

    public SubscriptionPlan getSubscriptionPlan() {
        return subscriptionPlan;
    }

    public void setSubscriptionPlan(SubscriptionPlan subscriptionPlan) {
        this.subscriptionPlan = subscriptionPlan;
    }

    public Integer getMaxOutlets() {
        return maxOutlets;
    }

    public void setMaxOutlets(Integer maxOutlets) {
        this.maxOutlets = maxOutlets;
    }

    public Integer getMaxUsers() {
        return maxUsers;
    }

    public void setMaxUsers(Integer maxUsers) {
        this.maxUsers = maxUsers;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    // Utility Methods
    public boolean isActive() {
        return TenantStatus.ACTIVE.equals(this.status);
    }

    public boolean canAddMoreUsers(int currentUserCount) {
        return currentUserCount < this.maxUsers;
    }

    public boolean canAddMoreOutlets(int currentOutletCount) {
        return currentOutletCount < this.maxOutlets;
    }

    @Override
    public String toString() {
        return "Tenant{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", status=" + status +
                ", subscriptionPlan=" + subscriptionPlan +
                ", maxOutlets=" + maxOutlets +
                ", maxUsers=" + maxUsers +
                '}';
    }
}