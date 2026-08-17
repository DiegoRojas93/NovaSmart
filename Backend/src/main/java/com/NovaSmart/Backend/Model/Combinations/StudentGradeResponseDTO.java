package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;

@Data
public class StudentGradeResponseDTO {
    private String id;
    private String subject;
    private String teacher;
    private Double grade;
    private String observations;
}
