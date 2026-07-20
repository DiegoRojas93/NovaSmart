package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.AttendanceModel;
import com.NovaSmart.Backend.Model.Enums.Attendance_status;
import com.NovaSmart.Backend.Repositories.Interfaces.IAttendanceRepository;
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
public class AttendanceRepository implements IAttendanceRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<AttendanceModel> rowMapper = (rs, rowNum) -> {
        AttendanceModel model = new AttendanceModel();
        model.setId(rs.getLong("id"));
        model.setEnrollmentId(rs.getLong("enrollment_id"));
        model.setClassroomSubjectId(rs.getLong("classroom_subject_id"));

        java.sql.Date attDate = rs.getDate("attendance_date");
        model.setAttendanceDate(attDate != null ? attDate.toLocalDate() : null);

        String statusStr = rs.getString("status");
        if (statusStr != null) {
            model.setStatus(Attendance_status.valueOf(statusStr));
        }

        model.setObservations(rs.getString("observations"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        model.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);

        return model;
    };

    @Override
    public AttendanceModel save(AttendanceModel attendance) {
        if (attendance.getId() == null) {
            String query = "INSERT INTO attendances (enrollment_id, classroom_subject_id, attendance_date, status, observations, created_at) " +
                "VALUES (?, ?, ?, CAST(? AS attendance_status), ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setLong(1, attendance.getEnrollmentId());
                ps.setLong(2, attendance.getClassroomSubjectId());
                ps.setDate(3, attendance.getAttendanceDate() != null ? java.sql.Date.valueOf(attendance.getAttendanceDate()) : null);
                ps.setString(4, attendance.getStatus() != null ? attendance.getStatus().name() : null);
                ps.setString(5, attendance.getObservations());
                ps.setTimestamp(6, attendance.getCreatedAt() != null ? Timestamp.valueOf(attendance.getCreatedAt()) : null);
                return ps;
            }, keyHolder);

            attendance.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE attendances SET enrollment_id = ?, classroom_subject_id = ?, attendance_date = ?, status = CAST(? AS attendance_status), observations = ?, created_at = ? WHERE id = ?";
            jdbcTemplate.update(query,
                attendance.getEnrollmentId(),
                attendance.getClassroomSubjectId(),
                attendance.getAttendanceDate() != null ? java.sql.Date.valueOf(attendance.getAttendanceDate()) : null,
                attendance.getStatus() != null ? attendance.getStatus().name() : null,
                attendance.getObservations(),
                attendance.getCreatedAt() != null ? Timestamp.valueOf(attendance.getCreatedAt()) : null,
                attendance.getId()
            );
        }
        return attendance;
    }

    @Override
    public Optional<AttendanceModel> findById(Long id) {
        String query = "SELECT * FROM attendances WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<AttendanceModel> findByEnrollmentId(Long enrollmentId) {
        String query = "SELECT * FROM attendances WHERE enrollment_id = ?";
        return jdbcTemplate.query(query, rowMapper, enrollmentId);
    }

    @Override
    public List<AttendanceModel> findAll() {
        String query = "SELECT * FROM attendances";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM attendances WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
