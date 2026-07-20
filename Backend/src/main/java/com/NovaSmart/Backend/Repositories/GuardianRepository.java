package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.GuardianModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IGuardianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class GuardianRepository implements IGuardianRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<GuardianModel> rowMapper = (rs, rowNum) -> {
        GuardianModel model = new GuardianModel();
        model.setId(rs.getLong("id"));
        model.setProfession(rs.getString("profession"));
        return model;
    };

    @Override
    public GuardianModel save(GuardianModel guardianModel) {
        boolean exists = findById(guardianModel.getId()).isPresent();

        if (!exists) {
            String query = "INSERT INTO guardians (id, profession) VALUES (?, ?)";
            jdbcTemplate.update(query, guardianModel.getId(), guardianModel.getProfession());
        } else {
            String query = "UPDATE guardians SET profession = ? WHERE id = ?";
            jdbcTemplate.update(query, guardianModel.getProfession(), guardianModel.getId());
        }
        return guardianModel;
    }

    @Override
    public Optional<GuardianModel> findById(Long id) {
        String query = "SELECT * FROM guardians WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<GuardianModel> findAll() {
        String query = "SELECT * FROM guardians";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM guardians WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
