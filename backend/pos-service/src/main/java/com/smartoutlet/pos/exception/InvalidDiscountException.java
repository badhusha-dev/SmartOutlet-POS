package com.smartoutlet.pos.exception;

public class InvalidDiscountException extends RuntimeException {
    public InvalidDiscountException(String message) {
        super(message);
    }
    
    public InvalidDiscountException(String message, Throwable cause) {
        super(message, cause);
    }
}