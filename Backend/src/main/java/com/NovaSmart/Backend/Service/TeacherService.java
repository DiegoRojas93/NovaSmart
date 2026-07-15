package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.TeacherModel;
import com.NovaSmart.Backend.Repositories.Interfaces.ITeacherRepository;
import com.NovaSmart.Backend.Service.Interfaces.ITeacherService;
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
public class TeacherService implements ITeacherService {

    private final ITeacherRepository teacherRepository;
    private final Validator validator;

    @Override
    @Transactional
    public TeacherModel save(TeacherModel teacherModel) {

        BindingResult result = new BeanPropertyBindingResult(teacherModel, "teacherModel");
        validator.validate(teacherModel, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return teacherRepository.save(teacherModel);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TeacherModel> findById(Long id) {
        return teacherRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherModel> findAll() {
        return teacherRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        teacherRepository.deleteById(id);
    }
}
