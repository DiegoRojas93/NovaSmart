package com.NovaSmart.Backend.Repositories.Combinations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AdminDashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    // --- KPIs ---
    public int getTotalStudents(Long institutionId) {
        String sql = "SELECT count(*) FROM students s JOIN users u ON s.id = u.id WHERE u.institution_id = ? AND u.status = 'ACTIVO'::user_status";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, institutionId);
        return count != null ? count : 0;
    }

    public int getTotalTeachers(Long institutionId) {
        String sql = "SELECT count(*) FROM teachers t JOIN users u ON t.id = u.id WHERE u.institution_id = ? AND u.status = 'ACTIVO'::user_status";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, institutionId);
        return count != null ? count : 0;
    }

    public double getGlobalAttendance(Long institutionId) {
        String sql = "SELECT COALESCE((SUM(CASE WHEN status = 'PRESENTE'::attendance_status THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(*), 0), 0.0) " +
            "FROM attendances WHERE institution_id = ?";
        Double avg = jdbcTemplate.queryForObject(sql, Double.class, institutionId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public int getActiveEnrollments(Long institutionId) {
        String sql = "SELECT count(*) FROM enrollments WHERE institution_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, institutionId);
        return count != null ? count : 0;
    }

    // --- GRÁFICAS ---
    public List<Map<String, Object>> getEnrollmentsPerMonth(Long institutionId) {
        // Agrupa inscripciones por mes en el año actual
        String sql = "SELECT EXTRACT(MONTH FROM created_at) AS month_num, COUNT(*) AS count " +
            "FROM enrollments " +
            "WHERE institution_id = ? AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) " +
            "GROUP BY month_num ORDER BY month_num";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    public List<Map<String, Object>> getGradesPerPeriod(Long institutionId) {
        String sql = "SELECT ap.name AS period_name, COALESCE(AVG(sg.grade), 0.0) AS average " +
            "FROM academic_periods ap " +
            "LEFT JOIN enrollments e ON ap.id = e.academic_period_id " +
            "LEFT JOIN student_grades sg ON e.id = sg.enrollment_id AND sg.status = 'CALIFICADO'::submission_status " +
            "WHERE ap.institution_id = ? " +
            "GROUP BY ap.id, ap.name ORDER BY ap.start_date ASC";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    public List<Map<String, Object>> getRoleDistribution(Long institutionId) {
        String sql = "SELECT r.name AS role_name, COUNT(ur.user_id) AS count " +
            "FROM roles r " +
            "JOIN user_roles ur ON r.id = ur.role_id " +
            "JOIN users u ON ur.user_id = u.id " +
            "WHERE u.institution_id = ? AND u.status = 'ACTIVO'::user_status " +
            "GROUP BY r.name";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    // --- TABLAS ---
    public List<Map<String, Object>> getClassroomStatus(Long institutionId) {
        String sql = "SELECT c.id, c.name AS aula, c.capacity, c.building, COUNT(e.id) AS ocupados " +
            "FROM classrooms c " +
            "LEFT JOIN enrollments e ON c.id = e.classroom_id " +
            "WHERE c.institution_id = ? " +
            "GROUP BY c.id, c.name, c.capacity, c.building " +
            "ORDER BY c.name";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    public List<Map<String, Object>> getRecentUsers(Long institutionId) {
        String sql = "SELECT u.id, u.first_name || ' ' || u.last_name AS name, u.status, u.photo, ci.email, " +
            "(SELECT r.name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id LIMIT 1) AS role_name " +
            "FROM users u " +
            "LEFT JOIN contact_info ci ON u.id = ci.user_id " +
            "WHERE u.institution_id = ? " +
            "ORDER BY u.created_at DESC LIMIT 10"; // Traemos los 10 más recientes
        return jdbcTemplate.queryForList(sql, institutionId);
    }
}
