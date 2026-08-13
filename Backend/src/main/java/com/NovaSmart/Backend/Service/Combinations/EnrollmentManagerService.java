package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.EnrollmentFormDTO;
import com.NovaSmart.Backend.Model.Combinations.EnrollmentSummaryDTO;
import com.NovaSmart.Backend.Repositories.Combinations.EnrollmentManagerRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IEnrollmentManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EnrollmentManagerService implements IEnrollmentManagerService {

    private final EnrollmentManagerRepository enrollmentManagerRepository;

    // --- MÉTODOS DE ESCRITURA ---

    @Override
    @Transactional
    public void createEnrollment(EnrollmentFormDTO request) {
        enrollmentManagerRepository.insertEnrollment(request);
    }

    @Override
    @Transactional
    public void updateEnrollment(EnrollmentFormDTO request) {
        enrollmentManagerRepository.updateEnrollment(request);
    }

    @Override
    @Transactional
    public void deleteEnrollment(Long id, Long institutionId) {
        enrollmentManagerRepository.deleteEnrollment(id, institutionId);
    }

    // --- MÉTODOS DE LECTURA ---

    @Override
    public List<EnrollmentSummaryDTO> getAllEnrollments(Long institutionId) {
        return enrollmentManagerRepository.getAllEnrollments(institutionId);
    }

    @Override
    public Map<String, Object> getFormOptions(Long institutionId) {
        return enrollmentManagerRepository.getFormOptions(institutionId);
    }

    @Override
    public EnrollmentFormDTO getEnrollmentById(Long id, Long institutionId) {
        return enrollmentManagerRepository.getEnrollmentById(id, institutionId);
    }

    @Override
    public List<Map<String, Object>> getSchedulePreview(Long classroomId, Long periodId, Long institutionId) {
        return enrollmentManagerRepository.getSchedulePreview(classroomId, periodId, institutionId);
    }
}
