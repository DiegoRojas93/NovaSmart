package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.AcademyPeriodModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IAcademyPeriodRepository;
import com.NovaSmart.Backend.Service.Interfaces.IAcademyPeriodService;
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
public class AcademyPeriodService implements IAcademyPeriodService {

    private final IAcademyPeriodRepository academyPeriodRepository;
    private final Validator validator;

    @Override
    @Transactional
    public AcademyPeriodModel save(AcademyPeriodModel period) {

        BindingResult result = new BeanPropertyBindingResult(period, "academyPeriod");
        validator.validate(period, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return academyPeriodRepository.save(period);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AcademyPeriodModel> findById(Long id) {
        return academyPeriodRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademyPeriodModel> findAll() {
        return academyPeriodRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        academyPeriodRepository.deleteById(id);
    }
}
