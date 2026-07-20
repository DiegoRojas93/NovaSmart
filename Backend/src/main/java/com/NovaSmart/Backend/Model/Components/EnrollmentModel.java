package com.NovaSmart.Backend.Model.Components;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("enrollments")
public class EnrollmentModel {

    @Id
    private Long id;

    @NotNull(message = "El ID del estudiante es obligatorio.")
    @Column("student_id")
    private Long studentId;

    @NotNull(message = "El ID del salón es obligatorio.")
    @Column("classroom_id")
    private Long classroomId;

    @NotNull(message = "El ID del periodo académico es obligatorio.")
    @Column("academic_period_id")
    private Long academicPeriodId;

    @Column("created_at")
    private LocalDateTime createdAt;
}
