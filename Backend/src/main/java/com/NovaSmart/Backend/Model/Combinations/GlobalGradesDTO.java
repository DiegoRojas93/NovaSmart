package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class GlobalGradesDTO {

    private KpisDTO kpis;
    private List<SubjectAverageDTO> subjectAverages;
    private List<DistributionDTO> distribution;
    private List<GradeRecordDTO> detailedRecords;

    // Filtros disponibles
    private List<FilterOptionDTO> availableCourses;
    private List<FilterOptionDTO> availableSubjects;

    @Data
    public static class KpisDTO {
        private String avg;
        private int aprPerc;
        private int repPerc;
        private int excPerc;
    }

    @Data
    public static class SubjectAverageDTO {
        private String materia;
        private double promedio;
    }

    @Data
    public static class DistributionDTO {
        private String name;
        private int value;
        private String color;
    }

    @Data
    public static class GradeRecordDTO {
        private String id;
        private String studentName;
        private String studentPhoto;
        private String courseName;
        private String subjectName;
        private int period;
        private double grade;
        private String observations;
    }

    @Data
    public static class FilterOptionDTO {
        private String id;
        private String name;
    }
}
