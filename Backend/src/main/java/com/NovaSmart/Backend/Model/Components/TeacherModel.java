package com.NovaSmart.Backend.Model.Components;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("teachers")
public class TeacherModel {
    @Id
    private Long id;

    @NotNull(message = "La profesión es obligatoria.")
    @NotBlank(message = "La profesión no puede estar vacía.")
    private String profession;
}
