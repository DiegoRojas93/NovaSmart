package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class StudentAttendanceSummaryDTO {

    private Map<String, KpiDataDTO> kpisData; // Diccionario de KPIs (ALL y por materia)
    private List<AttendanceRecordDTO> records; // Lista de novedades (sin los PRESENTES)

    @Data
    public static class KpiDataDTO {
        private int totalClasses;
        private int present;
        private int absences;
        private int lates;
        private int excused;
        private double attendancePercentage;
    }

    @Data
    public static class AttendanceRecordDTO {
        private String id;
        private String date;
        private String subject;
        private String teacher;
        private String status;
        private String observations;
    }
}
