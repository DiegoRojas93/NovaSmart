package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class StudentTaskResponseDTO {
    private Long id; // ID de la actividad
    private String courseSubjectId; // Para el filtro del frontend
    private String subject; // Nombre de la materia
    private String teacher; // Nombre del profesor
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private List<TeacherAttachmentDTO> attachments;

    @Data
    public static class TeacherAttachmentDTO {
        private Long id;
        private String fileName;
        private String fileUrl;
    }
}
