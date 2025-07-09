package com.smartoutlet.product.exception;

public class StockNotFoundException extends RuntimeException {
    public StockNotFoundException(String message) {
        super(message);
    }
    
    public StockNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}