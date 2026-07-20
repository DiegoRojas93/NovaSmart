package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.StudentGradesModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IStudentGradesRepository;
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
public class StudentGradesRepository implements IStudentGradesRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<StudentGradesModel> rowMapper = (rs, rowNum) -> {
        StudentGradesModel model = new StudentGradesModel();
        model.setId(rs.getLong("id"));
        model.setEnrollmentId(rs.getLong("enrollment_id"));
        model.setClassroomSubjectId(rs.getLong("classroom_subject_id"));
        model.setGrade(rs.getBigDecimal("grade"));
        model.setPeriod(rs.getShort("period"));
        model.setObservations(rs.getString("observations"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        model.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);

        return model;
    };

    @Override
    public StudentGradesModel save(StudentGradesModel grade) {
        if (grade.getId() == null) {
            String query = "INSERT INTO student_grades (enrollment_id, classroom_subject_id, grade, period, observations, created_at) VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setLong(1, grade.getEnrollmentId());
                ps.setLong(2, grade.getClassroomSubjectId());
                ps.setBigDecimal(3, grade.getGrade());
                ps.setShort(4, grade.getPeriod());
                ps.setString(5, grade.getObservations());
                ps.setTimestamp(6, grade.getCreatedAt() != null ? Timestamp.valueOf(grade.getCreatedAt()) : null);
                return ps;
            }, keyHolder);

            grade.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE student_grades SET enrollment_id = ?, classroom_subject_id = ?, grade = ?, period = ?, observations = ?, created_at = ? WHERE id = ?";
            jdbcTemplate.update(query,
                grade.getEnrollmentId(),
                grade.getClassroomSubjectId(),
                grade.getGrade(),
                grade.getPeriod(),
                grade.getObservations(),
                grade.getCreatedAt() != null ? Timestamp.valueOf(grade.getCreatedAt()) : null,
                grade.getId()
            );
        }
        return grade;
    }

    @Override
    public Optional<StudentGradesModel> findById(Long id) {
        String query = "SELECT * FROM student_grades WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<StudentGradesModel> findByEnrollmentId(Long enrollmentId) {
        String query = "SELECT * FROM student_grades WHERE enrollment_id = ?";
        return jdbcTemplate.query(query, rowMapper, enrollmentId);
    }

    @Override
    public List<StudentGradesModel> findByClassroomSubjectId(Long classroomSubjectId) {
        String query = "SELECT * FROM student_grades WHERE classroom_subject_id = ?";
        return jdbcTemplate.query(query, rowMapper, classroomSubjectId);
    }

    @Override
    public List<StudentGradesModel> findAll() {
        String query = "SELECT * FROM student_grades";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM student_grades WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
