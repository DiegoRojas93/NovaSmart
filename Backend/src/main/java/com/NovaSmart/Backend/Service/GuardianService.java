package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.GuardianModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IGuardianRepository;
import com.NovaSmart.Backend.Service.Interfaces.IGuardianService;
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
public class GuardianService implements IGuardianService {

    private final IGuardianRepository guardianRepository;
    private final Validator validator;

    @Override
    @Transactional
    public GuardianModel save(GuardianModel guardianModel) {

        BindingResult result = new BeanPropertyBindingResult(guardianModel, "guardianModel");
        validator.validate(guardianModel, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return guardianRepository.save(guardianModel);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GuardianModel> findById(Long id) {
        return guardianRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuardianModel> findAll() {
        return guardianRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        guardianRepository.deleteById(id);
    }
}
