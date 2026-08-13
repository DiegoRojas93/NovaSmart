package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;

@Data
public class ScheduleSummaryDTO {
    private Long id;
    private String teacherName;
    private String subjectName;
    private String classroomName;
    private String periodName;
}
