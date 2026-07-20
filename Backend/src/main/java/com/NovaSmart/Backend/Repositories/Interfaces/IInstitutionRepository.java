package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.InstitutionModel;

import java.util.*;

public interface IInstitutionRepository {
    InstitutionModel save(InstitutionModel institutionInfo );

    Optional<InstitutionModel> findById (Long id);

    List<InstitutionModel> findAll();

    void deleteById(Long id);
}
