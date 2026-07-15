package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.AcademyPeriodModel;

import java.util.List;
import java.util.Optional;

public interface IAcademyPeriodService {
    AcademyPeriodModel save(AcademyPeriodModel period);
    Optional<AcademyPeriodModel> findById(Long id);
    List<AcademyPeriodModel> findAll();
    void deleteById(Long id);
}
