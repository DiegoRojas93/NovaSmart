package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.UserRoleModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IUserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserRoleRepository implements IUserRoleRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<UserRoleModel> userRoleModelRowMapper = (rs, rowNum) -> {
        UserRoleModel userRoleModel = new UserRoleModel();
        userRoleModel.setUserId(rs.getLong("user_id"));
        userRoleModel.setRoleId(rs.getLong("role_id"));
        return userRoleModel;
    };


    @Override
    public void save(UserRoleModel userRoleModel) {

        // Como es una relación N:M, normalmente solo insertamos.
        // Si la relación ya existe, la base de datos lanzará un DuplicateKeyException gracias a tu PRIMARY KEY compuesta.

        String query = "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)";

        jdbcTemplate.update(query, userRoleModel.getUserId(), userRoleModel.getRoleId());
    }

    @Override
    public List<UserRoleModel> findByUserId(Long userId) {
        String query = "SELECT * FROM user_roles WHERE user_id = ?";
        return jdbcTemplate.query(query, userRoleModelRowMapper, userId);
    }

    @Override
    public List<UserRoleModel> findByRoleId(Long roleId) {
        String query = "SELECT * FROM user_roles WHERE role_id = ?";
        return jdbcTemplate.query(query, userRoleModelRowMapper, roleId);
    }

    @Override
    public List<UserRoleModel> findAll() {
        String query = "SELECT * FROM user_roles";
        return jdbcTemplate.query(query, userRoleModelRowMapper);
    }

    @Override
    public void delete(Long userId, Long roleId) {
        String query = "DELETE FROM user_roles WHERE user_id = ? AND role_id = ?";
        jdbcTemplate.update(query, userId, roleId);
    }

    @Override
    public void deleteAllByUserId(Long userId) {
        String query = "DELETE FROM user_roles WHERE user_id = ?";
        jdbcTemplate.update(query, userId);
    }
}
