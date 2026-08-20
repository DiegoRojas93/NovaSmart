package com.NovaSmart.Backend.Repositories.Combinations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class GlobalAttendanceRepository {

    private final JdbcTemplate jdbcTemplate;

    // --- FILTROS ---
    public List<Map<String, Object>> getAvailableCourses(Long institutionId) {
        String sql = "SELECT id, name FROM classrooms WHERE institution_id = ? ORDER BY name";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    public List<Map<String, Object>> getAvailableSubjects(Long institutionId) {
        String sql = "SELECT id, name FROM subjects WHERE institution_id = ? ORDER BY name";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    // --- TENDENCIAS DIARIAS (Últimos 5 días de clase) ---
    public List<Map<String, Object>> getAttendanceTrends(Long institutionId, Long courseId, Long subjectId) {
        StringBuilder sql = new StringBuilder(
            "SELECT a.attendance_date, " +
                "SUM(CASE WHEN a.status = 'PRESENTE' THEN 1 ELSE 0 END) as presente, " +
                "SUM(CASE WHEN a.status = 'AUSENTE' THEN 1 ELSE 0 END) as ausente, " +
                "SUM(CASE WHEN a.status = 'LLEGO_TARDE' THEN 1 ELSE 0 END) as tarde, " +
                "SUM(CASE WHEN a.status = 'JUSTIFICADO' THEN 1 ELSE 0 END) as justificado " +
                "FROM attendances a " +
                "JOIN classroom_subjects cs ON a.classroom_subject_id = cs.id " +
                "WHERE a.institution_id = ? "
        );
        List<Object> params = buildDynamicFilters(sql, institutionId, courseId, subjectId);
        sql.append(" GROUP BY a.attendance_date ORDER BY a.attendance_date DESC LIMIT 5");

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    // --- REGISTROS DETALLADOS RECIENTES ---
    public List<Map<String, Object>> getRecentRecords(Long institutionId, Long courseId, Long subjectId) {
        StringBuilder sql = new StringBuilder(
            "SELECT a.id, a.attendance_date, a.status, a.observations, " +
                "u.first_name || ' ' || u.last_name as student_name, u.photo as student_photo, " +
                "s.name as subject_name, c.name as course_name " +
                "FROM attendances a " +
                "JOIN enrollments e ON a.enrollment_id = e.id " +
                "JOIN users u ON e.student_id = u.id " +
                "JOIN classroom_subjects cs ON a.classroom_subject_id = cs.id " +
                "JOIN subjects s ON cs.subject_id = s.id " +
                "JOIN classrooms c ON cs.classroom_id = c.id " +
                "WHERE a.institution_id = ? "
        );
        List<Object> params = buildDynamicFilters(sql, institutionId, courseId, subjectId);
        sql.append(" ORDER BY a.attendance_date DESC, u.last_name ASC LIMIT 50");

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    // --- HELPER: Inyección de Filtros SQL ---
    private List<Object> buildDynamicFilters(StringBuilder sql, Long institutionId, Long courseId, Long subjectId) {
        List<Object> params = new ArrayList<>();
        params.add(institutionId);

        if (courseId != null) {
            sql.append(" AND cs.classroom_id = ? ");
            params.add(courseId);
        }
        if (subjectId != null) {
            sql.append(" AND cs.subject_id = ? ");
            params.add(subjectId);
        }
        return params;
    }
}
