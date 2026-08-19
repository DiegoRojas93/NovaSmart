package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class GuardianDashboardDTO {
    private String guardianName;
    private List<StudentSummaryDTO> students;

    @Data
    public static class StudentSummaryDTO {
        private String id;
        private String name;
        private String course;
        private String document;
        private String status;
        private String photo;
        private StudentKpisDTO kpis;
        private List<StudentAlertDTO> alerts;
    }

    @Data
    public static class StudentKpisDTO {
        private double average;
        private int pendingTasks;
        private int absencesThisPeriod;
    }

    @Data
    public static class StudentAlertDTO {
        private int id;
        private String type;
        private String message;
        private boolean urgent;
    }
}
