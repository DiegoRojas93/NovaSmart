package com.NovaSmart.Backend.Model.Components;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("roles") // Mapea a la tabla 'roles'
public class RoleModel {
    @Id
    private Long id;

    @NotNull(message = "El nombre del rol no puede ser nulo.")
    @NotBlank(message = "El nombre del rol no puede estar vacío.")
    private String name;
}
