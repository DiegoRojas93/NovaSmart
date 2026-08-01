package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.StudentModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IStudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class StudentRepository implements IStudentRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<StudentModel> rowMapper = (rs, rowNum) -> {
        StudentModel model = new StudentModel();
        model.setId(rs.getLong("id"));
        return model;
    };

    @Override
    public StudentModel save(StudentModel studentModel) {
        boolean exists = findById(studentModel.getId()).isPresent();

        // Solo insertamos si no existe. No hay UPDATE porque no hay otras columnas.
        if (!exists) {
            String query = "INSERT INTO students (id) VALUES (?)";
            jdbcTemplate.update(query, studentModel.getId());
        }
        return studentModel;
    }

    @Override
    public Optional<StudentModel> findById(Long id) {
        String query = "SELECT * FROM students WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<StudentModel> findAll() {
        String query = "SELECT * FROM students";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM students WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
