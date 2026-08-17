package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.SubmittedTaskResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Repository
@RequiredArgsConstructor
public class StudentSubmittedTaskRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<SubmittedTaskResponseDTO> getSubmittedTasks(Long studentId, Long institutionId) {
        String sql = "SELECT sg.id, sub.name AS subject_name, ca.title, " +
            "t.first_name || ' ' || t.last_name AS teacher_name, t.photo, " +
            "sg.submitted_at, sg.file_url, sg.status, sg.grade, sg.observations " +
            "FROM student_grades sg " +
            "JOIN class_activities ca ON sg.activity_id = ca.id " +
            "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "JOIN users t ON cs.teacher_id = t.id " +
            "JOIN enrollments e ON sg.enrollment_id = e.id " +
            "WHERE e.student_id = ? AND sg.institution_id = ? " +
            "AND sg.status IN ('ENTREGADO'::submission_status, 'CALIFICADO'::submission_status) " +
            "ORDER BY sg.submitted_at DESC";

        // Formateador de fecha para que coincida con el estilo del frontend (Ej: "20 de Julio, 14:30")
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'de' MMMM, HH:mm", new Locale("es", "ES"));

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            SubmittedTaskResponseDTO dto = new SubmittedTaskResponseDTO();
            dto.setId(rs.getString("id"));
            dto.setSubject(rs.getString("subject_name"));
            dto.setTitle(rs.getString("title"));
            dto.setTeacher(rs.getString("teacher_name"));
            dto.setPhoto(rs.getString("photo"));

            Timestamp submittedAt = rs.getTimestamp("submitted_at");
            if (submittedAt != null) {
                // Se capitaliza la primera letra del mes para mejor estética
                String formattedDate = submittedAt.toLocalDateTime().format(formatter);
                dto.setSubmittedAt(formattedDate.substring(0, 1).toUpperCase() + formattedDate.substring(1));
            } else {
                dto.setSubmittedAt("Fecha desconocida");
            }

            // Extraer solo el nombre original si guardas la URL completa, o mandar el file_url directo
            dto.setFileName(rs.getString("file_url"));

            // Mapeo de estados de BD a Estados de React
            String dbStatus = rs.getString("status");
            dto.setStatus(dbStatus.equals("ENTREGADO") ? "EN_REVISION" : "CALIFICADO");

            if (rs.getObject("grade") != null) {
                dto.setGrade(rs.getDouble("grade"));
            }

            dto.setFeedback(rs.getString("observations"));

            return dto;
        }, studentId, institutionId);
    }
}
