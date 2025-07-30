package com.smartoutlet.auth.application.service;

import com.smartoutlet.auth.domain.entity.VerificationToken;
import com.smartoutlet.auth.domain.entity.User;
import com.smartoutlet.auth.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {
    private final VerificationTokenRepository verificationTokenRepository;

    @Value("${app.verification.expiration:86400000}")
    private long verificationTokenDurationMs;

    @Transactional
    public VerificationToken createVerificationToken(User user) {
        VerificationToken token = VerificationToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusNanos(verificationTokenDurationMs * 1_000_000))
                .createdAt(LocalDateTime.now())
                .build();
        return verificationTokenRepository.save(token);
    }

    public Optional<VerificationToken> findByToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }

    public boolean isExpired(VerificationToken token) {
        return token.getExpiryDate().isBefore(LocalDateTime.now());
    }

    @Transactional
    public void deleteByUser(User user) {
        verificationTokenRepository.deleteByUser(user);
    }
}