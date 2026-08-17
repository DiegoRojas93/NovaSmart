package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.TeacherDashboardDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TeacherDashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    // --- 1. KPIs GLOBALES ---
    public TeacherDashboardDTO.KPIs getTeacherKPIs(Long teacherId, Long institutionId, int currentDayOfWeek) {
        TeacherDashboardDTO.KPIs kpis = new TeacherDashboardDTO.KPIs();

        // Total Estudiantes (Matrículas únicas en los cursos del profesor)
        String sqlStudents = "SELECT COUNT(DISTINCT e.student_id) FROM enrollments e " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "WHERE cs.teacher_id = ? AND cs.institution_id = ?";
        kpis.setTotalEstudiantes(jdbcTemplate.queryForObject(sqlStudents, Integer.class, teacherId, institutionId));

        // Cursos Asignados
        String sqlCourses = "SELECT COUNT(id) FROM classroom_subjects WHERE teacher_id = ? AND institution_id = ?";
        kpis.setCursosAsignados(jdbcTemplate.queryForObject(sqlCourses, Integer.class, teacherId, institutionId));

        // Clases Hoy
        String sqlClasses = "SELECT COUNT(s.id) FROM schedules s " +
            "JOIN classroom_subjects cs ON s.classroom_subject_id = cs.id " +
            "WHERE cs.teacher_id = ? AND s.day_of_week = ? AND s.institution_id = ?";
        kpis.setClasesHoy(jdbcTemplate.queryForObject(sqlClasses, Integer.class, teacherId, currentDayOfWeek, institutionId));

        // Promedio Global
        String sqlAvg = "SELECT COALESCE(AVG(sg.grade), 0) FROM student_grades sg " +
            "JOIN class_activities ca ON sg.activity_id = ca.id " +
            "JOIN classroom_subjects cs ON ca.classroom_subject_id = cs.id " +
            "WHERE cs.teacher_id = ? AND sg.grade IS NOT NULL AND cs.institution_id = ?";
        kpis.setPromedioGlobal(jdbcTemplate.queryForObject(sqlAvg, Double.class, teacherId, institutionId));

        return kpis;
    }

    // --- 2. HORARIO DE HOY ---
    public List<TeacherDashboardDTO.ScheduleDTO> getTodaysSchedule(Long teacherId, Long institutionId, int currentDayOfWeek) {
        String sql = "SELECT s.id, s.start_time, s.end_time, sub.name AS subject_name, " +
            "c.name AS course_name, c.building || ' - ' || c.floor AS classroom_info " +
            "FROM schedules s " +
            "JOIN classroom_subjects cs ON s.classroom_subject_id = cs.id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "JOIN classrooms c ON cs.classroom_id = c.id " +
            "WHERE cs.teacher_id = ? AND s.day_of_week = ? AND s.institution_id = ? " +
            "ORDER BY s.start_time ASC";

        LocalTime now = LocalTime.now();

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            TeacherDashboardDTO.ScheduleDTO dto = new TeacherDashboardDTO.ScheduleDTO();
            dto.setId(rs.getLong("id"));

            LocalTime startTime = rs.getTime("start_time").toLocalTime();
            LocalTime endTime = rs.getTime("end_time").toLocalTime();

            dto.setStartTime(startTime.toString());
            dto.setEndTime(endTime.toString());
            dto.setSubject(rs.getString("subject_name"));
            dto.setCourse(rs.getString("course_name"));
            dto.setClassroom(rs.getString("classroom_info"));

            // Lógica para determinar el estado de la clase
            if (now.isAfter(endTime)) {
                dto.setStatus("COMPLETED");
            } else if (now.isAfter(startTime) && now.isBefore(endTime)) {
                dto.setStatus("IN_PROGRESS");
            } else {
                dto.setStatus("PENDING");
            }

            return dto;
        }, teacherId, currentDayOfWeek, institutionId);
    }

    // --- 3. RESUMEN DE GRUPOS ---
    public List<TeacherDashboardDTO.GroupDTO> getTeacherGroups(Long teacherId, Long institutionId) {
        String sql = "SELECT cs.id AS classroom_subject_id, c.name AS course_name, sg.name AS grade_level, sub.name AS subject_name, " +
            "(SELECT COUNT(id) FROM enrollments e WHERE e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id) AS student_count, " +
            "COALESCE((SELECT AVG(stg.grade) FROM student_grades stg JOIN class_activities ca ON stg.activity_id = ca.id WHERE ca.classroom_subject_id = cs.id), 0) AS group_avg, " +
            "COALESCE((SELECT AVG(stg2.grade) FROM student_grades stg2 JOIN class_activities ca2 ON stg2.activity_id = ca2.id JOIN classroom_subjects cs2 ON ca2.classroom_subject_id = cs2.id JOIN grade_classrooms gc2 ON cs2.classroom_id = gc2.classroom_id WHERE gc2.grade_id = gc.grade_id), 0) AS grade_avg " +
            "FROM classroom_subjects cs " +
            "JOIN classrooms c ON cs.classroom_id = c.id " +
            "JOIN subjects sub ON cs.subject_id = sub.id " +
            "JOIN grade_classrooms gc ON c.id = gc.classroom_id " +
            "JOIN school_grades sg ON gc.grade_id = sg.id " +
            "WHERE cs.teacher_id = ? AND cs.institution_id = ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            TeacherDashboardDTO.GroupDTO dto = new TeacherDashboardDTO.GroupDTO();
            dto.setId(rs.getLong("classroom_subject_id"));
            dto.setCourse(rs.getString("course_name"));
            dto.setGradeLevel(rs.getString("grade_level"));
            dto.setSubject(rs.getString("subject_name"));
            dto.setStudentsCount(rs.getInt("student_count"));
            dto.setGroupAvg(rs.getDouble("group_avg"));
            dto.setGradeAvg(rs.getDouble("grade_avg"));
            return dto;
        }, teacherId, institutionId);
    }

    // --- 4. DETALLE INDIVIDUAL DE ESTUDIANTES (Drill-down) ---
    public List<TeacherDashboardDTO.StudentPerformanceDTO> getStudentPerformanceByGroup(Long classroomSubjectId, Long institutionId) {
        // Usamos subconsultas en el SELECT para evitar duplicados masivos al hacer JOINs con notas y asistencias simultáneamente
        String sql = "SELECT u.id AS student_id, u.first_name || ' ' || u.last_name AS student_name, u.photo, " +

            // 1. Promedio de notas
            "COALESCE((SELECT AVG(grade) FROM student_grades sg JOIN class_activities ca ON sg.activity_id = ca.id WHERE sg.enrollment_id = e.id AND ca.classroom_subject_id = ?), 0) AS avg_grade, " +

            // 2. Porcentaje de asistencia
            "COALESCE((SELECT SUM(CASE WHEN status IN ('PRESENTE'::attendance_status, 'LLEGO_TARDE'::attendance_status, 'JUSTIFICADO'::attendance_status) THEN 1 ELSE 0 END) * 100 / NULLIF(COUNT(id), 0) FROM attendances WHERE enrollment_id = e.id AND classroom_subject_id = ?), 100) AS attendance_pct, " +

            // 3. Tareas Entregadas
            "(SELECT COUNT(sg.id) FROM student_grades sg JOIN class_activities ca ON sg.activity_id = ca.id WHERE sg.enrollment_id = e.id AND ca.classroom_subject_id = ? AND sg.status IN ('ENTREGADO'::submission_status, 'CALIFICADO'::submission_status)) AS submitted_tasks, " +

            // 4. Tareas Faltantes
            "(SELECT COUNT(sg.id) FROM student_grades sg JOIN class_activities ca ON sg.activity_id = ca.id WHERE sg.enrollment_id = e.id AND ca.classroom_subject_id = ? AND sg.status IN ('PENDIENTE'::submission_status, 'NO_ENTREGADO'::submission_status)) AS missing_tasks " +

            "FROM enrollments e " +
            "JOIN users u ON e.student_id = u.id " +
            "JOIN classroom_subjects cs ON e.classroom_id = cs.classroom_id AND e.academic_period_id = cs.academic_period_id " +
            "WHERE cs.id = ? AND cs.institution_id = ? " +
            "ORDER BY student_name ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            TeacherDashboardDTO.StudentPerformanceDTO dto = new TeacherDashboardDTO.StudentPerformanceDTO();
            dto.setId(rs.getString("student_id"));
            dto.setName(rs.getString("student_name"));
            dto.setPhoto(rs.getString("photo"));
            dto.setAvg(rs.getDouble("avg_grade"));
            dto.setAttendance(rs.getInt("attendance_pct"));
            dto.setSubmittedTasks(rs.getInt("submitted_tasks"));
            dto.setMissingTasks(rs.getInt("missing_tasks"));
            return dto;
        }, classroomSubjectId, classroomSubjectId, classroomSubjectId, classroomSubjectId, classroomSubjectId, institutionId);
    }
}
