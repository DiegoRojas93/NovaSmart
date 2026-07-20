package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Enums.User_status;
import com.NovaSmart.Backend.Model.Components.UserModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepository implements IUserRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<UserModel> userModelRowMapper = ( rs, amountRow ) -> {
        UserModel userModel = new UserModel();

        userModel.setId(rs.getLong("id"));
        userModel.setFirstName(rs.getString("first_name"));
        userModel.setLastName(rs.getString("last_name"));

        java.sql.Date date = rs.getDate("birthday");
        userModel.setBirthday(date != null ? date.toLocalDate() : null);

        userModel.setUsername(rs.getString("username"));
        userModel.setPassword(rs.getString("password"));
        userModel.setAdmin(rs.getBoolean("is_admin"));

        String statusStr = rs.getString("status");
        if (statusStr != null) {
            userModel.setStatus(User_status.valueOf(statusStr));
        }

        userModel.setPhoto(rs.getString("photo"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        Timestamp deletedAt = rs.getTimestamp("deleted_at");

        userModel.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);
        userModel.setUpdatedAt(updatedAt != null ? updatedAt.toLocalDateTime() : null);
        userModel.setDeletedAt(deletedAt != null ? deletedAt.toLocalDateTime() : null);

        // CORRECCIÓN 1: Tu columna real de la tabla se llama "institution_id", no "admin_user_id"
        userModel.setInstitutionId(rs.getLong("institution_id"));

        return userModel;
    };

    @Override
    public UserModel save(UserModel userModel) {

        if ( userModel.getId() == null ) {

            String query = "INSERT INTO \"users\" " +
                "(first_name, last_name, birthday, username, password, is_admin, status, photo, created_at, updated_at, deleted_at, institution_id )" +
                " VALUES " +
                "(?,?,?,?,?,?,CAST(? AS user_status),?,?,?,?,?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update( connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});

                ps.setString(1, userModel.getFirstName());
                ps.setString(2, userModel.getLastName());
                ps.setDate(3, userModel.getBirthday() != null ? java.sql.Date.valueOf(userModel.getBirthday()) : null);
                ps.setString(4, userModel.getUsername());
                ps.setString(5, userModel.getPassword());
                ps.setBoolean(6, userModel.isAdmin());
                ps.setString(7, userModel.getStatus() != null ? userModel.getStatus().name() : null);

                ps.setString(8, userModel.getPhoto());

                ps.setTimestamp(9, userModel.getCreatedAt() != null ? Timestamp.valueOf(userModel.getCreatedAt()) : null);
                ps.setTimestamp(10, userModel.getUpdatedAt() != null ? Timestamp.valueOf(userModel.getUpdatedAt()) : null);
                ps.setTimestamp(11, userModel.getDeletedAt() != null ? Timestamp.valueOf(userModel.getDeletedAt()) : null);

                if (userModel.getInstitutionId() != null) {
                    ps.setLong(12, userModel.getInstitutionId());
                } else {
                    ps.setNull(12, java.sql.Types.BIGINT);
                }

                return ps;
            }, keyHolder);

            userModel.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());

        } else {

            String query = "UPDATE \"users\" SET " +
                "first_name = ?, last_name = ?, birthday = ?, username = ?, password = ?, is_admin = ?, status = CAST(? AS user_status), photo = ?, created_at = ?, updated_at = ?, deleted_at = ?, institution_id = ? " +
                "WHERE id = ?";

            jdbcTemplate.update( query,
                userModel.getFirstName(),
                userModel.getLastName(),
                userModel.getBirthday() != null ? java.sql.Date.valueOf(userModel.getBirthday()) : null,
                userModel.getUsername(),
                userModel.getPassword(),
                userModel.isAdmin(),
                userModel.getStatus() != null ? userModel.getStatus().name() : null,
                userModel.getPhoto(),
                userModel.getCreatedAt() != null ? Timestamp.valueOf(userModel.getCreatedAt()) : null,
                userModel.getUpdatedAt() != null ? Timestamp.valueOf(userModel.getUpdatedAt()) : null,
                userModel.getDeletedAt() != null ? Timestamp.valueOf(userModel.getDeletedAt()) : null,
                userModel.getInstitutionId(),
                userModel.getId()
            );
        }

        return userModel;
    }

    @Override
    public Optional<UserModel> findById(Long id) {
        String query = "SELECT * FROM \"users\" WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, userModelRowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<UserModel> findAll() {
        String query = "SELECT * FROM \"users\"";
        return jdbcTemplate.query(query, userModelRowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM \"users\" WHERE id = ?";
        jdbcTemplate.update(query, id);
    }

    @Override
    public List<UserModel> findByAdminUserById(Long id) {
        String query = "SELECT * FROM \"users\" WHERE institution_id = ? LIMIT 1";
        return jdbcTemplate.query(query, userModelRowMapper);
    }
}
