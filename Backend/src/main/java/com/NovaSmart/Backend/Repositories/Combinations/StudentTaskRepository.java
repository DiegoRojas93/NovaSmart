package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentTaskResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class StudentTaskRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. OBTENER LAS TAREAS PENDIENTES DEL ESTUDIANTE
    public List<StudentTaskResponseDTO> getPendingTasks(Long studentId, Long institutionId) {
        // CORRECCIÓN: Se agregaron los cast explícitos a los ENUMs (::submission_status y ::activity_type)
        String sql = "SELECT ca.id AS activity_id, cs.id AS course_subject_id, s.name AS subject_name, " +
            "t.first_name || ' ' || t.last_name AS teacher_name, " +
            "ca.title, ca.description, ca.due_date " +
            "FROM student_grades sg " +
            "JOIN class_activities ca ON sg.activity_id = ca.id " +
            "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
            "JOIN subjects s ON cs.subject_id = s.id " +
            "JOIN users t ON cs.teacher_id = t.id " +
            "JOIN enrollments e ON sg.enrollment_id = e.id " +
            "WHERE e.student_id = ? " +
            "AND sg.status = 'PENDIENTE'::submission_status " +
            "AND sg.institution_id = ? " +
            "AND ca.type = 'HOMEWORK'::activity_type " +
            "ORDER BY ca.due_date ASC";

        List<StudentTaskResponseDTO> tasks = jdbcTemplate.query(sql, (rs, rowNum) -> {
            StudentTaskResponseDTO dto = new StudentTaskResponseDTO();
            dto.setId(rs.getLong("activity_id"));
            dto.setCourseSubjectId(rs.getString("course_subject_id"));
            dto.setSubject(rs.getString("subject_name"));
            dto.setTeacher(rs.getString("teacher_name"));
            dto.setTitle(rs.getString("title"));
            dto.setDescription(rs.getString("description"));
            Timestamp dueDate = rs.getTimestamp("due_date");
            if (dueDate != null) dto.setDueDate(dueDate.toLocalDateTime());
            return dto;
        }, studentId, institutionId);

        String sqlFiles = "SELECT id, file_name, file_url FROM activity_files WHERE activity_id = ?";
        for (StudentTaskResponseDTO task : tasks) {
            List<StudentTaskResponseDTO.TeacherAttachmentDTO> attachments = jdbcTemplate.query(sqlFiles, (rs, rowNum) -> {
                StudentTaskResponseDTO.TeacherAttachmentDTO fileDto = new StudentTaskResponseDTO.TeacherAttachmentDTO();
                fileDto.setId(rs.getLong("id"));
                fileDto.setFileName(rs.getString("file_name"));
                fileDto.setFileUrl(rs.getString("file_url"));
                return fileDto;
            }, task.getId());
            task.setAttachments(attachments);
        }

        return tasks;
    }

    // 2. ENTREGAR LA TAREA (Actualizar registro a 'ENTREGADO')
    public void submitTask(Long studentId, Long activityId, String fileUrl, String comment, Long institutionId) {
        String sql = "UPDATE student_grades " +
            "SET file_url = ?, observations = ?, status = 'ENTREGADO'::submission_status, submitted_at = ? " +
            "WHERE activity_id = ? AND institution_id = ? " +
            "AND enrollment_id IN (SELECT id FROM enrollments WHERE student_id = ? AND institution_id = ?)";

        jdbcTemplate.update(sql,
            fileUrl,
            comment,
            Timestamp.valueOf(LocalDateTime.now()),
            activityId,
            institutionId,
            studentId,
            institutionId
        );
    }
}
