package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.AcademyPeriodModel;

import java.util.List;
import java.util.Optional;

public interface IAcademyPeriodRepository {
    AcademyPeriodModel save(AcademyPeriodModel period);
    Optional<AcademyPeriodModel> findById(Long id);
    List<AcademyPeriodModel> findAll();
    void deleteById(Long id);
}
