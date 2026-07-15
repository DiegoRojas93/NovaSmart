package com.NovaSmart.Backend.Model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("school_grades")
public class SchoolGradeModel {

    @Id
    private Long id;

    @NotNull(message = "El grado es obligatorio.")
    @NotBlank(message = "El grado no puede estar vacío.")
    private String name;
}
