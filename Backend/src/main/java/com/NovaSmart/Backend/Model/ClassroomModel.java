package com.NovaSmart.Backend.Model;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("classrooms")
public class ClassroomModel {

    @Id
    private Long id;

    @NotNull(message = "El nombre del salón es obligatorio.")
    @NotBlank(message = "El nombre del salón no puede estar vacío.")
    private String name;

    @Positive(message = "La capacidad debe ser un valor positivo.")
    private Short capacity;

    @Positive(message = "El piso debe ser un valor positivo.")
    private Short floor;

    private String building; // Cambiado a String para coincidir con el varchar de SQL
}
