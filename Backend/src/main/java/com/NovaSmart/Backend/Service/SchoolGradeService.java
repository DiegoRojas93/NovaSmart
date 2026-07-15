package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.SchoolGradeModel;
import com.NovaSmart.Backend.Repositories.Interfaces.ISchoolGradeRepository;
import com.NovaSmart.Backend.Service.Interfaces.ISchoolGradeService;
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
public class SchoolGradeService implements ISchoolGradeService {
    private final ISchoolGradeRepository schoolGradeRepository;
    private final Validator validator;

    @Override
    @Transactional
    public SchoolGradeModel save(SchoolGradeModel schoolGrade) {

        BindingResult result = new BeanPropertyBindingResult(schoolGrade, "schoolGrade");
        validator.validate(schoolGrade, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return schoolGradeRepository.save(schoolGrade);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SchoolGradeModel> findById(Long id) {
        return schoolGradeRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SchoolGradeModel> findAll() {
        return schoolGradeRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        schoolGradeRepository.deleteById(id);
    }
}
