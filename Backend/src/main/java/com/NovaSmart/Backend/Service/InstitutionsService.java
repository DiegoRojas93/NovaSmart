package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.InstitutionModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IInstitutionRepository;
import com.NovaSmart.Backend.Service.Interfaces.IInstitutionsInfoService;
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
public class InstitutionsService implements IInstitutionsInfoService {

    private final IInstitutionRepository institutionRepository;

    private final Validator validator;

    @Override
    @Transactional
    public InstitutionModel save(InstitutionModel institutionInfo) {

        // INSERT
        if (institutionInfo.getId() == null) {

            institutionInfo.setCreated_at(
                    LocalDateTime.now()
            );

            institutionInfo.setUpdated_at(null);

            institutionInfo.setDeleted_at(null);

        }

        // UPDATE
        else {

            institutionInfo.setUpdated_at( LocalDateTime.now() );
        }

        // Validaciones

        BindingResult result = new BeanPropertyBindingResult( institutionInfo, "institutionInfo");

        validator.validate( institutionInfo, result );

        if( result.hasErrors() ) {
            throw new ValidationException( result );
        }

        return institutionRepository.save(institutionInfo);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<InstitutionModel> findById(Long id) {
        return institutionRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstitutionModel> findAll() {
        return institutionRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        institutionRepository.deleteById(id);
    }

}
