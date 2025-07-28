package com.smartoutlet.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_alerts", indexes = {
    @Index(name = "idx_product_outlet_alert", columnList = "product_id, outlet_id, alert_type"),
    @Index(name = "idx_alert_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAlert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "outlet_id", nullable = false)
    private Long outletId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false, length = 20)
    private AlertType alertType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 10)
    @Builder.Default
    private AlertPriority priority = AlertPriority.MEDIUM;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "message", length = 1000)
    private String message;
    
    @Column(name = "current_stock")
    private Integer currentStock;
    
    @Column(name = "min_stock_level")
    private Integer minStockLevel;
    
    @Column(name = "inventory_item_id")
    private Long inventoryItemId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private AlertStatus status = AlertStatus.ACTIVE;
    
    @Column(name = "acknowledged_by")
    private Long acknowledgedBy;
    
    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;
    
    @Column(name = "resolved_by")
    private Long resolvedBy;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "resolution_notes", length = 500)
    private String resolutionNotes;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Business logic methods
    public void acknowledge(Long userId) {
        if (this.status == AlertStatus.ACTIVE) {
            this.status = AlertStatus.ACKNOWLEDGED;
            this.acknowledgedBy = userId;
            this.acknowledgedAt = LocalDateTime.now();
        }
    }
    
    public void resolve(Long userId, String notes) {
        this.status = AlertStatus.RESOLVED;
        this.resolvedBy = userId;
        this.resolvedAt = LocalDateTime.now();
        this.resolutionNotes = notes;
    }
    
    public boolean isActive() {
        return this.status == AlertStatus.ACTIVE;
    }
    
    public boolean isExpired() {
        return this.alertType == AlertType.EXPIRY_WARNING || 
               this.alertType == AlertType.EXPIRY_CRITICAL;
    }
}