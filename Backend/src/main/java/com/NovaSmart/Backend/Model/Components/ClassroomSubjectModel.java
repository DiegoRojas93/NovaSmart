package com.NovaSmart.Backend.Model.Components;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("classroom_subjects")
public class ClassroomSubjectModel {

    @Id
    private Long id;

    @NotNull(message = "El ID de la materia es obligatorio.")
    @Column("subject_id")
    private Long subjectId;

    @NotNull(message = "El ID del salón es obligatorio.")
    @Column("classroom_id")
    private Long classroomId;

    @NotNull(message = "El ID del profesor es obligatorio.")
    @Column("teacher_id")
    private Long teacherId;

    @NotNull(message = "El ID del periodo académico es obligatorio.")
    @Column("academic_period_id")
    private Long academicPeriodId;

    // En tu SQL, created_at no tiene la restricción NOT NULL en esta tabla
    @Column("created_at")
    private LocalDateTime createdAt;
}
