package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.ClassroomSubjectModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IClassroomSubjectRepository;
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
public class ClassroomSubjectRepository implements IClassroomSubjectRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ClassroomSubjectModel> rowMapper = (rs, rowNum) -> {
        ClassroomSubjectModel model = new ClassroomSubjectModel();
        model.setId(rs.getLong("id"));
        model.setSubjectId(rs.getLong("subject_id"));
        model.setClassroomId(rs.getLong("classroom_id"));
        model.setTeacherId(rs.getLong("teacher_id"));
        model.setAcademicPeriodId(rs.getLong("academic_period_id"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        model.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);

        return model;
    };

    @Override
    public ClassroomSubjectModel save(ClassroomSubjectModel classroomSubject) {
        if (classroomSubject.getId() == null) {

            String query = "INSERT INTO classroom_subjects (subject_id, classroom_id, teacher_id, academic_period_id, created_at) " +
                "VALUES (?, ?, ?, ?, ?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setLong(1, classroomSubject.getSubjectId());
                ps.setLong(2, classroomSubject.getClassroomId());
                ps.setLong(3, classroomSubject.getTeacherId());
                ps.setLong(4, classroomSubject.getAcademicPeriodId());
                ps.setTimestamp(5, classroomSubject.getCreatedAt() != null ? Timestamp.valueOf(classroomSubject.getCreatedAt()) : null);
                return ps;
            }, keyHolder);

            classroomSubject.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE classroom_subjects SET subject_id = ?, classroom_id = ?, teacher_id = ?, academic_period_id = ?, created_at = ? WHERE id = ?";
            jdbcTemplate.update(query,
                classroomSubject.getSubjectId(),
                classroomSubject.getClassroomId(),
                classroomSubject.getTeacherId(),
                classroomSubject.getAcademicPeriodId(),
                classroomSubject.getCreatedAt() != null ? Timestamp.valueOf(classroomSubject.getCreatedAt()) : null,
                classroomSubject.getId()
            );
        }
        return classroomSubject;
    }

    @Override
    public Optional<ClassroomSubjectModel> findById(Long id) {
        String query = "SELECT * FROM classroom_subjects WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ClassroomSubjectModel> findByClassroomId(Long classroomId) {
        String query = "SELECT * FROM classroom_subjects WHERE classroom_id = ?";
        return jdbcTemplate.query(query, rowMapper, classroomId);
    }

    @Override
    public List<ClassroomSubjectModel> findByTeacherId(Long teacherId) {
        String query = "SELECT * FROM classroom_subjects WHERE teacher_id = ?";
        return jdbcTemplate.query(query, rowMapper, teacherId);
    }

    @Override
    public List<ClassroomSubjectModel> findByAcademicPeriodId(Long academicPeriodId) {
        String query = "SELECT * FROM classroom_subjects WHERE academic_period_id = ?";
        return jdbcTemplate.query(query, rowMapper, academicPeriodId);
    }

    @Override
    public List<ClassroomSubjectModel> findAll() {
        String query = "SELECT * FROM classroom_subjects";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM classroom_subjects WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
