package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Enums.User_status;
import com.NovaSmart.Backend.Model.UserModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IUserRepository;
import lombok.RequiredArgsConstructor;
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
        userModel.setFirst_name(rs.getString("first_name"));
        userModel.setLast_name(rs.getString("last_name"));

        java.sql.Date date = rs.getDate("birthday");
        userModel.setDate(date != null ? date.toLocalDate() : null);

        userModel.setUsername(rs.getString("username"));
        userModel.setPassword(rs.getString("password"));

        userModel.set_admin(rs.getBoolean("is_admin"));

        String statusStr = rs.getString("status");
        if (statusStr != null) {
            userModel.setStatus(User_status.valueOf(statusStr));
        }

        Timestamp createdAt = rs.getTimestamp("created_at");
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        Timestamp deletedAt = rs.getTimestamp("deleted_at");

        userModel.setCreated_at(createdAt != null ? createdAt.toLocalDateTime() : null);
        userModel.setUpdated_at(updatedAt != null ? updatedAt.toLocalDateTime() : null);
        userModel.setDeleted_at(deletedAt != null ? deletedAt.toLocalDateTime() : null);

        userModel.setInstitution_id(rs.getLong("admin_user_id"));

        return userModel;
    };

    @Override
    public UserModel save(UserModel userModel) {

        if ( userModel.getId() == null ) {

            String query = "INSERT INTO users " +
                "(first_name, last_name, birthday, username, password, is_Admin, status, created_at, updated_at, deleted_at, institution_id )" +
                " VALUES " +
                "(?,?,?,?,?,?,CAST(? AS user_status),?,?,?,?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update( connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});

                ps.setString(1, userModel.getFirst_name());
                ps.setString(2, userModel.getLast_name());

                ps.setDate(3, userModel.getDate() != null ? java.sql.Date.valueOf(userModel.getDate()) : null);

                ps.setString(4, userModel.getUsername());
                ps.setString(5, userModel.getPassword());

                ps.setBoolean( 6, userModel.is_admin());

                // Prevención de NullPointerException si no se seleccionó estado en el Frontend
                ps.setString(7, userModel.getStatus() != null ? userModel.getStatus().name() : null);

                ps.setTimestamp(8, userModel.getCreated_at() != null ? Timestamp.valueOf(userModel.getCreated_at()) : null);
                ps.setTimestamp(9, userModel.getUpdated_at() != null ? Timestamp.valueOf(userModel.getUpdated_at()) : null);
                ps.setTimestamp(10, userModel.getDeleted_at() != null ? Timestamp.valueOf(userModel.getDeleted_at()) : null);

                if (userModel.getInstitution_id() != null) {
                    ps.setLong(11, userModel.getInstitution_id());
                } else {
                    ps.setNull(11, java.sql.Types.BIGINT);
                }

                return ps;
            }, keyHolder);

            userModel.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());

        } else {
            String query = "UPDATE users SET " +
                "first_name = ?, last_name = ?, birthday = ?, username = ?, password = ?, is_admin = ?, status = CAST(? AS user_status), created_at = ?, updated_at = ?, deleted_at = ?, institution_id = ? " +
                "WHERE id = ?";

            System.out.println("ID institution user: " + userModel.getInstitution_id());

            jdbcTemplate.update( query,

                userModel.getFirst_name(),
                userModel.getLast_name(),
                userModel.getDate(),
                userModel.getUsername(),
                userModel.getPassword(),
                userModel.is_admin(),
                userModel.getStatus() != null ? userModel.getStatus().name() : null,
                userModel.getCreated_at(),
                userModel.getUpdated_at(),
                userModel.getDeleted_at(),
                userModel.getInstitution_id(),


                userModel.getId()
            );
        }

        return userModel;
    }

    @Override
    public Optional<UserModel> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public List<UserModel> findAll() {
        return List.of();
    }

    @Override
    public void deleteById(Long id) {

    }

    @Override
    public List<UserModel> findByAdminUserById(Long id) {
        return List.of();
    }
}
