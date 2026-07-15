package com.NovaSmart.Backend.Model;

import com.NovaSmart.Backend.Model.Enums.Attendance_status;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("attendances")
public class AttendanceModel {

    @Id
    private Long id;

    @NotNull(message = "El ID de la inscripción es obligatorio.")
    @Column("enrollment_id")
    private Long enrollmentId;

    @NotNull(message = "El ID de la materia-salón es obligatorio.")
    @Column("classroom_subject_id")
    private Long classroomSubjectId;

    @NotNull(message = "La fecha de asistencia es obligatoria.")
    @Column("attendance_date")
    private LocalDate attendanceDate;

    @NotNull(message = "El estado de la asistencia es obligatorio.")
    private Attendance_status status;

    // En SQL permite nulos
    private String observations;

    @Column("created_at")
    private LocalDateTime createdAt;
}
