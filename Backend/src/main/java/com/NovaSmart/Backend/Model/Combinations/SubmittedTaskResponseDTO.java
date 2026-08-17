package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;

@Data
public class SubmittedTaskResponseDTO {
    private String id;
    private String subject;
    private String title;
    private String teacher;
    private String photo;
    private String submittedAt;
    private String fileName;
    private String status; // "EN_REVISION" o "CALIFICADO"
    private Double grade;
    private String feedback;
}
