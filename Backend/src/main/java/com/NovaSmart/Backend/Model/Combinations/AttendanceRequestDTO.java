package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceRequestDTO {
    private Long classroomSubjectId;
    private LocalDate attendanceDate;
    private Long institutionId;
    private List<RecordDTO> records;

    @Data
    public static class RecordDTO {
        private Long enrollmentId; // IMPORTANTE: Usamos el enrollment_id, no solo el student_id
        private String status;
        private String observations;
    }
}
