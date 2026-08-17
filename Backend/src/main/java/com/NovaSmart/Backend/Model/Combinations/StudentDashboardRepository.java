package com.NovaSmart.Backend.Model.Combinations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class StudentDashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. Obtener datos del estudiante y su curso actual
    public Map<String, Object> getStudentAndCourse(Long studentId, Long institutionId) {
        String sql = "SELECT u.first_name, c.name AS course_name " +
            "FROM users u " +
            "JOIN enrollments e ON u.id = e.student_id " +
            "JOIN classrooms c ON e.classroom_id = c.id " +
            "WHERE u.id = ? AND u.institution_id = ? " +
            "ORDER BY e.created_at DESC LIMIT 1";

        try {
            return jdbcTemplate.queryForMap(sql, studentId, institutionId);
        } catch (Exception e) {
            return Map.of("first_name", "Estudiante", "course_name", "Sin curso");
        }
    }

    // 2. Obtener el horario de la semana (Lunes a Viernes)
    public List<Map<String, Object>> getWeeklySchedule(Long studentId, Long institutionId) {
        String sql = "SELECT s.id, s.day_of_week, s.start_time, s.end_time, " +
            "sub.name AS subject_name, t.first_name || ' ' || t.last_name AS teacher_name, t.photo, " +
            "c.building || ' - ' || c.floor || ' (' || c.name || ')' AS classroom_info " +
            "FROM schedules s " +
            "JOIN classroom_subjects cs ON s.classroom_subject_id = cs.id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "JOIN users t ON cs.teacher_id = t.id " +
            "JOIN classrooms c ON cs.classroom_id = c.id " +
            "JOIN enrollments e ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "WHERE e.student_id = ? AND s.institution_id = ? " +
            "ORDER BY s.day_of_week ASC, s.start_time ASC";

        return jdbcTemplate.queryForList(sql, studentId, institutionId);
    }

    // 3. Obtener Tareas Pendientes
    public List<Map<String, Object>> getPendingTasks(Long studentId, Long institutionId) {
        String sql = "SELECT ca.id, sub.name AS subject_name, ca.title, ca.due_date, ca.type " +
            "FROM student_grades sg " +
            "JOIN class_activities ca ON sg.activity_id = ca.id " +
            "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "JOIN enrollments e ON sg.enrollment_id = e.id " +
            "WHERE e.student_id = ? AND sg.status = 'PENDIENTE'::submission_status AND sg.institution_id = ? " +
            "ORDER BY ca.due_date ASC";

        return jdbcTemplate.queryForList(sql, studentId, institutionId);
    }
}
