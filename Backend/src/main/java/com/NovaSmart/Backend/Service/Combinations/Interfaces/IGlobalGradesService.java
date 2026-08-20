package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GlobalGradesDTO;

public interface IGlobalGradesService {
    GlobalGradesDTO getGradesReport(Long institutionId, Long courseId, Long subjectId);
}
