package com.smartoutlet.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "error_logs")
public class ErrorLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "error_message", columnDefinition = "TEXT", nullable = false)
    private String errorMessage;
    
    @Column(name = "error_type", length = 100)
    private String errorType;
    
    @Column(name = "action_performed", length = 200)
    private String actionPerformed;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "username", length = 50)
    private String username;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "stack_trace", columnDefinition = "TEXT")
    private String stackTrace;
    
    @Column(name = "request_url", length = 500)
    private String requestUrl;
    
    @Column(name = "request_method", length = 10)
    private String requestMethod;
    
    @Column(name = "request_body", columnDefinition = "TEXT")
    private String requestBody;
    
    @Column(name = "response_status")
    private Integer responseStatus;
    
    @Column(name = "file_name", length = 500)
    private String fileName;
    
    @Column(name = "line_number")
    private Integer lineNumber;
    
    @Column(name = "occurrence_count")
    private Integer occurrenceCount = 1;
    
    @Column(name = "first_occurrence")
    private LocalDateTime firstOccurrence;
    
    @Column(name = "last_occurrence")
    private LocalDateTime lastOccurrence;
    
    @Column(name = "is_resolved")
    private Boolean isResolved = false;
    
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        firstOccurrence = now;
        lastOccurrence = now;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        lastOccurrence = LocalDateTime.now();
    }
    
    public void incrementOccurrenceCount() {
        this.occurrenceCount = (this.occurrenceCount == null) ? 1 : this.occurrenceCount + 1;
    }
    
    public void markAsResolved(String notes) {
        this.isResolved = true;
        this.resolutionNotes = notes;
    }
} 