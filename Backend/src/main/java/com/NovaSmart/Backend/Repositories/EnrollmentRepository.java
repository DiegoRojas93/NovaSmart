package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.EnrollmentModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IEnrollmentRepository;
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
public class EnrollmentRepository implements IEnrollmentRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<EnrollmentModel> rowMapper = (rs, rowNum) -> {
        EnrollmentModel model = new EnrollmentModel();
        model.setId(rs.getLong("id"));
        model.setStudentId(rs.getLong("student_id"));
        model.setClassroomId(rs.getLong("classroom_id"));
        model.setAcademicPeriodId(rs.getLong("academic_period_id"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        model.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);

        return model;
    };

    @Override
    public EnrollmentModel save(EnrollmentModel enrollment) {
        if (enrollment.getId() == null) {
            String query = "INSERT INTO enrollments (student_id, classroom_id, academic_period_id, created_at) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setLong(1, enrollment.getStudentId());
                ps.setLong(2, enrollment.getClassroomId());
                ps.setLong(3, enrollment.getAcademicPeriodId());
                ps.setTimestamp(4, enrollment.getCreatedAt() != null ? Timestamp.valueOf(enrollment.getCreatedAt()) : null);
                return ps;
            }, keyHolder);

            enrollment.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE enrollments SET student_id = ?, classroom_id = ?, academic_period_id = ?, created_at = ? WHERE id = ?";
            jdbcTemplate.update(query,
                enrollment.getStudentId(),
                enrollment.getClassroomId(),
                enrollment.getAcademicPeriodId(),
                enrollment.getCreatedAt() != null ? Timestamp.valueOf(enrollment.getCreatedAt()) : null,
                enrollment.getId()
            );
        }
        return enrollment;
    }

    @Override
    public Optional<EnrollmentModel> findById(Long id) {
        String query = "SELECT * FROM enrollments WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<EnrollmentModel> findByStudentId(Long studentId) {
        String query = "SELECT * FROM enrollments WHERE student_id = ?";
        return jdbcTemplate.query(query, rowMapper, studentId);
    }

    @Override
    public List<EnrollmentModel> findByClassroomId(Long classroomId) {
        String query = "SELECT * FROM enrollments WHERE classroom_id = ?";
        return jdbcTemplate.query(query, rowMapper, classroomId);
    }

    @Override
    public List<EnrollmentModel> findByAcademicPeriodId(Long academicPeriodId) {
        String query = "SELECT * FROM enrollments WHERE academic_period_id = ?";
        return jdbcTemplate.query(query, rowMapper, academicPeriodId);
    }

    @Override
    public List<EnrollmentModel> findAll() {
        String query = "SELECT * FROM enrollments";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM enrollments WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
