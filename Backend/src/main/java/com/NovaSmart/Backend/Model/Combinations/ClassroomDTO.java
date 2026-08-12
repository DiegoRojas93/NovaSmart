package com.NovaSmart.Backend.Model.Combinations;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomDTO {
    private Long id;
    @NotBlank(message = "El nombre del aula es obligatorio")
    private String name;
    private Integer capacity;
    private Integer floor;
    private String building;
}
