package com.NovaSmart.Backend.Repositories.Combinations;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AcademicsDashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    // ==============================================================================
    // 1. MÉTODOS PARA KPIs (Estructura General)
    // ==============================================================================
    public int getActiveSubjects(Long institutionId) {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM subjects WHERE institution_id = ?", Integer.class, institutionId);
    }

    public int getRegisteredClassrooms(Long institutionId) {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM classrooms WHERE institution_id = ?", Integer.class, institutionId);
    }

    public String getCurrentPeriod(Long institutionId) {
        String sql = "SELECT name FROM academic_periods WHERE institution_id = ? ORDER BY start_date DESC LIMIT 1";
        List<String> results = jdbcTemplate.queryForList(sql, String.class, institutionId);
        return results.isEmpty() ? "Sin Periodo" : results.get(0);
    }

    public int getConfiguredLevels(Long institutionId) {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM school_grades WHERE institution_id = ?", Integer.class, institutionId);
    }

    // ==============================================================================
    // 2. MÉTODOS PARA GRÁFICAS Y TABLAS (Estructura General)
    // ==============================================================================
    public List<Map<String, Object>> getScheduleData(Long institutionId) {
        String sql = "SELECT day_of_week, COUNT(*) as clases FROM schedules WHERE institution_id = ? GROUP BY day_of_week ORDER BY day_of_week";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    public List<Map<String, Object>> getSubjectsPerGrade(Long institutionId) {
        String sql = "SELECT sg.name as grado, COUNT(gs.subject_id) as materias " +
            "FROM school_grades sg " +
            "LEFT JOIN grade_subjects gs ON sg.id = gs.grade_id " +
            "WHERE sg.institution_id = ? " +
            "GROUP BY sg.id, sg.name ORDER BY sg.id";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    public List<Map<String, Object>> getRecentAssignments(Long institutionId) {
        String sql = "SELECT cs.id, s.name as materia, u.first_name || ' ' || u.last_name as docente, u.photo as docente_foto, c.name as aula, " +
            "(SELECT string_agg(" +
            "  CASE s2.day_of_week WHEN 1 THEN 'Lun' WHEN 2 THEN 'Mar' WHEN 3 THEN 'Mié' WHEN 4 THEN 'Jue' WHEN 5 THEN 'Vie' WHEN 6 THEN 'Sáb' WHEN 7 THEN 'Dom' END " +
            "  || ' ' || to_char(s2.start_time, 'HH24:MI') || '-' || to_char(s2.end_time, 'HH24:MI'), ', ' " +
            ") FROM schedules s2 WHERE s2.classroom_subject_id = cs.id) as horario " +
            "FROM classroom_subjects cs " +
            "JOIN subjects s ON cs.subject_id = s.id " +
            "JOIN users u ON cs.teacher_id = u.id " +
            "JOIN classrooms c ON cs.classroom_id = c.id " +
            "WHERE cs.institution_id = ? " +
            "ORDER BY cs.created_at DESC NULLS LAST LIMIT 10";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    // ==============================================================================
    // 3. MÉTODOS PARA OBTENER LOS FILTROS DISPONIBLES (Selectores)
    // ==============================================================================
    public List<Map<String, Object>> getAvailableGrades(Long institutionId) {
        String sql = "SELECT id, name FROM school_grades WHERE institution_id = ? ORDER BY id";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    public List<Map<String, Object>> getAvailableSubjects(Long institutionId) {
        String sql = "SELECT id, name FROM subjects WHERE institution_id = ? ORDER BY name";
        return jdbcTemplate.queryForList(sql, institutionId);
    }

    // ==============================================================================
    // 4. MÉTODOS PARA ACTIVIDADES (Con filtros dinámicos)
    // ==============================================================================
    public List<Map<String, Object>> getActivitiesDistribution(Long institutionId, Long gradeId, Long subjectId) {
        StringBuilder sql = new StringBuilder(
            "SELECT ca.type, COUNT(ca.id) as cantidad " +
                "FROM class_activities ca " +
                "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
                "WHERE ca.institution_id = ? "
        );
        List<Object> params = buildDynamicFilters(sql, institutionId, gradeId, subjectId);
        sql.append(" GROUP BY ca.type");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getSubmissionStatus(Long institutionId, Long gradeId, Long subjectId) {
        StringBuilder sql = new StringBuilder(
            "SELECT sg.status, COUNT(sg.id) as cantidad " +
                "FROM student_grades sg " +
                "JOIN class_activities ca ON sg.activity_id = ca.id " +
                "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
                "WHERE sg.institution_id = ? "
        );
        List<Object> params = buildDynamicFilters(sql, institutionId, gradeId, subjectId);
        sql.append(" GROUP BY sg.status");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getRecentActivities(Long institutionId, Long gradeId, Long subjectId) {
        StringBuilder sql = new StringBuilder(
            "SELECT ca.id, ca.title, s.name as materia, ca.type, ca.due_date " +
                "FROM class_activities ca " +
                "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
                "JOIN subjects s ON cs.subject_id = s.id " +
                "WHERE ca.institution_id = ? "
        );
        List<Object> params = buildDynamicFilters(sql, institutionId, gradeId, subjectId);
        sql.append(" ORDER BY ca.created_at DESC LIMIT 10");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    // ==============================================================================
    // HELPER: Construcción de filtros dinámicos
    // ==============================================================================
    private List<Object> buildDynamicFilters(StringBuilder sql, Long institutionId, Long gradeId, Long subjectId) {
        List<Object> params = new ArrayList<>();
        params.add(institutionId);

        if (subjectId != null) {
            sql.append(" AND cs.subject_id = ? ");
            params.add(subjectId);
        }
        if (gradeId != null) {
            sql.append(" AND cs.classroom_id IN (SELECT classroom_id FROM grade_classrooms WHERE grade_id = ?) ");
            params.add(gradeId);
        }
        return params;
    }
}
