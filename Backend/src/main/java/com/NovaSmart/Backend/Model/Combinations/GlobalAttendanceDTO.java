package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class GlobalAttendanceDTO {

    private KpisDTO kpis;
    private List<TrendDTO> trends;
    private List<DistributionDTO> distribution;
    private List<RecordDTO> recentRecords;

    // Filtros disponibles
    private List<FilterOptionDTO> availableCourses;
    private List<FilterOptionDTO> availableSubjects;

    @Data
    public static class KpisDTO {
        private int presentesPerc;
        private int ausentesPerc;
        private int tardePerc;
        private int justificadosPerc;
        private int totalPresentes;
        private int totalAusentes;
        private int totalTarde;
        private int totalJustificados;
    }

    @Data
    public static class TrendDTO {
        private String fecha;
        private int presente;
        private int ausente;
        private int tarde;
        private int justificado;
    }

    @Data
    public static class DistributionDTO {
        private String name;
        private int value;
        private String color;
    }

    @Data
    public static class RecordDTO {
        private String id;
        private String date;
        private String studentName;
        private String studentPhoto;
        private String subjectName;
        private String courseName;
        private String status;
        private String observations;
    }

    @Data
    public static class FilterOptionDTO {
        private String id;
        private String name;
    }
}
