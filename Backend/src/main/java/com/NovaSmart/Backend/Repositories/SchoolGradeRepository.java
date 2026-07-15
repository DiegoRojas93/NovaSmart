package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.SchoolGradeModel;
import com.NovaSmart.Backend.Repositories.Interfaces.ISchoolGradeRepository;
import lombok.RequiredArgsConstructor;
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
public class SchoolGradeRepository implements ISchoolGradeRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<SchoolGradeModel> rowMapper = (rs, rowNum) -> {
        SchoolGradeModel model = new SchoolGradeModel();
        model.setId(rs.getLong("id"));
        model.setName(rs.getString("name"));
        return model;
    };

    @Override
    public SchoolGradeModel save(SchoolGradeModel schoolGrade) {
        if (schoolGrade.getId() == null) {
            String query = "INSERT INTO school_grades (name) VALUES (?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setString(1, schoolGrade.getName());
                return ps;
            }, keyHolder);

            schoolGrade.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE school_grades SET name = ? WHERE id = ?";
            jdbcTemplate.update(query, schoolGrade.getName(), schoolGrade.getId());
        }
        return schoolGrade;
    }

    @Override
    public Optional<SchoolGradeModel> findById(Long id) {
        String query = "SELECT * FROM school_grades WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<SchoolGradeModel> findAll() {
        String query = "SELECT * FROM school_grades";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM school_grades WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
