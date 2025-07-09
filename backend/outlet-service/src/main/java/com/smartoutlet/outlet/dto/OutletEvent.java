package com.smartoutlet.outlet.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutletEvent {
    
    private String eventId;
    private String eventType; // CREATED, UPDATED, DELETED
    private Long outletId;
    private String outletName;
    private String outletLocation;
    private Long managerId;
    private String managerName;
    private Boolean isActive;
    private LocalDateTime eventTimestamp;
    private String source = "outlet-service";
    
    public OutletEvent(String eventType, Long outletId, String outletName, 
                      String outletLocation, Long managerId, String managerName, Boolean isActive) {
        this.eventId = java.util.UUID.randomUUID().toString();
        this.eventType = eventType;
        this.outletId = outletId;
        this.outletName = outletName;
        this.outletLocation = outletLocation;
        this.managerId = managerId;
        this.managerName = managerName;
        this.isActive = isActive;
        this.eventTimestamp = LocalDateTime.now();
    }
}