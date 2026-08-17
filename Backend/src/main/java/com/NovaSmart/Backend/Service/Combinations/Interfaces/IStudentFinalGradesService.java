package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.StudentGradeResponseDTO;
import java.util.List;

public interface IStudentFinalGradesService {
    List<StudentGradeResponseDTO> getFinalGrades(Long studentId, Long institutionId);
}
