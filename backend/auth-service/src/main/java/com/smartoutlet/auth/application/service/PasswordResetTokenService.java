package com.smartoutlet.auth.application.service;

import com.smartoutlet.auth.domain.entity.PasswordResetToken;
import com.smartoutlet.auth.domain.entity.User;
import com.smartoutlet.auth.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${app.passwordreset.expiration:3600000}")
    private long passwordResetTokenDurationMs;

    @Transactional
    public PasswordResetToken createPasswordResetToken(User user) {
        PasswordResetToken token = PasswordResetToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusNanos(passwordResetTokenDurationMs * 1_000_000))
                .createdAt(LocalDateTime.now())
                .build();
        return passwordResetTokenRepository.save(token);
    }

    public Optional<PasswordResetToken> findByToken(String token) {
        return passwordResetTokenRepository.findByToken(token);
    }

    public boolean isExpired(PasswordResetToken token) {
        return token.getExpiryDate().isBefore(LocalDateTime.now());
    }

    @Transactional
    public void deleteByUser(User user) {
        passwordResetTokenRepository.deleteByUser(user);
    }
}