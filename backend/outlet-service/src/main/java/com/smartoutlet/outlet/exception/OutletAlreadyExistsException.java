package com.smartoutlet.outlet.exception;

public class OutletAlreadyExistsException extends RuntimeException {
    
    public OutletAlreadyExistsException(String message) {
        super(message);
    }
    
    public OutletAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}