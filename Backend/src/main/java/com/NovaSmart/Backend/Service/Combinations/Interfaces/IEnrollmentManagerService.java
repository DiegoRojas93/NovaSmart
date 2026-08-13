package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.EnrollmentFormDTO;
import com.NovaSmart.Backend.Model.Combinations.EnrollmentSummaryDTO;

import java.util.List;
import java.util.Map;

public interface IEnrollmentManagerService {

    // --- MÉTODOS DE ESCRITURA ---
    void createEnrollment(EnrollmentFormDTO request);
    void updateEnrollment(EnrollmentFormDTO request);
    void deleteEnrollment(Long id, Long institutionId);

    // --- MÉTODOS DE LECTURA ---
    List<EnrollmentSummaryDTO> getAllEnrollments(Long institutionId);
    Map<String, Object> getFormOptions(Long institutionId);
    EnrollmentFormDTO getEnrollmentById(Long id, Long institutionId);
    List<Map<String, Object>> getSchedulePreview(Long classroomId, Long periodId, Long institutionId);
}
