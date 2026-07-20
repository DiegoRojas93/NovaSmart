package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.GuardianModel;

import java.util.List;
import java.util.Optional;

public interface IGuardianService {
    GuardianModel save(GuardianModel guardianModel);
    Optional<GuardianModel> findById(Long id);
    List<GuardianModel> findAll();
    void deleteById(Long id);
}
