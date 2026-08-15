package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentGradeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TeacherGradeManagerRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. OBTENER LISTA DE ALUMNOS Y SUS NOTAS (SI EXISTEN)
    public List<StudentGradeDTO> getGradesList(Long classroomSubjectId, Integer period, Long institutionId) {
        String sql = "SELECT e.id AS enrollment_id, u.id AS student_id, u.first_name || ' ' || u.last_name AS name, " +
            "sg.grade, sg.observations " +
            "FROM enrollments e " +
            "JOIN users u ON e.student_id = u.id " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "LEFT JOIN student_grades sg ON sg.enrollment_id = e.id AND sg.classroom_subject_id = cs.id AND sg.period = ? " +
            "WHERE cs.id = ? AND cs.institution_id = ? " +
            "ORDER BY name";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            StudentGradeDTO dto = new StudentGradeDTO();
            dto.setEnrollmentId(rs.getLong("enrollment_id"));
            dto.setStudentId(rs.getLong("student_id"));
            dto.setName(rs.getString("name"));
            dto.setGrade(rs.getBigDecimal("grade")); // Será null si no hay nota registrada aún
            dto.setObservations(rs.getString("observations"));
            return dto;
        }, period, classroomSubjectId, institutionId);
    }

    // 2. GUARDAR O ACTUALIZAR NOTA (UPSERT)
    public void upsertGradeRecord(Long classroomSubjectId, Integer period, Long institutionId, GradeRequestDTO.RecordDTO record) {
        String sql = "INSERT INTO student_grades (enrollment_id, classroom_subject_id, grade, period, observations, institution_id, created_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?) " +
            "ON CONFLICT (enrollment_id, classroom_subject_id, period) " +
            "DO UPDATE SET grade = EXCLUDED.grade, observations = EXCLUDED.observations, updated_at = ?";

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        jdbcTemplate.update(sql,
            record.getEnrollmentId(), classroomSubjectId, record.getGrade(), period,
            record.getObservations(), institutionId, now, now);
    }

    // 3. ELIMINAR PLANILLA DE UN PERIODO
    public void deleteGradesByPeriod(Long classroomSubjectId, Integer period, Long institutionId) {
        String sql = "DELETE FROM student_grades WHERE classroom_subject_id = ? AND period = ? AND institution_id = ?";
        jdbcTemplate.update(sql, classroomSubjectId, period, institutionId);
    }
}
