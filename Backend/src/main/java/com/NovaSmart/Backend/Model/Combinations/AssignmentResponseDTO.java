package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssignmentResponseDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Long courseId;
    private String assignmentType; // "ALL" o "SPECIFIC"
    private List<Long> targetStudents; // IDs de estudiantes si es SPECIFIC
    private Integer filesCount;
    private List<ActivityFileDTO> files;

    @Data
    public static class ActivityFileDTO {
        private Long id;
        private String fileName;
        private String fileUrl;
    }
}
