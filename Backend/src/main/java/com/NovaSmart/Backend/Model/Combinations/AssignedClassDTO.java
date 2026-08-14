package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class AssignedClassDTO {
    private String id; // Equivale al classroom_subject_id
    private String subject;
    private String subjectCode;
    private String course;
    private String classroom;
    private List<String> schedules;
    private List<AssignedStudentDTO> students;

    @Data
    public static class AssignedStudentDTO {
        private String id; // ID del estudiante
        private String name;
        private String document;
    }
}
