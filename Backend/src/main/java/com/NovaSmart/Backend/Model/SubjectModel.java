package com.NovaSmart.Backend.Model;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("subjects")
public class SubjectModel {

    @Id
    private Long id;

    @NotNull(message = "El nombre de la materia es obligatorio.")
    @NotBlank(message = "El nombre de la materia no puede estar vacío.")
    private String name;

    @NotNull(message = "El código de la materia es obligatorio.")
    @NotBlank(message = "El código de la materia no puede estar vacío.")
    private String code;

    // En SQL permite nulos
    private String description;

    @Column("created_at")
    private LocalDateTime createdAt;
}
