package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeSubmissionRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.SubmissionResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class TeacherSubmissionRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. OBTENER TODAS LAS ENTREGAS DEL DOCENTE (Entregadas y Calificadas)
    public List<SubmissionResponseDTO> getSubmissionsByTeacher(Long teacherId, Long institutionId) {
        String sql = "SELECT sg.id, ca.id AS assignment_id, ca.title AS assignment_title, " +
            "cs.id AS course_id, c.name || ' - ' || s.name AS course_name, " +
            "u.first_name || ' ' || u.last_name AS student_name, " +
            "sg.submitted_at, sg.file_url, sg.grade, sg.observations, sg.status " +
            "FROM student_grades sg " +
            "JOIN class_activities ca ON sg.activity_id = ca.id " +
            "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
            "JOIN classrooms c ON cs.classroom_id = c.id " +
            "JOIN subjects s ON cs.subject_id = s.id " +
            "JOIN enrollments e ON sg.enrollment_id = e.id " +
            "JOIN users u ON e.student_id = u.id " +
            "WHERE cs.teacher_id = ? AND sg.institution_id = ? " +
            "AND sg.status IN ('ENTREGADO'::submission_status, 'CALIFICADO'::submission_status) " +
            "ORDER BY sg.submitted_at DESC";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            SubmissionResponseDTO dto = new SubmissionResponseDTO();
            dto.setId(rs.getString("id"));
            dto.setAssignmentId(rs.getString("assignment_id"));
            dto.setAssignmentTitle(rs.getString("assignment_title"));
            dto.setCourseId(rs.getString("course_id"));
            dto.setCourseName(rs.getString("course_name"));
            dto.setStudentName(rs.getString("student_name"));

            Timestamp submittedAt = rs.getTimestamp("submitted_at");
            if (submittedAt != null) {
                dto.setSubmittedAt(submittedAt.toLocalDateTime().format(formatter));
            }

            // Extraer solo el nombre original del archivo (ignorando el UUID si lo prefieres) o mandar la URL completa
            dto.setFileName(rs.getString("file_url"));

            if (rs.getObject("grade") != null) dto.setGrade(rs.getDouble("grade"));
            dto.setFeedback(rs.getString("observations"));

            // Mapeamos el estado de la BD al estado de React
            String dbStatus = rs.getString("status");
            dto.setStatus(dbStatus.equals("ENTREGADO") ? "PENDIENTE" : "CALIFICADO");

            return dto;
        }, teacherId, institutionId);
    }

    // 2. ACTUALIZACIÓN MASIVA DE CALIFICACIONES
    public void updateGrades(List<GradeSubmissionRequestDTO> submissions, Long institutionId) {
        String sql = "UPDATE student_grades SET grade = ?, observations = ?, status = 'CALIFICADO'::submission_status " +
            "WHERE id = ? AND institution_id = ?";

        List<Object[]> batch = submissions.stream()
            .map(s -> new Object[]{s.getGrade(), s.getFeedback(), s.getId(), institutionId})
            .collect(Collectors.toList());

        jdbcTemplate.batchUpdate(sql, batch);
    }

    // 3. OBTENER URL DEL ARCHIVO PARA BORRARLO FÍSICAMENTE
    public String getFileUrl(Long submissionId, Long institutionId) {
        String sql = "SELECT file_url FROM student_grades WHERE id = ? AND institution_id = ?";
        return jdbcTemplate.queryForObject(sql, String.class, submissionId, institutionId);
    }

    // 4. REABRIR LA TAREA (Resetear la fila)
    public void reopenSubmission(Long submissionId, Long institutionId) {
        String sql = "UPDATE student_grades SET status = 'PENDIENTE'::submission_status, " +
            "file_url = NULL, grade = NULL, observations = NULL, submitted_at = NULL " +
            "WHERE id = ? AND institution_id = ?";
        jdbcTemplate.update(sql, submissionId, institutionId);
    }
}
