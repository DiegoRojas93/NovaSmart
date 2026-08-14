package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AttendanceRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentAttendanceDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class AttendanceManagerRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. OBTENER LISTA DE ALUMNOS Y SU ASISTENCIA (SI EXISTE)
    public List<StudentAttendanceDTO> getAttendanceList(Long classroomSubjectId, LocalDate date, Long institutionId) {
        String sql = "SELECT e.id AS enrollment_id, u.id AS student_id, u.first_name || ' ' || u.last_name AS name, " +
            "COALESCE(a.status::text, 'PRESENTE') AS status, a.observations " +
            "FROM enrollments e " +
            "JOIN users u ON e.student_id = u.id " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "LEFT JOIN attendances a ON a.enrollment_id = e.id AND a.classroom_subject_id = cs.id AND a.attendance_date = ? " +
            "WHERE cs.id = ? AND cs.institution_id = ? " +
            "ORDER BY name";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            StudentAttendanceDTO dto = new StudentAttendanceDTO();
            dto.setEnrollmentId(rs.getLong("enrollment_id"));
            dto.setStudentId(rs.getLong("student_id"));
            dto.setName(rs.getString("name"));
            dto.setStatus(rs.getString("status"));
            dto.setObservations(rs.getString("observations"));
            return dto;
        }, date, classroomSubjectId, institutionId);
    }

    // 2. GUARDAR O ACTUALIZAR (UPSERT)
    public void upsertAttendanceRecord(Long classroomSubjectId, LocalDate date, Long institutionId, AttendanceRequestDTO.RecordDTO record) {
        // Aprovecha el índice único para crear o actualizar en un solo paso
        String sql = "INSERT INTO attendances (enrollment_id, classroom_subject_id, attendance_date, status, observations, institution_id, created_at) " +
            "VALUES (?, ?, ?, ?::attendance_status, ?, ?, ?) " +
            "ON CONFLICT (enrollment_id, classroom_subject_id, attendance_date) " +
            "DO UPDATE SET status = EXCLUDED.status, observations = EXCLUDED.observations, updated_at = ?";

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        jdbcTemplate.update(sql,
            record.getEnrollmentId(), classroomSubjectId, date, record.getStatus(),
            record.getObservations(), institutionId, now, now);
    }

    // 3. ELIMINAR ASISTENCIA DE UN DÍA (Si el profe se equivocó de clase/día)
    public void deleteAttendanceByDate(Long classroomSubjectId, LocalDate date, Long institutionId) {
        String sql = "DELETE FROM attendances WHERE classroom_subject_id = ? AND attendance_date = ? AND institution_id = ?";
        jdbcTemplate.update(sql, classroomSubjectId, date, institutionId);
    }
}
