package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeSaveRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentActivityGradeDTO;
import com.NovaSmart.Backend.Model.Combinations.TeacherActivityDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class TeacherActivityRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. CREAR NUEVA ACTIVIDAD
    public Long createActivity(String title, Long classroomSubjectId, Integer period, Long institutionId) {
        String sql = "INSERT INTO class_activities (title, type, classroom_subject_id, period, institution_id, created_at) " +
            "VALUES (?, 'CLASSWORK', ?, ?, ?, ?) RETURNING id";

        return jdbcTemplate.queryForObject(sql, Long.class,
            title, classroomSubjectId, period, institutionId, Timestamp.valueOf(LocalDateTime.now()));
    }

    // 2. EDITAR TÍTULO DE ACTIVIDAD
    public void updateActivityTitle(Long activityId, String newTitle, Long institutionId) {
        String sql = "UPDATE class_activities SET title = ?, updated_at = ? WHERE id = ? AND institution_id = ?";
        jdbcTemplate.update(sql, newTitle, Timestamp.valueOf(LocalDateTime.now()), activityId, institutionId);
    }

    // 3. ELIMINAR ACTIVIDAD (Borrado en cascada gracias a tu SQL)
    public void deleteActivity(Long activityId, Long institutionId) {
        String sql = "DELETE FROM class_activities WHERE id = ? AND institution_id = ?";
        jdbcTemplate.update(sql, activityId, institutionId);
    }

    // 4. OBTENER TODAS LAS ACTIVIDADES DE UN CURSO Y PERIODO
    public List<TeacherActivityDTO> getActivitiesWithGrades(Long classroomSubjectId, Integer period, Long institutionId) {
        // A. Obtener las actividades
        String sqlActivities = "SELECT id, title, type FROM class_activities WHERE classroom_subject_id = ? AND period = ? AND institution_id = ? ORDER BY id DESC";
        List<TeacherActivityDTO> activities = jdbcTemplate.query(sqlActivities, (rs, rowNum) -> {
            TeacherActivityDTO dto = new TeacherActivityDTO();
            dto.setId(rs.getLong("id"));
            dto.setTitle(rs.getString("title"));
            dto.setType(rs.getString("type"));
            return dto;
        }, classroomSubjectId, period, institutionId);

        // B. Por cada actividad, buscar a los estudiantes y sus notas (si las tienen)
        String sqlGrades = "SELECT e.id AS enrollment_id, u.id AS student_id, u.first_name || ' ' || u.last_name AS name, " +
            "sg.grade, sg.observations, sg.status " +
            "FROM enrollments e " +
            "JOIN users u ON e.student_id = u.id " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "LEFT JOIN student_grades sg ON sg.enrollment_id = e.id AND sg.activity_id = ? " +
            "WHERE cs.id = ? AND cs.institution_id = ? ORDER BY name";

        for (TeacherActivityDTO act : activities) {
            List<StudentActivityGradeDTO> grades = jdbcTemplate.query(sqlGrades, (rs, rowNum) -> {
                StudentActivityGradeDTO dto = new StudentActivityGradeDTO();
                dto.setEnrollmentId(rs.getLong("enrollment_id"));
                dto.setStudentId(rs.getLong("student_id"));
                dto.setName(rs.getString("name"));
                dto.setGrade(rs.getBigDecimal("grade"));
                dto.setObservations(rs.getString("observations"));
                dto.setStatus(rs.getString("status"));
                return dto;
            }, act.getId(), classroomSubjectId, institutionId);

            act.setGrades(grades);
        }

        return activities;
    }

    // 5. GUARDAR NOTAS (UPSERT)
    public void upsertGradeRecord(Long activityId, Long institutionId, GradeSaveRequestDTO.RecordDTO record) {
        String sql = "INSERT INTO student_grades (enrollment_id, activity_id, grade, observations, status, institution_id, created_at) " +
            "VALUES (?, ?, ?, ?, 'CALIFICADO', ?, ?) " +
            "ON CONFLICT (enrollment_id, activity_id) " +
            "DO UPDATE SET grade = EXCLUDED.grade, observations = EXCLUDED.observations, status = 'CALIFICADO', updated_at = ?";

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        jdbcTemplate.update(sql,
            record.getEnrollmentId(), activityId, record.getGrade(), record.getObservations(),
            institutionId, now, now);
    }

    public Map<String, Object> getCurrentPeriod(Long institutionId) {
        String sql = "SELECT id, name, year FROM academic_periods " +
            "WHERE institution_id = ? AND CURRENT_DATE BETWEEN start_date AND end_date LIMIT 1";

        try {
            return jdbcTemplate.queryForMap(sql, institutionId);
        } catch (EmptyResultDataAccessException e) {
            // Si no hay ningún periodo activo en esta fecha, devolvemos el último o null
            return null;
        }
    }
}
