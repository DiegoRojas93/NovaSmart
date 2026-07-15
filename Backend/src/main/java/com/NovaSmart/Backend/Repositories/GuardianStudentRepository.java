package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Enums.Relationships_status;
import com.NovaSmart.Backend.Model.GuardianAndStudentModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IGuardianStudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class GuardianStudentRepository implements IGuardianStudentRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<GuardianAndStudentModel> rowMapper = (rs, rowNum) -> {
        GuardianAndStudentModel model = new GuardianAndStudentModel();
        model.setGuardianId(rs.getLong("guardian_id"));
        model.setStudentId(rs.getLong("student_id"));

        String relationshipStr = rs.getString("relationship");
        if (relationshipStr != null) {
            model.setRelationship(Relationships_status.valueOf(relationshipStr));
        }
        return model;
    };

    @Override
    public void save(GuardianAndStudentModel model) {
        boolean exists = findByIds(model.getGuardianId(), model.getStudentId()).isPresent();

        if (!exists) {
            String query = "INSERT INTO guardian_students (guardian_id, student_id, relationship) " +
                "VALUES (?, ?, CAST(? AS relationships))";
            jdbcTemplate.update(query,
                model.getGuardianId(),
                model.getStudentId(),
                model.getRelationship() != null ? model.getRelationship().name() : null
            );
        } else {
            String query = "UPDATE guardian_students SET relationship = CAST(? AS relationships) " +
                "WHERE guardian_id = ? AND student_id = ?";
            jdbcTemplate.update(query,
                model.getRelationship() != null ? model.getRelationship().name() : null,
                model.getGuardianId(),
                model.getStudentId()
            );
        }
    }

    @Override
    public Optional<GuardianAndStudentModel> findByIds(Long guardianId, Long studentId) {
        String query = "SELECT * FROM guardian_students WHERE guardian_id = ? AND student_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, guardianId, studentId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<GuardianAndStudentModel> findByGuardianId(Long guardianId) {
        String query = "SELECT * FROM guardian_students WHERE guardian_id = ?";
        return jdbcTemplate.query(query, rowMapper, guardianId);
    }

    @Override
    public List<GuardianAndStudentModel> findByStudentId(Long studentId) {
        String query = "SELECT * FROM guardian_students WHERE student_id = ?";
        return jdbcTemplate.query(query, rowMapper, studentId);
    }

    @Override
    public List<GuardianAndStudentModel> findAll() {
        String query = "SELECT * FROM guardian_students";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void delete(Long guardianId, Long studentId) {
        String query = "DELETE FROM guardian_students WHERE guardian_id = ? AND student_id = ?";
        jdbcTemplate.update(query, guardianId, studentId);
    }
}
