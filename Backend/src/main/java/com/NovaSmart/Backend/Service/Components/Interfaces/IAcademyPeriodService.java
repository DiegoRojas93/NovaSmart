package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.AcademyPeriodModel;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IAcademyPeriodService {
    AcademyPeriodModel save(AcademyPeriodModel period);
    Optional<AcademyPeriodModel> findById(Long id);
    List<AcademyPeriodModel> findAllByInstitutionId(Long institutionId);
    void deleteById(Long id);

    Map<String, Object> getCurrentPeriod(Long institutionId);
}
