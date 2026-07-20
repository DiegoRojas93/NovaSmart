package com.NovaSmart.Backend.Model.Components;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("schedules")
public class ScheduleModel {

    @Id
    private Long id;

    @NotNull(message = "El ID de la materia-salón es obligatorio.")
    @Column("classroom_subject_id")
    private Long classroomSubjectId;

    @NotNull(message = "El día de la semana es obligatorio.")
    @Positive(message = "El día de la semana no debe ser negativo o cero.")
    @Column("day_of_week")
    private Short dayOfWeek;

    @NotNull(message = "La hora de inicio es obligatoria.")
    @Column("start_time")
    private LocalTime startTime;

    @NotNull(message = "La hora de fin es obligatoria.")
    @Column("end_time")
    private LocalTime endTime;
}
