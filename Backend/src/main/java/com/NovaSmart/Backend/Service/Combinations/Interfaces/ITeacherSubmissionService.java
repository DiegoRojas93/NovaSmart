package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GradeSubmissionRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.SubmissionResponseDTO;
import java.util.List;

public interface ITeacherSubmissionService {
    List<SubmissionResponseDTO> getSubmissionsByTeacher(Long teacherId, Long institutionId);
    void saveGrades(List<GradeSubmissionRequestDTO> submissions, Long institutionId);
    void reopenSubmission(Long submissionId, Long institutionId);
}
