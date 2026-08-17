package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class TeacherDashboardDTO {
    private KPIs kpis;
    private List<ScheduleDTO> todaysSchedule;
    private List<GroupDTO> groups;

    @Data
    public static class KPIs {
        private Integer totalEstudiantes;
        private Integer cursosAsignados;
        private Integer clasesHoy;
        private Double promedioGlobal;
    }

    @Data
    public static class ScheduleDTO {
        private Long id;
        private String startTime;
        private String endTime;
        private String subject;
        private String course;
        private String classroom;
        private String status; // 'PENDING', 'IN_PROGRESS', 'COMPLETED'
    }

    @Data
    public static class GroupDTO {
        private Long id; // classroom_subject_id
        private String course;
        private String gradeLevel;
        private String subject;
        private Integer studentsCount;
        private Double groupAvg;
        private Double gradeAvg; // Promedio comparativo del grado
    }

    // --- DTO para el Drill-down (Detalle del Grupo) ---
    @Data
    public static class GroupDetailDTO {
        private List<StudentPerformanceDTO> students;
    }

    @Data
    public static class StudentPerformanceDTO {
        private String id;
        private String name;
        private String photo;
        private Double avg;
        private Integer attendance;
        private Integer submittedTasks;
        private Integer missingTasks;
    }
}
