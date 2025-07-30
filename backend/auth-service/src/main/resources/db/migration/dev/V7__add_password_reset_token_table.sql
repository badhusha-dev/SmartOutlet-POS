-- Migration for password reset support
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_password_reset_token_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_token_user ON password_reset_tokens(user_id);