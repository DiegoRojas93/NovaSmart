package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentGradeResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class StudentFinalGradesRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<StudentGradeResponseDTO> getStudentFinalGrades(Long studentId, Long institutionId) {
        String sql = "SELECT " +
            "cs.id AS subject_id, " +
            "sub.name AS subject_name, " +
            "t.first_name || ' ' || t.last_name AS teacher_name, " +
            "COALESCE(AVG(sg.grade), 0) AS final_grade " +
            "FROM enrollments e " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "JOIN users t ON cs.teacher_id = t.id " +
            "LEFT JOIN class_activities ca ON ca.classroom_subject_id = cs.id " +
            "LEFT JOIN student_grades sg ON sg.activity_id = ca.id AND sg.enrollment_id = e.id AND sg.status = 'CALIFICADO'::submission_status " +
            "WHERE e.student_id = ? AND e.institution_id = ? " +
            "GROUP BY cs.id, sub.name, t.first_name, t.last_name " +
            "ORDER BY sub.name ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            StudentGradeResponseDTO dto = new StudentGradeResponseDTO();
            dto.setId(rs.getString("subject_id"));
            dto.setSubject(rs.getString("subject_name"));
            dto.setTeacher(rs.getString("teacher_name"));

            double avgGrade = rs.getDouble("final_grade");
            dto.setGrade(Math.round(avgGrade * 10.0) / 10.0); // Redondear a 1 decimal

            // Generar una observación automática basada en el promedio calculado
            if (avgGrade >= 4.5) {
                dto.setObservations("Excelente desempeño, gran capacidad de análisis y cumplimiento.");
            } else if (avgGrade >= 4.0) {
                dto.setObservations("Buen desempeño y participación activa en las actividades.");
            } else if (avgGrade >= 3.0) {
                dto.setObservations("Aprobado. Cumplió con los requisitos básicos, pero puede mejorar.");
            } else if (avgGrade > 0) {
                dto.setObservations("Reprobado. Se requiere mayor compromiso y entrega puntual de trabajos.");
            } else {
                dto.setObservations("Aún no hay calificaciones suficientes para evaluar este periodo.");
            }

            return dto;
        }, studentId, institutionId);
    }
}
