package com.NovaSmart.Backend.Repositories.Auth;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.Timestamp;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class PasswordResetRepository {

    private final JdbcTemplate jdbcTemplate;

    public Map<String, Object> findUserDataByEmail(String email) {
        try {
            String sql = "SELECT u.id, u.username, u.first_name " +
                "FROM users u " +
                "JOIN contact_info c ON u.id = c.user_id " +
                "WHERE c.email = ?";
            return jdbcTemplate.queryForMap(sql, email);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void saveToken(String token, Long userId, Timestamp expiryDate) {
        String sql = "INSERT INTO password_reset_tokens (token, user_id, expiry_date) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, token, userId, expiryDate);
    }

    public Map<String, Object> findTokenRecord(String token) {
        try {
            String sql = "SELECT user_id, expiry_date FROM password_reset_tokens WHERE token = ?";
            return jdbcTemplate.queryForMap(sql, token);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updatePassword(Long userId, String encodedPassword) {
        jdbcTemplate.update("UPDATE users SET password = ? WHERE id = ?", encodedPassword, userId);
    }

    public void deleteToken(String token) {
        jdbcTemplate.update("DELETE FROM password_reset_tokens WHERE token = ?", token);
    }
}
