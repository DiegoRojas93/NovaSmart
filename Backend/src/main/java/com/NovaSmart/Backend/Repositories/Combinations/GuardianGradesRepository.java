package com.NovaSmart.Backend.Repositories.Combinations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class GuardianGradesRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. Obtener Hijos del Acudiente
    public List<Map<String, Object>> getChildrenByGuardian(Long guardianId) {
        String sql = "SELECT DISTINCT u.id, u.first_name || ' ' || u.last_name AS name, u.photo, c.name AS course " +
            "FROM guardian_students gs " +
            "JOIN users u ON gs.student_id = u.id " +
            "LEFT JOIN enrollments e ON u.id = e.student_id " +
            "LEFT JOIN classrooms c ON e.classroom_id = c.id " +
            "WHERE gs.guardian_id = ?";
        return jdbcTemplate.queryForList(sql, guardianId);
    }

    // 2. Obtener Periodos de la Institución
    public List<Map<String, Object>> getPeriods(Long institutionId) {
        String sql = "SELECT id, name FROM academic_periods WHERE institution_id = ? ORDER BY start_date DESC";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    // 3. Obtener Materias, Profesores y Promedios
    public List<Map<String, Object>> getSubjectsAndAverages(Long studentId, Long periodId) {
        String sql = "SELECT cs.id AS classroom_subject_id, s.name AS subject_name, " +
            "t.first_name || ' ' || t.last_name AS teacher_name, t.photo AS teacher_photo, " +
            "COALESCE(AVG(sg.grade), 0.0) AS average_grade " +
            "FROM enrollments e " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "JOIN subjects s ON cs.subject_id = s.id " +
            "JOIN users t ON cs.teacher_id = t.id " +
            "LEFT JOIN class_activities ca ON ca.classroom_subject_id = cs.id " +
            "LEFT JOIN student_grades sg ON sg.activity_id = ca.id AND sg.enrollment_id = e.id AND sg.status = 'CALIFICADO'::submission_status " +
            "WHERE e.student_id = ? AND e.academic_period_id = ? " +
            "GROUP BY cs.id, s.name, t.first_name, t.last_name, t.photo " +
            "ORDER BY s.name ASC";
        return jdbcTemplate.queryForList(sql, studentId, periodId);
    }

    // 4. Obtener Tareas
    public List<Map<String, Object>> getTasks(Long studentId, Long periodId) {
        String sql = "SELECT ca.classroom_subject_id, ca.id AS task_id, ca.title, sg.grade, ca.due_date AS date " +
            "FROM enrollments e " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "JOIN class_activities ca ON ca.classroom_subject_id = cs.id " +
            "LEFT JOIN student_grades sg ON sg.activity_id = ca.id AND sg.enrollment_id = e.id " +
            "WHERE e.student_id = ? AND e.academic_period_id = ? " +
            "ORDER BY ca.due_date DESC";
        return jdbcTemplate.queryForList(sql, studentId, periodId);
    }

    // 5. Obtener Inasistencias y Retardos
    public List<Map<String, Object>> getAbsences(Long studentId, Long periodId) {
        String sql = "SELECT a.classroom_subject_id, a.id AS absence_id, a.attendance_date AS date, a.status AS type " +
            "FROM enrollments e " +
            "JOIN attendances a ON a.enrollment_id = e.id " +
            "WHERE e.student_id = ? AND e.academic_period_id = ? " +
            "AND a.status IN ('AUSENTE'::attendance_status, 'LLEGO_TARDE'::attendance_status) " +
            "ORDER BY a.attendance_date DESC";
        return jdbcTemplate.queryForList(sql, studentId, periodId);
    }
}
