package com.smartoutlet.auth.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "error_logs", indexes = {
    @Index(name = "idx_error_log_type", columnList = "error_type"),
    @Index(name = "idx_error_log_action", columnList = "action_performed"),
    @Index(name = "idx_error_log_created", columnList = "created_at"),
    @Index(name = "idx_error_log_resolved", columnList = "is_resolved")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "error_message", nullable = false, length = 1000)
    private String errorMessage;
    
    @Column(name = "error_type", length = 100)
    private String errorType;
    
    @Column(name = "action_performed", length = 200)
    private String actionPerformed;
    
    @Column(name = "stack_trace", columnDefinition = "TEXT")
    private String stackTrace;
    
    @Column(name = "file_name", length = 200)
    private String fileName;
    
    @Column(name = "line_number")
    private Integer lineNumber;
    
    @Column(name = "occurrence_count")
    @Builder.Default
    private Integer occurrenceCount = 1;
    
    @Column(name = "last_occurrence")
    private LocalDateTime lastOccurrence;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "user_agent", length = 500)
    private String userAgent;
    
    @Column(name = "request_url", length = 500)
    private String requestUrl;
    
    @Column(name = "request_method", length = 10)
    private String requestMethod;
    
    @Column(name = "request_body", columnDefinition = "TEXT")
    private String requestBody;
    
    @Column(name = "response_status")
    private Integer responseStatus;
    
    @Column(name = "is_resolved")
    @Builder.Default
    private Boolean isResolved = false;
    
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "resolved_by", length = 100)
    private String resolvedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "username", length = 100)
    private String username;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public void incrementOccurrenceCount() {
        this.occurrenceCount = (this.occurrenceCount == null) ? 1 : this.occurrenceCount + 1;
    }
    
    public void markAsResolved(String resolutionNotes, String resolvedBy) {
        this.isResolved = true;
        this.resolutionNotes = resolutionNotes;
        this.resolvedBy = resolvedBy;
        this.resolvedAt = LocalDateTime.now();
    }
} 