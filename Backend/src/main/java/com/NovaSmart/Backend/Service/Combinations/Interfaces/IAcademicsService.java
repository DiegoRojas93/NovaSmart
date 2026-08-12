package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GradeDetailDTO;
import com.NovaSmart.Backend.Model.Combinations.GradeSummaryDTO;

import java.util.List;

public interface IAcademicsService {
    List<GradeSummaryDTO> getAllGrades(Long institutionId);
    GradeDetailDTO getGradeDetails(Long gradeId);
    void createGradeStructure(GradeDetailDTO payload, Long institutionId);
    void updateGradeStructure(Long gradeId, GradeDetailDTO payload, Long institutionId);
    void deleteGradeStructure(Long gradeId);
}
