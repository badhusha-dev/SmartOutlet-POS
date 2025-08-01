package com.smartoutlet.auth.service;

import com.smartoutlet.auth.application.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Email Service Tests")
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_SUBJECT = "Test Subject";
    private static final String TEST_MESSAGE = "Test message content";

    @BeforeEach
    void setUp() {
        // Setup test data if needed
    }

    @Test
    @DisplayName("Should send email successfully")
    void shouldSendEmailSuccessfully() {
        // Given
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // When
        assertDoesNotThrow(() -> {
            emailService.sendEmail(TEST_EMAIL, TEST_SUBJECT, TEST_MESSAGE);
        });

        // Then
        verify(mailSender).send(argThat(message -> 
            message instanceof SimpleMailMessage &&
            TEST_EMAIL.equals(((SimpleMailMessage) message).getTo()[0]) &&
            TEST_SUBJECT.equals(((SimpleMailMessage) message).getSubject()) &&
            TEST_MESSAGE.equals(((SimpleMailMessage) message).getText())
        ));
    }

    @Test
    @DisplayName("Should handle mail sending exception")
    void shouldHandleMailSendingException() {
        // Given
        doThrow(new RuntimeException("Mail server error")).when(mailSender).send(any(SimpleMailMessage.class));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            emailService.sendEmail(TEST_EMAIL, TEST_SUBJECT, TEST_MESSAGE);
        });

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Should handle null email address")
    void shouldHandleNullEmailAddress() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.sendEmail(null, TEST_SUBJECT, TEST_MESSAGE);
        });

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Should handle empty email address")
    void shouldHandleEmptyEmailAddress() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            emailService.sendEmail("", TEST_SUBJECT, TEST_MESSAGE);
        });

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Should handle null subject")
    void shouldHandleNullSubject() {
        // Given
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // When
        assertDoesNotThrow(() -> {
            emailService.sendEmail(TEST_EMAIL, null, TEST_MESSAGE);
        });

        // Then
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Should handle null message")
    void shouldHandleNullMessage() {
        // Given
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // When
        assertDoesNotThrow(() -> {
            emailService.sendEmail(TEST_EMAIL, TEST_SUBJECT, null);
        });

        // Then
        verify(mailSender).send(any(SimpleMailMessage.class));
    }
}