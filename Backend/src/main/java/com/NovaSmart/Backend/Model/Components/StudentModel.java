package com.NovaSmart.Backend.Model.Components;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("students")
public class StudentModel {
    @Id
    private Long id;
}
