package com.NovaSmart.Backend.Repositories.Combinations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class StudentAttendanceSummaryRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. Obtener los KPIs agrupados por materia
    public List<Map<String, Object>> getAttendanceKpis(Long studentId, Long institutionId) {
        String sql = "SELECT " +
            "sub.name AS subject_name, " +
            "COUNT(a.id) AS total_classes, " +
            "SUM(CASE WHEN a.status = 'PRESENTE'::attendance_status THEN 1 ELSE 0 END) AS present_count, " +
            "SUM(CASE WHEN a.status = 'AUSENTE'::attendance_status THEN 1 ELSE 0 END) AS absent_count, " +
            "SUM(CASE WHEN a.status = 'LLEGO_TARDE'::attendance_status THEN 1 ELSE 0 END) AS late_count, " +
            "SUM(CASE WHEN a.status = 'JUSTIFICADO'::attendance_status THEN 1 ELSE 0 END) AS excused_count " +
            "FROM attendances a " +
            "JOIN enrollments e ON a.enrollment_id = e.id " +
            "JOIN classroom_subjects cs ON a.classroom_subject_id = cs.id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "WHERE e.student_id = ? AND a.institution_id = ? " +
            "GROUP BY sub.name";

        return jdbcTemplate.queryForList(sql, studentId, institutionId);
    }

    // 2. Obtener los registros detallados de fallas (Omitiendo los "PRESENTE")
    public List<Map<String, Object>> getAttendanceAnomalies(Long studentId, Long institutionId) {
        String sql = "SELECT " +
            "a.id, a.created_at AS date, sub.name AS subject_name, " + // <-- AQUÍ ESTÁ EL CAMBIO
            "t.first_name || ' ' || t.last_name AS teacher_name, " +
            "a.status, a.observations " +
            "FROM attendances a " +
            "JOIN enrollments e ON a.enrollment_id = e.id " +
            "JOIN classroom_subjects cs ON a.classroom_subject_id = cs.id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "JOIN users t ON cs.teacher_id = t.id " +
            "WHERE e.student_id = ? AND a.institution_id = ? " +
            "AND a.status != 'PRESENTE'::attendance_status " +
            "ORDER BY a.created_at DESC"; // <-- AQUÍ TAMBIÉN

        return jdbcTemplate.queryForList(sql, studentId, institutionId);
    }
}
