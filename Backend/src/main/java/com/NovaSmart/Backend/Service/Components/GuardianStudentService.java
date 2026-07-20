package com.NovaSmart.Backend.Service.Components;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.Components.GuardianAndStudentModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IGuardianStudentRepository;
import com.NovaSmart.Backend.Service.Components.Interfaces.IGuardianStudentService;
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
public class GuardianStudentService implements IGuardianStudentService {

    private final IGuardianStudentRepository guardianStudentRepository;
    private final Validator validator;

    @Override
    @Transactional
    public void save(GuardianAndStudentModel model) {

        BindingResult result = new BeanPropertyBindingResult(model, "guardianAndStudentModel");
        validator.validate(model, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        guardianStudentRepository.save(model);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GuardianAndStudentModel> findByIds(Long guardianId, Long studentId) {
        return guardianStudentRepository.findByIds(guardianId, studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuardianAndStudentModel> findByGuardianId(Long guardianId) {
        return guardianStudentRepository.findByGuardianId(guardianId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuardianAndStudentModel> findByStudentId(Long studentId) {
        return guardianStudentRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuardianAndStudentModel> findAll() {
        return guardianStudentRepository.findAll();
    }

    @Override
    @Transactional
    public void delete(Long guardianId, Long studentId) {
        guardianStudentRepository.delete(guardianId, studentId);
    }
}
