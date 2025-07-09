package com.smartoutlet.pos.exception;

public class InvalidSaleItemException extends RuntimeException {
    public InvalidSaleItemException(String message) {
        super(message);
    }
    
    public InvalidSaleItemException(String message, Throwable cause) {
        super(message, cause);
    }
}