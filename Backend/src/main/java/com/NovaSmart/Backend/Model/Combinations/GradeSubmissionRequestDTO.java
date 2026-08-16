package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;

@Data
public class GradeSubmissionRequestDTO {
    private Long id;
    private Double grade;
    private String feedback;
}
