package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class ScheduleFormDTO {
    // ID de la asignación base (nulo al crear, con valor al editar)
    private Long id;
    private Long institutionId;
    private AssignmentDTO assignment;
    private List<TimeBlockDTO> schedules;

    @Data
    public static class AssignmentDTO {
        private Long teacherId;
        private Long academicPeriodId;
        private Long subjectId;
        private Long classroomId;
    }

    @Data
    public static class TimeBlockDTO {
        private Integer dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}
