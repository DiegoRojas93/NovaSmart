package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.EnrollmentModel;

import java.util.List;
import java.util.Optional;

public interface IEnrollmentRepository {
    EnrollmentModel save(EnrollmentModel enrollment);
    Optional<EnrollmentModel> findById(Long id);
    List<EnrollmentModel> findByStudentId(Long studentId);
    List<EnrollmentModel> findByClassroomId(Long classroomId);
    List<EnrollmentModel> findByAcademicPeriodId(Long academicPeriodId);
    List<EnrollmentModel> findAll();
    void deleteById(Long id);
}
