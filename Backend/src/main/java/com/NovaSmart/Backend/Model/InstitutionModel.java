package com.NovaSmart.Backend.Model;

import com.NovaSmart.Backend.Model.Enums.Institution_status;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionModel {

    private Long id;

    @NotBlank(message = "El NIT no puede estar vacio.")
    private String nit;

    @NotBlank(message = "El nombre no puede estar vacio.")
    private String name;

    @NotBlank(message = "El departamento no puede estar vacio.")
    private String department;

    @NotBlank(message = "La ciudad no puede estar vacio.")
    private String city;

    @NotBlank(message = "La dirección no puede estar vacio.")
    private String address;

    @NotBlank(message = "La vision no puede estar vacio.")
    private String vision;

    @NotBlank(message = "La mision no puede estar vacio.")
    private String mission;

    @NotNull(message = "El estado es obligatorio.")
    private Institution_status status;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    private LocalDateTime deleted_at;

}
