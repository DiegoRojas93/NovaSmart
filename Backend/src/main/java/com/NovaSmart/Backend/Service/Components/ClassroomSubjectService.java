package com.NovaSmart.Backend.Service.Components;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.Components.ClassroomSubjectModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IClassroomSubjectRepository;
import com.NovaSmart.Backend.Service.Components.Interfaces.IClassroomSubjectService;
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
public class ClassroomSubjectService implements IClassroomSubjectService {

    private final IClassroomSubjectRepository classroomSubjectRepository;
    private final Validator validator;

    @Override
    @Transactional
    public ClassroomSubjectModel save(ClassroomSubjectModel classroomSubject) {

        // Asignación de fecha de creación en INSERTS

        if (classroomSubject.getId() == null) {
            classroomSubject.setCreatedAt(LocalDateTime.now());
        }

        BindingResult result = new BeanPropertyBindingResult(classroomSubject, "classroomSubject");
        validator.validate(classroomSubject, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return classroomSubjectRepository.save(classroomSubject);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ClassroomSubjectModel> findById(Long id) {
        return classroomSubjectRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassroomSubjectModel> findByClassroomId(Long classroomId) {
        return classroomSubjectRepository.findByClassroomId(classroomId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassroomSubjectModel> findByTeacherId(Long teacherId) {
        return classroomSubjectRepository.findByTeacherId(teacherId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassroomSubjectModel> findByAcademicPeriodId(Long academicPeriodId) {
        return classroomSubjectRepository.findByAcademicPeriodId(academicPeriodId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassroomSubjectModel> findAll() {
        return classroomSubjectRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        classroomSubjectRepository.deleteById(id);
    }
}
