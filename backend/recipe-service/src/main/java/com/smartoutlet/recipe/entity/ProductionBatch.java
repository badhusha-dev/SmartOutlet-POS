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

@Entity
@Table(name = "production_batches", indexes = {
    @Index(name = "idx_recipe", columnList = "recipe_id"),
    @Index(name = "idx_batch_number", columnList = "batch_number"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_production_date", columnList = "production_date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionBatch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;
    
    @Column(name = "batch_number", length = 100, nullable = false, unique = true)
    private String batchNumber;
    
    @Column(name = "planned_quantity", precision = 10, scale = 3, nullable = false)
    private BigDecimal plannedQuantity;
    
    @Column(name = "actual_quantity", precision = 10, scale = 3)
    private BigDecimal actualQuantity;
    
    @Column(name = "yield_percentage", precision = 5, scale = 2)
    private BigDecimal yieldPercentage;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BatchStatus status;
    
    @Column(name = "production_date", nullable = false)
    private LocalDateTime productionDate;
    
    @Column(name = "completion_date")
    private LocalDateTime completionDate;
    
    @Column(name = "quality_check_passed")
    private Boolean qualityCheckPassed;
    
    @Column(name = "quality_notes", length = 1000)
    private String qualityNotes;
    
    @Column(name = "production_cost", precision = 10, scale = 2)
    private BigDecimal productionCost;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by", length = 100)
    private String createdBy;
    
    @Column(name = "updated_by", length = 100)
    private String updatedBy;
    
    public enum BatchStatus {
        PLANNED,
        IN_PROGRESS,
        QUALITY_CHECK,
        COMPLETED,
        REJECTED,
        CANCELLED
    }
}