package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GradeRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentGradeDTO;

import java.util.List;

public interface ITeacherGradeManagerService {
    List<StudentGradeDTO> getGradesList(Long classroomSubjectId, Integer period, Long institutionId);
    void saveGrades(GradeRequestDTO request);
    void deleteGrades(Long classroomSubjectId, Integer period, Long institutionId);
}
