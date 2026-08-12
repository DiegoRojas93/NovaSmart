package com.NovaSmart.Backend.Model.Combinations;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeSummaryDTO {
    private Long id;
    @JsonProperty("name")
    private String name;
    private int classroomCount;
    private int subjectCount;
}
