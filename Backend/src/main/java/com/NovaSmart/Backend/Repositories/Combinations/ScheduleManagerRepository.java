package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.ScheduleFormDTO;
import com.NovaSmart.Backend.Model.Combinations.ScheduleSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ScheduleManagerRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. CREAR ASIGNACIÓN (classroom_subjects)
    public Long insertClassroomSubject(ScheduleFormDTO.AssignmentDTO assignment, Long institutionId) {
        String sql = "INSERT INTO classroom_subjects (subject_id, classroom_id, teacher_id, academic_period_id, institution_id, created_at) " +
            "VALUES (?, ?, ?, ?, ?, ?) RETURNING id";

        return jdbcTemplate.queryForObject(sql, Long.class,
            assignment.getSubjectId(),
            assignment.getClassroomId(),
            assignment.getTeacherId(),
            assignment.getAcademicPeriodId(),
            institutionId,
            Timestamp.valueOf(LocalDateTime.now())
        );
    }

    // 2. ACTUALIZAR ASIGNACIÓN (Siempre filtrando por institution_id)
    public void updateClassroomSubject(Long id, ScheduleFormDTO.AssignmentDTO assignment, Long institutionId) {
        String sql = "UPDATE classroom_subjects SET subject_id = ?, classroom_id = ?, teacher_id = ?, academic_period_id = ? " +
            "WHERE id = ? AND institution_id = ?";

        int rows = jdbcTemplate.update(sql,
            assignment.getSubjectId(), assignment.getClassroomId(),
            assignment.getTeacherId(), assignment.getAcademicPeriodId(),
            id, institutionId);

        if (rows == 0) throw new RuntimeException("Asignación no encontrada o no pertenece a su institución");
    }

    // 3. ELIMINAR BLOQUES DE HORARIO PREVIOS (Ideal para el proceso de actualización)
    public void deleteSchedulesByClassroomSubject(Long classroomSubjectId, Long institutionId) {
        String sql = "DELETE FROM schedules WHERE classroom_subject_id = ? AND institution_id = ?";
        jdbcTemplate.update(sql, classroomSubjectId, institutionId);
    }

    // 4. INSERTAR BLOQUE DE HORARIO
    public void insertTimeBlock(Long classroomSubjectId, ScheduleFormDTO.TimeBlockDTO block, Long institutionId) {
        String sql = "INSERT INTO schedules (classroom_subject_id, day_of_week, start_time, end_time, institution_id, created_at) " +
            "VALUES (?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
            classroomSubjectId,
            block.getDayOfWeek(),
            block.getStartTime(),
            block.getEndTime(),
            institutionId,
            Timestamp.valueOf(LocalDateTime.now())
        );
    }

    // 5. ELIMINAR TODO (Schedules y luego la asignación)
    public void deleteFullAssignment(Long classroomSubjectId, Long institutionId) {
        // Primero borramos los horarios (por la llave foránea)
        deleteSchedulesByClassroomSubject(classroomSubjectId, institutionId);

        // Luego la asignación base
        String sql = "DELETE FROM classroom_subjects WHERE id = ? AND institution_id = ?";
        int rows = jdbcTemplate.update(sql, classroomSubjectId, institutionId);

        if (rows == 0) throw new RuntimeException("Registro no encontrado o acceso denegado");
    }

    // 1. Obtener todos los horarios para la tabla
    public List<ScheduleSummaryDTO> getAllSchedulesSummary(Long institutionId) {
        String sql = "SELECT cs.id, u.first_name, u.last_name, s.name as subject_name, " +
            "c.name as classroom_name, ap.name as period_name " +
            "FROM classroom_subjects cs " +
            "JOIN users u ON cs.teacher_id = u.id " +
            "JOIN subjects s ON cs.subject_id = s.id " +
            "JOIN classrooms c ON cs.classroom_id = c.id " +
            "JOIN academic_periods ap ON cs.academic_period_id = ap.id " +
            "WHERE cs.institution_id = ? " +
            "ORDER BY cs.id DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ScheduleSummaryDTO dto = new ScheduleSummaryDTO();
            dto.setId(rs.getLong("id"));
            dto.setTeacherName(rs.getString("first_name") + " " + rs.getString("last_name"));
            dto.setSubjectName(rs.getString("subject_name"));
            dto.setClassroomName(rs.getString("classroom_name"));
            dto.setPeriodName(rs.getString("period_name"));
            return dto;
        }, institutionId);
    }

    // 2. Obtener los datos para llenar los <select> del frontend (Listas de opciones)
    public Map<String, Object> getFormOptions(Long institutionId) {
        Map<String, Object> data = new java.util.HashMap<>();

        // Docentes (Hacemos JOIN con la tabla teachers)
        data.put("teachers", jdbcTemplate.queryForList(
            "SELECT u.id, u.first_name || ' ' || u.last_name AS name FROM users u JOIN teachers t ON u.id = t.id WHERE u.institution_id = ?", institutionId));

        // Materias
        data.put("subjects", jdbcTemplate.queryForList(
            "SELECT id, name FROM subjects WHERE institution_id = ?", institutionId));

        // Aulas
        data.put("classrooms", jdbcTemplate.queryForList(
            "SELECT id, name FROM classrooms WHERE institution_id = ?", institutionId));

        // Periodos Académicos
        data.put("periods", jdbcTemplate.queryForList(
            "SELECT id, name FROM academic_periods WHERE institution_id = ?", institutionId));

        return data;
    }

    // 3. Obtener un horario completo por ID (Para cuando le den al botón Editar)
    public ScheduleFormDTO getScheduleById(Long classroomSubjectId, Long institutionId) {
        // 1. Obtener asignación base
        String sqlBase = "SELECT teacher_id, academic_period_id, subject_id, classroom_id FROM classroom_subjects WHERE id = ? AND institution_id = ?";
        ScheduleFormDTO.AssignmentDTO assignment = jdbcTemplate.queryForObject(sqlBase, (rs, rowNum) -> {
            ScheduleFormDTO.AssignmentDTO a = new ScheduleFormDTO.AssignmentDTO();
            a.setTeacherId(rs.getLong("teacher_id"));
            a.setAcademicPeriodId(rs.getLong("academic_period_id"));
            a.setSubjectId(rs.getLong("subject_id"));
            a.setClassroomId(rs.getLong("classroom_id"));
            return a;
        }, classroomSubjectId, institutionId);

        // 2. Obtener bloques de tiempo
        String sqlBlocks = "SELECT day_of_week, start_time, end_time FROM schedules WHERE classroom_subject_id = ? AND institution_id = ?";
        List<ScheduleFormDTO.TimeBlockDTO> blocks = jdbcTemplate.query(sqlBlocks, (rs, rowNum) -> {
            ScheduleFormDTO.TimeBlockDTO b = new ScheduleFormDTO.TimeBlockDTO();
            b.setDayOfWeek(rs.getInt("day_of_week"));
            b.setStartTime(rs.getTime("start_time").toLocalTime());
            b.setEndTime(rs.getTime("end_time").toLocalTime());
            return b;
        }, classroomSubjectId, institutionId);

        // 3. Ensamblar DTO
        ScheduleFormDTO dto = new ScheduleFormDTO();
        dto.setId(classroomSubjectId);
        dto.setInstitutionId(institutionId);
        dto.setAssignment(assignment);
        dto.setSchedules(blocks);

        return dto;
    }
}
