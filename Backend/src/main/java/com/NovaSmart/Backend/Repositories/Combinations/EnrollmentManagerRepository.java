package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.EnrollmentFormDTO;
import com.NovaSmart.Backend.Model.Combinations.EnrollmentSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class EnrollmentManagerRepository {

    private final JdbcTemplate jdbcTemplate;

    // --- ESCRITURA ---

    public void insertEnrollment(EnrollmentFormDTO request) {
        String sql = "INSERT INTO enrollments (student_id, classroom_id, academic_period_id, institution_id, created_at) " +
            "VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, request.getStudentId(), request.getClassroomId(),
            request.getAcademicPeriodId(), request.getInstitutionId(),
            Timestamp.valueOf(LocalDateTime.now()));
    }

    public void updateEnrollment(EnrollmentFormDTO request) {
        String sql = "UPDATE enrollments SET student_id = ?, classroom_id = ?, academic_period_id = ?, updated_at = ? " +
            "WHERE id = ? AND institution_id = ?";
        int rows = jdbcTemplate.update(sql, request.getStudentId(), request.getClassroomId(),
            request.getAcademicPeriodId(), Timestamp.valueOf(LocalDateTime.now()),
            request.getId(), request.getInstitutionId());
        if (rows == 0) throw new RuntimeException("Matrícula no encontrada o sin acceso.");
    }

    public void deleteEnrollment(Long id, Long institutionId) {
        String sql = "DELETE FROM enrollments WHERE id = ? AND institution_id = ?";
        jdbcTemplate.update(sql, id, institutionId);
    }

    // --- LECTURA ---

    public List<EnrollmentSummaryDTO> getAllEnrollments(Long institutionId) {
        String sql = "SELECT e.id, u.first_name || ' ' || u.last_name AS student_name, " +
            "ap.name AS period_name, c.name AS classroom_name " +
            "FROM enrollments e " +
            "JOIN users u ON e.student_id = u.id " +
            "JOIN academic_periods ap ON e.academic_period_id = ap.id " +
            "JOIN classrooms c ON e.classroom_id = c.id " +
            "WHERE e.institution_id = ? ORDER BY e.id DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            EnrollmentSummaryDTO dto = new EnrollmentSummaryDTO();
            dto.setId(rs.getLong("id"));
            dto.setStudentName(rs.getString("student_name"));
            dto.setPeriodName(rs.getString("period_name"));
            dto.setClassroomName(rs.getString("classroom_name"));
            return dto;
        }, institutionId);
    }

    public Map<String, Object> getFormOptions(Long institutionId) {
        Map<String, Object> data = new java.util.HashMap<>();

        // Filtramos usuarios que están en la tabla students
        data.put("students", jdbcTemplate.queryForList(
            "SELECT u.id, u.first_name || ' ' || u.last_name AS name FROM users u JOIN students s ON u.id = s.id WHERE u.institution_id = ?", institutionId));

        data.put("periods", jdbcTemplate.queryForList("SELECT id, name FROM academic_periods WHERE institution_id = ?", institutionId));
        data.put("classrooms", jdbcTemplate.queryForList("SELECT id, name FROM classrooms WHERE institution_id = ?", institutionId));

        return data;
    }

    public EnrollmentFormDTO getEnrollmentById(Long id, Long institutionId) {
        String sql = "SELECT student_id, academic_period_id, classroom_id FROM enrollments WHERE id = ? AND institution_id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            EnrollmentFormDTO dto = new EnrollmentFormDTO();
            dto.setId(id);
            dto.setInstitutionId(institutionId);
            dto.setStudentId(rs.getLong("student_id"));
            dto.setAcademicPeriodId(rs.getLong("academic_period_id"));
            dto.setClassroomId(rs.getLong("classroom_id"));
            return dto;
        }, id, institutionId);
    }

    // --- MAGIA: Obtener el horario heredado del curso ---
    public List<Map<String, Object>> getSchedulePreview(Long classroomId, Long periodId, Long institutionId) {
        String sql = "SELECT sch.day_of_week, sub.name AS subject_name, sch.start_time, sch.end_time, " +
            "u.first_name || ' ' || u.last_name AS teacher_name " +
            "FROM schedules sch " +
            "JOIN classroom_subjects cs ON sch.classroom_subject_id = cs.id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "JOIN users u ON cs.teacher_id = u.id " +
            "WHERE cs.classroom_id = ? AND cs.academic_period_id = ? AND cs.institution_id = ? " +
            "ORDER BY sch.day_of_week, sch.start_time";

        return jdbcTemplate.queryForList(sql, classroomId, periodId, institutionId);
    }
}
