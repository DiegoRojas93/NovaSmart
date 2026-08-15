package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StudentActivityGradeDTO {
    private Long enrollmentId;
    private Long studentId;
    private String name;
    private BigDecimal grade;
    private String observations;
    private String status;
}
