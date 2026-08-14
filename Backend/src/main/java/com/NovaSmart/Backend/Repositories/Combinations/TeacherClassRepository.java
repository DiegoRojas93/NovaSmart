package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AssignedClassDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class TeacherClassRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<AssignedClassDTO> getTeacherClasses(Long teacherId, Long institutionId) {
        // 1. Obtener las clases base asignadas al profesor
        String sqlClasses = "SELECT cs.id, s.name AS subject, s.code AS subject_code, " +
            "c.name AS course, c.building " +
            "FROM classroom_subjects cs " +
            "JOIN subjects s ON cs.subject_id = s.id " +
            "JOIN classrooms c ON cs.classroom_id = c.id " +
            "WHERE cs.teacher_id = ? AND cs.institution_id = ?";

        List<AssignedClassDTO> classes = jdbcTemplate.query(sqlClasses, (rs, rowNum) -> {
            AssignedClassDTO dto = new AssignedClassDTO();
            dto.setId(rs.getString("id"));
            dto.setSubject(rs.getString("subject"));
            dto.setSubjectCode(rs.getString("subject_code"));
            dto.setCourse(rs.getString("course"));

            // Si hay edificio configurado, lo agregamos al nombre del aula
            String building = rs.getString("building");
            dto.setClassroom(building != null ? rs.getString("course") + " - " + building : rs.getString("course"));
            return dto;
        }, teacherId, institutionId);

        // 2. Por cada clase, buscar sus horarios y estudiantes
        for (AssignedClassDTO cls : classes) {
            Long classroomSubjectId = Long.parseLong(cls.getId());

            // A. Horarios formateados (Ej: "Lunes 07:00 - 09:00")
            String sqlSchedules = "SELECT day_of_week, start_time, end_time FROM schedules WHERE classroom_subject_id = ?";
            List<String> schedules = jdbcTemplate.query(sqlSchedules, (rs, rowNum) -> {
                String[] dias = {"", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"};
                int dayIndex = rs.getInt("day_of_week");
                String start = rs.getTime("start_time").toString().substring(0, 5);
                String end = rs.getTime("end_time").toString().substring(0, 5);
                return dias[dayIndex] + " " + start + " - " + end;
            }, classroomSubjectId);
            cls.setSchedules(schedules);

            // B. Estudiantes matriculados en esa clase
            String sqlStudents = "SELECT u.id, u.first_name || ' ' || u.last_name AS name, ci.identification " +
                "FROM enrollments e " +
                "JOIN users u ON e.student_id = u.id " +
                "LEFT JOIN contact_info ci ON u.id = ci.user_id " +
                "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
                "WHERE cs.id = ? AND e.institution_id = ? ORDER BY u.last_name";

            List<AssignedClassDTO.AssignedStudentDTO> students = jdbcTemplate.query(sqlStudents, (rs, rowNum) -> {
                AssignedClassDTO.AssignedStudentDTO stu = new AssignedClassDTO.AssignedStudentDTO();
                stu.setId(rs.getString("id"));
                stu.setName(rs.getString("name"));
                stu.setDocument(rs.getString("identification") != null ? rs.getString("identification") : "N/A");
                return stu;
            }, classroomSubjectId, institutionId);
            cls.setStudents(students);
        }

        return classes;
    }
}
