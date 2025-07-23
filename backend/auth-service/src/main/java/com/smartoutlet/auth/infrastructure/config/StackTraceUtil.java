package com.smartoutlet.auth.infrastructure.config;

import lombok.extern.slf4j.Slf4j;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class StackTraceUtil {
    
    private static final Pattern STACK_TRACE_PATTERN = Pattern.compile(
        "at\\s+([\\w.$]+)\\.([\\w$<>]+)\\(([^:]+):(\\d+)\\)"
    );
    
    /**
     * Extract file name from stack trace
     * @param stackTrace The full stack trace string
     * @return The file name where the error occurred, or null if not found
     */
    public static String extractFileName(String stackTrace) {
        if (stackTrace == null || stackTrace.isEmpty()) {
            return null;
        }
        
        try {
            Matcher matcher = STACK_TRACE_PATTERN.matcher(stackTrace);
            if (matcher.find()) {
                String fullClassName = matcher.group(1);
                String fileName = fullClassName.substring(fullClassName.lastIndexOf('.') + 1) + ".java";
                return fileName;
            }
        } catch (Exception e) {
            log.warn("Failed to extract file name from stack trace: {}", e.getMessage());
        }
        
        return null;
    }
    
    /**
     * Extract line number from stack trace
     * @param stackTrace The full stack trace string
     * @return The line number where the error occurred, or null if not found
     */
    public static Integer extractLineNumber(String stackTrace) {
        if (stackTrace == null || stackTrace.isEmpty()) {
            return null;
        }
        
        try {
            Matcher matcher = STACK_TRACE_PATTERN.matcher(stackTrace);
            if (matcher.find()) {
                String lineNumberStr = matcher.group(4);
                return Integer.parseInt(lineNumberStr);
            }
        } catch (Exception e) {
            log.warn("Failed to extract line number from stack trace: {}", e.getMessage());
        }
        
        return null;
    }
    
    /**
     * Extract both file name and line number from stack trace
     * @param stackTrace The full stack trace string
     * @return Array containing [fileName, lineNumber] or [null, null] if not found
     */
    public static Object[] extractFileAndLine(String stackTrace) {
        if (stackTrace == null || stackTrace.isEmpty()) {
            return new Object[]{null, null};
        }
        
        try {
            Matcher matcher = STACK_TRACE_PATTERN.matcher(stackTrace);
            if (matcher.find()) {
                String fullClassName = matcher.group(1);
                String fileName = fullClassName.substring(fullClassName.lastIndexOf('.') + 1) + ".java";
                String lineNumberStr = matcher.group(4);
                Integer lineNumber = Integer.parseInt(lineNumberStr);
                return new Object[]{fileName, lineNumber};
            }
        } catch (Exception e) {
            log.warn("Failed to extract file and line from stack trace: {}", e.getMessage());
        }
        
        return new Object[]{null, null};
    }
} 