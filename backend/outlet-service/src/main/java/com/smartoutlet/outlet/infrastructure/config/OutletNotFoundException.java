package com.smartoutlet.outlet.infrastructure.config;

public class OutletNotFoundException extends RuntimeException {
    
    public OutletNotFoundException(String message) {
        super(message);
    }
    
    public OutletNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}