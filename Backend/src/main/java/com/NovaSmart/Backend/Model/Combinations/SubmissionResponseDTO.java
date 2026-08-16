package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;

@Data
public class SubmissionResponseDTO {
    private String id; // ID de student_grades
    private String assignmentId;
    private String assignmentTitle;
    private String courseId;
    private String courseName;
    private String studentName;
    private String submittedAt;
    private String fileName;
    private Double grade;
    private String feedback;
    private String status;
}
