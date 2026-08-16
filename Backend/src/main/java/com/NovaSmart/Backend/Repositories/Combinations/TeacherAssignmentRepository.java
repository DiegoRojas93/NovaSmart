package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AssignmentResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TeacherAssignmentRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. CREAR LA TAREA (TIPO 'HOMEWORK')
    public Long createAssignment(String title, String description, LocalDateTime dueDate, Long classroomSubjectId, Integer period, Long institutionId) {
        String sql = "INSERT INTO class_activities (title, description, type, due_date, classroom_subject_id, period, institution_id, created_at) " +
            "VALUES (?, ?, 'HOMEWORK', ?, ?, ?, ?, ?) RETURNING id";
        return jdbcTemplate.queryForObject(sql, Long.class,
            title, description, Timestamp.valueOf(dueDate), classroomSubjectId, period, institutionId, Timestamp.valueOf(LocalDateTime.now()));
    }

    // 2. GUARDAR REFERENCIA DE ARCHIVO ADJUNTO
    public void saveActivityFile(Long activityId, String fileName, String fileUrl) {
        String sql = "INSERT INTO activity_files (activity_id, file_name, file_url) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, activityId, fileName, fileUrl);
    }

    // 3. ASIGNAR TAREA A TODOS LOS ESTUDIANTES (Crea registros "PENDIENTE")
    public void assignToAllStudents(Long activityId, Long classroomSubjectId, Long institutionId) {
        String sql = "INSERT INTO student_grades (enrollment_id, activity_id, status, institution_id, created_at) " +
            "SELECT e.id, ?, 'PENDIENTE'::submission_status, e.institution_id, ? " +
            "FROM enrollments e " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "WHERE cs.id = ? AND e.institution_id = ?";

        jdbcTemplate.update(sql, activityId, Timestamp.valueOf(LocalDateTime.now()), classroomSubjectId, institutionId);
    }

    // 4. ASIGNAR TAREA A ESTUDIANTES ESPECÍFICOS
    public void assignToSpecificStudents(Long activityId, Long classroomSubjectId, List<Long> studentIds, Long institutionId) {
        String sql = "INSERT INTO student_grades (enrollment_id, activity_id, status, institution_id, created_at) " +
            "SELECT e.id, ?, 'PENDIENTE'::submission_status, e.institution_id, ? " +
            "FROM enrollments e " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "WHERE cs.id = ? AND e.student_id = ? AND e.institution_id = ?";

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());
        for (Long studentId : studentIds) {
            jdbcTemplate.update(sql, activityId, now, classroomSubjectId, studentId, institutionId);
        }
    }

    // 5. OBTENER LISTA DE TAREAS DEL PROFESOR
    public List<AssignmentResponseDTO> getAssignmentsByTeacher(Long teacherId, Long institutionId) {
        String sql = "SELECT ca.id, ca.title, ca.description, ca.due_date, ca.classroom_subject_id " +
            "FROM class_activities ca " +
            "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
            "WHERE ca.type = 'HOMEWORK' AND cs.teacher_id = ? AND ca.institution_id = ? " +
            "ORDER BY ca.due_date DESC";

        List<AssignmentResponseDTO> assignments = jdbcTemplate.query(sql, (rs, rowNum) -> {
            AssignmentResponseDTO dto = new AssignmentResponseDTO();
            dto.setId(rs.getLong("id"));
            dto.setTitle(rs.getString("title"));
            dto.setDescription(rs.getString("description"));
            Timestamp dueDate = rs.getTimestamp("due_date");
            if (dueDate != null) dto.setDueDate(dueDate.toLocalDateTime());
            dto.setCourseId(rs.getLong("classroom_subject_id"));
            return dto;
        }, teacherId, institutionId);

        // Para cada tarea, buscar sus archivos adjuntos
        String sqlFiles = "SELECT id, file_name, file_url FROM activity_files WHERE activity_id = ?";
        for (AssignmentResponseDTO assignment : assignments) {
            List<AssignmentResponseDTO.ActivityFileDTO> files = jdbcTemplate.query(sqlFiles, (rs, rowNum) -> {
                AssignmentResponseDTO.ActivityFileDTO fileDto = new AssignmentResponseDTO.ActivityFileDTO();
                fileDto.setId(rs.getLong("id"));
                fileDto.setFileName(rs.getString("file_name"));
                fileDto.setFileUrl(rs.getString("file_url"));
                return fileDto;
            }, assignment.getId());

            assignment.setFiles(files);
            assignment.setFilesCount(files.size());

            // Asumimos 'ALL' por defecto en el listado para simplificar la vista general
            assignment.setAssignmentType("ALL");
            assignment.setTargetStudents(List.of());
        }

        return assignments;
    }

    // 6. ELIMINAR TAREA
    public void deleteAssignment(Long activityId, Long institutionId) {
        String sql = "DELETE FROM class_activities WHERE id = ? AND institution_id = ?";
        jdbcTemplate.update(sql, activityId, institutionId);
    }

    // 7. ACTUALIZAR LOS DETALLES DE LA TAREA
    public void updateAssignment(Long activityId, String title, String description, LocalDateTime dueDate, Long institutionId) {
        String sql = "UPDATE class_activities SET title = ?, description = ?, due_date = ?, updated_at = ? WHERE id = ? AND institution_id = ?";
        jdbcTemplate.update(sql, title, description, Timestamp.valueOf(dueDate), Timestamp.valueOf(LocalDateTime.now()), activityId, institutionId);
    }

    // 8. OBTENER LOS ARCHIVOS ADJUNTOS DE UNA TAREA ESPECÍFICA
    public List<AssignmentResponseDTO.ActivityFileDTO> getFilesByActivityId(Long activityId) {
        String sql = "SELECT id, file_name, file_url FROM activity_files WHERE activity_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AssignmentResponseDTO.ActivityFileDTO fileDto = new AssignmentResponseDTO.ActivityFileDTO();
            fileDto.setId(rs.getLong("id"));
            fileDto.setFileName(rs.getString("file_name"));
            fileDto.setFileUrl(rs.getString("file_url"));
            return fileDto;
        }, activityId);
    }

    // 9. ELIMINAR UN ARCHIVO DE LA BD
    public void deleteActivityFile(Long fileId) {
        String sql = "DELETE FROM activity_files WHERE id = ?";
        jdbcTemplate.update(sql, fileId);
    }
}
