package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.TeacherModel;
import com.NovaSmart.Backend.Repositories.Interfaces.ITeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TeacherRepository implements ITeacherRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<TeacherModel> rowMapper = (rs, rowNum) -> {
        TeacherModel model = new TeacherModel();
        model.setId(rs.getLong("id"));
        model.setProfession(rs.getString("profession"));
        return model;
    };

    @Override
    public TeacherModel save(TeacherModel teacherModel) {
        // Verificamos si el profesor ya existe en la tabla hija
        boolean exists = findById(teacherModel.getId()).isPresent();

        if (!exists) {
            // INSERT: Insertamos usando el ID que viene del UserModel
            String query = "INSERT INTO teachers (id, profession) VALUES (?, ?)";
            jdbcTemplate.update(query, teacherModel.getId(), teacherModel.getProfession());
        } else {
            // UPDATE: Actualizamos la profesión
            String query = "UPDATE teachers SET profession = ? WHERE id = ?";
            jdbcTemplate.update(query, teacherModel.getProfession(), teacherModel.getId());
        }
        return teacherModel;
    }

    @Override
    public Optional<TeacherModel> findById(Long id) {
        String query = "SELECT * FROM teachers WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<TeacherModel> findAll() {
        String query = "SELECT * FROM teachers";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM teachers WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
