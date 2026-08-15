package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class TeacherActivityDTO {
    private Long id;
    private String title;
    private String type; // CLASSWORK o HOMEWORK
    private List<StudentActivityGradeDTO> grades;
}
