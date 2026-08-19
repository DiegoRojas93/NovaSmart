package com.NovaSmart.Backend.Repositories.Combinations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class GuardianDashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public String getGuardianName(Long guardianId) {
        String sql = "SELECT first_name || ' ' || last_name FROM users WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, String.class, guardianId);
        } catch (Exception e) {
            return "Acudiente";
        }
    }

    public List<Map<String, Object>> getStudentsByGuardian(Long guardianId) {
        String sql = "SELECT u.id, u.first_name || ' ' || u.last_name AS name, u.photo, u.status, " +
            "c.name AS course_name, " +
            "ci.document_type || ' ' || ci.identification AS document_id " +
            "FROM guardian_students gs " +
            "JOIN users u ON gs.student_id = u.id " +
            "LEFT JOIN contact_info ci ON u.id = ci.user_id " +
            "LEFT JOIN enrollments e ON u.id = e.student_id " +
            "LEFT JOIN classrooms c ON e.classroom_id = c.id " +
            "WHERE gs.guardian_id = ?";
        return jdbcTemplate.queryForList(sql, guardianId);
    }

    public Double getStudentAverage(Long studentId) {
        String sql = "SELECT COALESCE(AVG(sg.grade), 0.0) FROM student_grades sg " +
            "JOIN enrollments e ON sg.enrollment_id = e.id " +
            "WHERE e.student_id = ? AND sg.status = 'CALIFICADO'::submission_status";
        Double avg = jdbcTemplate.queryForObject(sql, Double.class, studentId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public int getStudentPendingTasks(Long studentId) {
        String sql = "SELECT COUNT(*) FROM student_grades sg " +
            "JOIN enrollments e ON sg.enrollment_id = e.id " +
            "WHERE e.student_id = ? AND sg.status = 'PENDIENTE'::submission_status";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, studentId);
        return count != null ? count : 0;
    }

    public int getStudentAbsences(Long studentId) {
        String sql = "SELECT COUNT(*) FROM attendances a " +
            "JOIN enrollments e ON a.enrollment_id = e.id " +
            "WHERE e.student_id = ? AND a.status = 'AUSENTE'::attendance_status";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, studentId);
        return count != null ? count : 0;
    }
}
