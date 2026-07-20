package com.NovaSmart.Backend.Model.Components;

import com.NovaSmart.Backend.Model.Enums.Institution_status;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("institutions")
public class InstitutionModel {

    @Id // Define la clave primaria para Spring Data JDBC
    private Long id;

    @NotBlank(message = "El NIT no puede estar vacío.")
    private String nit;

    @NotBlank(message = "El nombre no puede estar vacío.")
    private String name;

    @NotBlank(message = "El departamento no puede estar vacío.")
    private String department;

    @NotBlank(message = "La ciudad no puede estar vacía.")
    private String city;

    @NotBlank(message = "La dirección no puede estar vacía.")
    private String address;

    @NotBlank(message = "La visión no puede estar vacía.")
    private String vision;

    @NotBlank(message = "La misión no puede estar vacía.")
    private String mission;

    private String logo;

    private String banner;

    @NotNull(message = "El estado es obligatorio.")
    private Institution_status status;

    @Column("created_at") // Mapea camelCase a snake_case
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Column("deleted_at")
    private LocalDateTime deletedAt;

}
