package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.EmergencyContactModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IEmergencyContactRepository;
import com.NovaSmart.Backend.Service.Interfaces.IEmergencyContactService;
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
public class EmergencyContactService implements IEmergencyContactService {

    private final IEmergencyContactRepository emergencyContactRepository;
    private final Validator validator;

    @Override
    @Transactional
    public EmergencyContactModel save(EmergencyContactModel emergencyContact) {

        BindingResult result = new BeanPropertyBindingResult(emergencyContact, "emergencyContact");
        validator.validate(emergencyContact, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return emergencyContactRepository.save(emergencyContact);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmergencyContactModel> findById(Long id) {
        return emergencyContactRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyContactModel> findByUserId(Long userId) {
        return emergencyContactRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyContactModel> findAll() {
        return emergencyContactRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        emergencyContactRepository.deleteById(id);
    }
}
