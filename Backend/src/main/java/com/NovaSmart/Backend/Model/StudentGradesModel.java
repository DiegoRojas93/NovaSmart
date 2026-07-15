package com.NovaSmart.Backend.Model;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("student_grades")
public class StudentGradesModel {

    @Id
    private Long id;

    @NotNull(message = "El ID de la inscripción es obligatorio.")
    @Column("enrollment_id")
    private Long enrollmentId;

    @NotNull(message = "El ID de la materia-salón es obligatorio.")
    @Column("classroom_subject_id")
    private Long classroomSubjectId;

    @NotNull(message = "La nota es obligatoria.")
    private BigDecimal grade;

    @NotNull(message = "El periodo es obligatorio.")
    private Short period;

    // En SQL permite nulos
    private String observations;

    @Column("created_at")
    private LocalDateTime createdAt;
}
