package com.smartoutlet.expense.util;

import lombok.extern.slf4j.Slf4j;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class StackTraceUtil {
    
    private static final Pattern FILE_NAME_PATTERN = Pattern.compile("at\\s+[^(]+\\s*\\(([^:]+):(\\d+)\\)");
    private static final Pattern LINE_NUMBER_PATTERN = Pattern.compile("at\\s+[^(]+\\s*\\([^:]+:(\\d+)\\)");
    
    /**
     * Extract file name from stack trace
     */
    public static String extractFileName(String stackTrace) {
        if (stackTrace == null || stackTrace.trim().isEmpty()) {
            return null;
        }
        
        try {
            Matcher matcher = FILE_NAME_PATTERN.matcher(stackTrace);
            if (matcher.find()) {
                String fileName = matcher.group(1);
                // Extract just the file name without the full path
                return fileName.substring(fileName.lastIndexOf('/') + 1);
            }
        } catch (Exception e) {
            log.warn("Error extracting file name from stack trace: {}", e.getMessage());
        }
        
        return null;
    }
    
    /**
     * Extract line number from stack trace
     */
    public static Integer extractLineNumber(String stackTrace) {
        if (stackTrace == null || stackTrace.trim().isEmpty()) {
            return null;
        }
        
        try {
            Matcher matcher = LINE_NUMBER_PATTERN.matcher(stackTrace);
            if (matcher.find()) {
                return Integer.parseInt(matcher.group(1));
            }
        } catch (Exception e) {
            log.warn("Error extracting line number from stack trace: {}", e.getMessage());
        }
        
        return null;
    }
    
    /**
     * Get a simplified stack trace for logging
     */
    public static String getSimplifiedStackTrace(String stackTrace) {
        if (stackTrace == null || stackTrace.trim().isEmpty()) {
            return null;
        }
        
        try {
            String[] lines = stackTrace.split("\n");
            StringBuilder simplified = new StringBuilder();
            
            // Take first 5 lines of stack trace
            int maxLines = Math.min(lines.length, 5);
            for (int i = 0; i < maxLines; i++) {
                if (lines[i].trim().startsWith("at ")) {
                    simplified.append(lines[i].trim()).append("\n");
                }
            }
            
            return simplified.toString().trim();
        } catch (Exception e) {
            log.warn("Error simplifying stack trace: {}", e.getMessage());
            return stackTrace;
        }
    }
} 