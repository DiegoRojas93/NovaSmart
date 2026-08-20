package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class AcademicsDashboardDTO {

    // --- DTO para la Pestaña 1: Estructura y Filtros ---
    @Data
    public static class StructureDataDTO {
        private KpisDTO kpis;
        private List<ScheduleChartDTO> scheduleData;
        private List<SubjectsPerGradeDTO> subjectsPerGrade;
        private List<RecentAssignmentDTO> recentAssignments;

        // Listas reales para los selectores del frontend
        private List<FilterOptionDTO> availableGrades;
        private List<FilterOptionDTO> availableSubjects;
    }

    // --- DTO para la Pestaña 2: Actividades Filtradas ---
    @Data
    public static class ActivitiesDataDTO {
        private List<ActivityDistributionDTO> activitiesDistribution;
        private List<SubmissionStatusDTO> submissionStatus;
        private List<RecentActivityDTO> recentActivities;
    }

    // --- Modelos Individuales ---
    @Data
    public static class FilterOptionDTO {
        private String id;
        private String name;
    }

    @Data
    public static class KpisDTO {
        private int activeSubjects;
        private int registeredClassrooms;
        private String currentPeriod;
        private int configuredLevels;
    }

    @Data
    public static class ScheduleChartDTO {
        private String dia;
        private int clases;
    }

    @Data
    public static class SubjectsPerGradeDTO {
        private String grado;
        private int materias;
    }

    @Data
    public static class RecentAssignmentDTO {
        private Long id;
        private String materia;
        private String docente;
        private String docenteFoto;
        private String aula;
        private String horario;
    }

    @Data
    public static class ActivityDistributionDTO {
        private String tipo;
        private int cantidad;
        private String fill;
    }

    @Data
    public static class SubmissionStatusDTO {
        private String estado;
        private int cantidad;
        private String fill;
    }

    @Data
    public static class RecentActivityDTO {
        private Long id;
        private String titulo;
        private String materia;
        private String tipo;
        private String vence;
    }
}
