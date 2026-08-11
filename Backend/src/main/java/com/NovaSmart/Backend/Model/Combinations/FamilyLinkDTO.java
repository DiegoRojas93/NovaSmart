package com.NovaSmart.Backend.Model.Combinations;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FamilyLinkDTO {
    private Long guardianId;
    private String guardianName;
    private Long studentId;
    private String studentName;
    private String relationship;
}
