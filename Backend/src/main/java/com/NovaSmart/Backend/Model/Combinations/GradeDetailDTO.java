package com.NovaSmart.Backend.Model.Combinations;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeDetailDTO {
    private Long id;
    @NotBlank(message = "El nombre del grado es obligatorio")
    @JsonProperty("gradeName")
    private String gradeName;
    @Valid
    private List<ClassroomDTO> classrooms;
    @Valid
    private List<SubjectDTO> subjects;
}
