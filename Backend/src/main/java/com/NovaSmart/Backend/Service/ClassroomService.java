package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.ClassroomModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IClassroomRepository;
import com.NovaSmart.Backend.Service.Interfaces.IClassroomService;
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
public class ClassroomService implements IClassroomService {

    private final IClassroomRepository classroomRepository;
    private final Validator validator;

    @Override
    @Transactional
    public ClassroomModel save(ClassroomModel classroom) {

        BindingResult result = new BeanPropertyBindingResult(classroom, "classroom");
        validator.validate(classroom, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return classroomRepository.save(classroom);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ClassroomModel> findById(Long id) {
        return classroomRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassroomModel> findAll() {
        return classroomRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        classroomRepository.deleteById(id);
    }
}
