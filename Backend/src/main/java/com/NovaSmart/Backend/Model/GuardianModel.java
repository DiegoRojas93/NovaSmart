package com.NovaSmart.Backend.Model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("guardians")
public class GuardianModel {
    @Id
    private Long id;

    private String profession;
}
