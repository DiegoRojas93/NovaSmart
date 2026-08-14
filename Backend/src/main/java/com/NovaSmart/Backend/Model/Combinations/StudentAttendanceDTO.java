package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;

@Data
public class StudentAttendanceDTO {
    private Long enrollmentId;
    private Long studentId;
    private String name;
    private String status;
    private String observations;
}
