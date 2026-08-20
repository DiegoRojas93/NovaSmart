package com.NovaSmart.Backend.Repositories.Combinations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class GlobalGradesRepository {

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

    // --- PROMEDIOS POR MATERIA ---
    public List<Map<String, Object>> getSubjectAverages(Long institutionId, Long courseId, Long subjectId) {
        StringBuilder sql = new StringBuilder(
            "SELECT s.name as materia, AVG(sg.grade) as promedio " +
                "FROM student_grades sg " +
                "JOIN class_activities ca ON sg.activity_id = ca.id " +
                "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
                "JOIN subjects s ON cs.subject_id = s.id " +
                "WHERE sg.institution_id = ? AND sg.status IN ('CALIFICADO', 'ENTREGADO') "
        );
        List<Object> params = buildDynamicFilters(sql, institutionId, courseId, subjectId);
        sql.append(" GROUP BY s.name ORDER BY promedio DESC");

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    // --- REGISTROS DETALLADOS Y ESTADÍSTICAS ---
    public List<Map<String, Object>> getDetailedGrades(Long institutionId, Long courseId, Long subjectId) {
        StringBuilder sql = new StringBuilder(
            "SELECT sg.id, u.first_name || ' ' || u.last_name as student_name, u.photo as student_photo, " +
                "c.name as course_name, s.name as subject_name, ca.period, sg.grade, sg.observations " +
                "FROM student_grades sg " +
                "JOIN enrollments e ON sg.enrollment_id = e.id " +
                "JOIN users u ON e.student_id = u.id " +
                "JOIN class_activities ca ON sg.activity_id = ca.id " +
                "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
                "JOIN subjects s ON cs.subject_id = s.id " +
                "JOIN classrooms c ON cs.classroom_id = c.id " +
                "WHERE sg.institution_id = ? AND sg.status IN ('CALIFICADO', 'ENTREGADO') "
        );
        List<Object> params = buildDynamicFilters(sql, institutionId, courseId, subjectId);
        sql.append(" ORDER BY sg.created_at DESC, u.last_name ASC");

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    // --- HELPER: Inyección de Filtros SQL ---
    private List<Object> buildDynamicFilters(StringBuilder sql, Long institutionId, Long courseId, Long subjectId) {
        List<Object> params = new ArrayList<>();
        params.add(institutionId);

        if (courseId != null) {
            sql.append(" AND c.id = ? ");
            params.add(courseId);
        }
        if (subjectId != null) {
            sql.append(" AND s.id = ? ");
            params.add(subjectId);
        }
        return params;
    }
}
