package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.RoleModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IRoleRepository;
import lombok.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RoleRepository implements IRoleRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<RoleModel> roleModelRowMapper = (rs, amountRow ) -> {
      RoleModel roleModel = new RoleModel();

      roleModel.setId( rs.getLong("id") );
      roleModel.setName( rs.getString("name") );

      return roleModel;
    };

    @Override
    public RoleModel save(RoleModel roleModel) {
        if (roleModel.getId() == null) {

            String query = "INSERT INTO roles (name) VALUES (?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {

                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});

                ps.setString(1, roleModel.getName());

                return ps;
            }, keyHolder);


            roleModel.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());

        } else {

            String query = "UPDATE roles SET name = ? WHERE id = ?";
            jdbcTemplate.update(query,
                roleModel.getName(),
                roleModel.getId()
            );
        }

        return roleModel;
    }

    @Override
    public Optional<RoleModel> findById(Long id) {
        String query = "SELECT * FROM roles WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, roleModelRowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<RoleModel> findAll() {
        String query = "SELECT * FROM roles";
        return jdbcTemplate.query(query, roleModelRowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM roles WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
