package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;

@Data
public class EnrollmentFormDTO {
    private Long id;
    private Long institutionId;
    private Long studentId;
    private Long academicPeriodId;
    private Long classroomId;
}
