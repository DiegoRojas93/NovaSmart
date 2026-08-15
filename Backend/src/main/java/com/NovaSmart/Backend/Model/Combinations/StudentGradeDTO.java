package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StudentGradeDTO {
    private Long enrollmentId;
    private Long studentId;
    private String name;
    private BigDecimal grade;
    private String observations;
}
