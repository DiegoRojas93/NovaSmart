package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.StudentModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IStudentRepository;
import com.NovaSmart.Backend.Service.Interfaces.IStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService implements IStudentService {

    private final IStudentRepository studentRepository;
    private final Validator validator;

    @Override
    @Transactional
    public StudentModel save(StudentModel studentModel) {

        BindingResult result = new BeanPropertyBindingResult(studentModel, "studentModel");
        validator.validate(studentModel, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return studentRepository.save(studentModel);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<StudentModel> findById(Long id) {
        return studentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentModel> findAll() {
        return studentRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        studentRepository.deleteById(id);
    }
}
