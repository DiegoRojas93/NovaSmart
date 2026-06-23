package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.InstitutionModel;

import java.util.List;
import java.util.Optional;

public interface IInstitutionsInfoService {
    InstitutionModel save(InstitutionModel institutionInfo );

    Optional<InstitutionModel> findById (Long id);

    List<InstitutionModel> findAll();

    void deleteById(Long id);
}
