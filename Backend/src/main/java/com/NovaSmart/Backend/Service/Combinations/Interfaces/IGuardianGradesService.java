package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GuardianGradesDTO.*;
import java.util.List;

public interface IGuardianGradesService {
    InitialDataDTO getInitialData(Long guardianId, Long institutionId);
    List<SubjectGradeDTO> getStudentGradesDetail(Long studentId, Long periodId);
}
