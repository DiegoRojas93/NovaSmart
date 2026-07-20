package com.NovaSmart.Backend.Service.Components;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.Components.StudentGradesModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IStudentGradesRepository;
import com.NovaSmart.Backend.Service.Components.Interfaces.IStudentGradesService;
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
public class StudentGradesService implements IStudentGradesService {

    private final IStudentGradesRepository studentGradesRepository;
    private final Validator validator;

    @Override
    @Transactional
    public StudentGradesModel save(StudentGradesModel grade) {

        if (grade.getId() == null) {
            grade.setCreatedAt(LocalDateTime.now());
        }

        BindingResult result = new BeanPropertyBindingResult(grade, "studentGrade");
        validator.validate(grade, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return studentGradesRepository.save(grade);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<StudentGradesModel> findById(Long id) {
        return studentGradesRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentGradesModel> findByEnrollmentId(Long enrollmentId) {
        return studentGradesRepository.findByEnrollmentId(enrollmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentGradesModel> findByClassroomSubjectId(Long classroomSubjectId) {
        return studentGradesRepository.findByClassroomSubjectId(classroomSubjectId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentGradesModel> findAll() {
        return studentGradesRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        studentGradesRepository.deleteById(id);
    }
}
