package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class AdminDashboardDTO {
    private KpisDTO kpis;
    private List<EnrollmentChartDTO> enrollmentsChart;
    private List<GradesChartDTO> gradesChart;
    private List<RolesChartDTO> rolesChart;
    private List<ClassroomStatusDTO> classroomStatus;
    private List<RecentUserDTO> recentUsers;

    @Data
    public static class KpisDTO {
        private int totalStudents;
        private int totalTeachers;
        private double globalAttendance;
        private int activeEnrollments;
    }

    @Data
    public static class EnrollmentChartDTO {
        private String mes;
        private int inscripciones;
    }

    @Data
    public static class GradesChartDTO {
        private String periodo;
        private double promedio;
    }

    @Data
    public static class RolesChartDTO {
        private String rol;
        private int cantidad;
        private String fill; // Color para la dona
    }

    @Data
    public static class ClassroomStatusDTO {
        private Long id;
        private String aula;
        private Integer capacidad;
        private int ocupados;
        private String edificio;
    }

    @Data
    public static class RecentUserDTO {
        private String id;
        private String nombre;
        private String rol;
        private String email;
        private String estado;
        private String foto;
    }
}
