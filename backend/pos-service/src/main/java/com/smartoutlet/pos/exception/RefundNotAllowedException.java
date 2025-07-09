package com.smartoutlet.pos.exception;

public class RefundNotAllowedException extends RuntimeException {
    public RefundNotAllowedException(String message) {
        super(message);
    }
    
    public RefundNotAllowedException(String message, Throwable cause) {
        super(message, cause);
    }
}