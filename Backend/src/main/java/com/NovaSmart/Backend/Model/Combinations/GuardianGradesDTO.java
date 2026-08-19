package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class GuardianGradesDTO {

    // --- DTO para la carga inicial (Selectores) ---
    @Data
    public static class InitialDataDTO {
        private List<ChildDTO> children;
        private List<PeriodDTO> periods;
    }

    @Data
    public static class ChildDTO {
        private String id;
        private String name;
        private String course;
        private String photo;
    }

    @Data
    public static class PeriodDTO {
        private String id;
        private String name;
    }

    // --- DTO para el Boletín de un Estudiante en un Periodo ---
    @Data
    public static class SubjectGradeDTO {
        private String id;
        private String subject;
        private String teacher;
        private String teacherPhoto;
        private Double grade;
        private String observations;
        private List<TaskDetailDTO> tasks;
        private List<AttendanceDetailDTO> absences;
    }

    @Data
    public static class TaskDetailDTO {
        private String id;
        private String title;
        private Double grade;
        private String date;
    }

    @Data
    public static class AttendanceDetailDTO {
        private String id;
        private String date;
        private String type; // "AUSENTE" | "LLEGO_TARDE"
    }
}
