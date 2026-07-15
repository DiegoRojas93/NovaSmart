package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.EnrollmentModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IEnrollmentRepository;
import com.NovaSmart.Backend.Service.Interfaces.IEnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnrollmentService implements IEnrollmentService {

    private final IEnrollmentRepository enrollmentRepository;
    private final Validator validator;

    @Override
    @Transactional
    public EnrollmentModel save(EnrollmentModel enrollment) {

        if (enrollment.getId() == null) {
            enrollment.setCreatedAt(LocalDateTime.now());
        }

        BindingResult result = new BeanPropertyBindingResult(enrollment, "enrollment");
        validator.validate(enrollment, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EnrollmentModel> findById(Long id) {
        return enrollmentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentModel> findByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentModel> findByClassroomId(Long classroomId) {
        return enrollmentRepository.findByClassroomId(classroomId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentModel> findByAcademicPeriodId(Long academicPeriodId) {
        return enrollmentRepository.findByAcademicPeriodId(academicPeriodId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentModel> findAll() {
        return enrollmentRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        enrollmentRepository.deleteById(id);
    }
}
