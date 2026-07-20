package com.NovaSmart.Backend.Model.Components;

import com.NovaSmart.Backend.Model.Enums.Relationships_status;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("guardian_students")
public class GuardianAndStudentModel {
    @NotNull(message = "El ID del acudiente es obligatorio.")
    @Column("guardian_id")
    private Long guardianId;

    @NotNull(message = "El ID del estudiante es obligatorio.")
    @Column("student_id")
    private Long studentId;

    @Column("relationship")
    private Relationships_status relationship; // Enum para Padre, Madre, Tío, etc.
}
