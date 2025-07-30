package com.smartoutlet.recipe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "recipe_steps", indexes = {
    @Index(name = "idx_recipe", columnList = "recipe_id"),
    @Index(name = "idx_step_order", columnList = "recipe_id, step_order")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeStep {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;
    
    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;
    
    @Column(name = "title", length = 200, nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "temperature")
    private Integer temperature;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "temperature_unit")
    private TemperatureUnit temperatureUnit;
    
    @Column(name = "equipment", length = 500)
    private String equipment;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    @Column(name = "is_critical", nullable = false)
    @Builder.Default
    private Boolean isCritical = false;
    
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
    
    public enum TemperatureUnit {
        CELSIUS,
        FAHRENHEIT,
        KELVIN
    }
}