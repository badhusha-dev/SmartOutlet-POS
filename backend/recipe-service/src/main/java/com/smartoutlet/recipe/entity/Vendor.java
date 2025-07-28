package com.smartoutlet.recipe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vendors", indexes = {
    @Index(name = "idx_vendor_code", columnList = "vendor_code"),
    @Index(name = "idx_vendor_name", columnList = "name"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "vendor_code", nullable = false, unique = true, length = 100)
    private String vendorCode;
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "legal_name", length = 250)
    private String legalName;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "vendor_type", nullable = false, length = 50)
    @Builder.Default
    private VendorType vendorType = VendorType.SUPPLIER;
    
    @Column(name = "contact_person", length = 100)
    private String contactPerson;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "mobile", length = 20)
    private String mobile;
    
    @Column(name = "website", length = 200)
    private String website;
    
    @Column(name = "address_line1", length = 200)
    private String addressLine1;
    
    @Column(name = "address_line2", length = 200)
    private String addressLine2;
    
    @Column(name = "city", length = 100)
    private String city;
    
    @Column(name = "state", length = 100)
    private String state;
    
    @Column(name = "postal_code", length = 20)
    private String postalCode;
    
    @Column(name = "country", length = 100)
    private String country;
    
    @Column(name = "tax_id", length = 50)
    private String taxId;
    
    @Column(name = "business_license", length = 100)
    private String businessLicense;
    
    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;
    
    @Column(name = "credit_limit", precision = 12, scale = 2)
    private BigDecimal creditLimit;
    
    @Column(name = "current_balance", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentBalance = BigDecimal.ZERO;
    
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage;
    
    @Column(name = "lead_time_days")
    @Builder.Default
    private Integer leadTimeDays = 7;
    
    @Column(name = "minimum_order_value", precision = 10, scale = 2)
    private BigDecimal minimumOrderValue;
    
    @Column(name = "delivery_charges", precision = 8, scale = 2)
    private BigDecimal deliveryCharges;
    
    @Column(name = "quality_rating", precision = 3, scale = 1)
    private BigDecimal qualityRating;
    
    @Column(name = "delivery_rating", precision = 3, scale = 1)
    private BigDecimal deliveryRating;
    
    @Column(name = "service_rating", precision = 3, scale = 1)
    private BigDecimal serviceRating;
    
    @Column(name = "overall_rating", precision = 3, scale = 1)
    private BigDecimal overallRating;
    
    @Column(name = "certifications", length = 1000)
    private String certifications;
    
    @Column(name = "specialties", length = 1000)
    private String specialties;
    
    @Column(name = "preferred_delivery_days", length = 100)
    private String preferredDeliveryDays;
    
    @Column(name = "delivery_time_from", length = 10)
    private String deliveryTimeFrom;
    
    @Column(name = "delivery_time_to", length = 10)
    private String deliveryTimeTo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private VendorStatus status = VendorStatus.ACTIVE;
    
    @Column(name = "notes", length = 2000)
    private String notes;
    
    @Column(name = "last_order_date")
    private LocalDateTime lastOrderDate;
    
    @Column(name = "total_orders")
    @Builder.Default
    private Integer totalOrders = 0;
    
    @Column(name = "total_order_value", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalOrderValue = BigDecimal.ZERO;
    
    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VendorMaterial> vendorMaterials;
    
    @OneToMany(mappedBy = "primaryVendor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RawMaterial> primaryMaterials;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Business logic methods
    public boolean isActive() {
        return status == VendorStatus.ACTIVE;
    }
    
    public boolean canOrder() {
        return isActive() && 
               (creditLimit == null || currentBalance.compareTo(creditLimit) < 0);
    }
    
    public BigDecimal getAvailableCredit() {
        if (creditLimit == null) return null;
        return creditLimit.subtract(currentBalance);
    }
    
    public BigDecimal calculateOverallRating() {
        if (qualityRating == null || deliveryRating == null || serviceRating == null) {
            return null;
        }
        
        return qualityRating
                .add(deliveryRating)
                .add(serviceRating)
                .divide(BigDecimal.valueOf(3), 1, java.math.RoundingMode.HALF_UP);
    }
    
    public boolean meetsMinimumOrder(BigDecimal orderValue) {
        if (minimumOrderValue == null) return true;
        return orderValue.compareTo(minimumOrderValue) >= 0;
    }
    
    public String getFullAddress() {
        StringBuilder address = new StringBuilder();
        if (addressLine1 != null) address.append(addressLine1);
        if (addressLine2 != null) {
            if (address.length() > 0) address.append(", ");
            address.append(addressLine2);
        }
        if (city != null) {
            if (address.length() > 0) address.append(", ");
            address.append(city);
        }
        if (state != null) {
            if (address.length() > 0) address.append(", ");
            address.append(state);
        }
        if (postalCode != null) {
            if (address.length() > 0) address.append(" ");
            address.append(postalCode);
        }
        if (country != null) {
            if (address.length() > 0) address.append(", ");
            address.append(country);
        }
        return address.toString();
    }
}