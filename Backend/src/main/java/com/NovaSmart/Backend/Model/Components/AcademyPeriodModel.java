package com.NovaSmart.Backend.Model.Components;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("academic_periods")
public class AcademyPeriodModel {

    @Id
    private Long id;

    @NotNull(message = "El nombre del periodo académico es obligatorio.")
    @NotBlank(message = "El nombre del periodo académico no puede estar vacío.")
    private String name;

    @NotNull(message = "El año es obligatorio.")
    @Positive(message = "El año no debe ser negativo")
    private Short year;

    @Column("start_date")
    private LocalDate startDate;

    @Column("end_date")
    private LocalDate endDate;
}
