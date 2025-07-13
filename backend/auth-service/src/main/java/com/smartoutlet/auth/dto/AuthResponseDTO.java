package com.smartoutlet.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    
    public AuthResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
    
    public AuthResponseDTO(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }
    
    public static <T> AuthResponseDTO<T> success(String message) {
        return new AuthResponseDTO<>(true, message);
    }
    
    public static <T> AuthResponseDTO<T> success(String message, T data) {
        return new AuthResponseDTO<>(true, message, data);
    }
    
    public static <T> AuthResponseDTO<T> error(String message) {
        return new AuthResponseDTO<>(false, message);
    }
}