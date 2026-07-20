package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.GuardianModel;

import java.util.List;
import java.util.Optional;

public interface IGuardianRepository {
    GuardianModel save(GuardianModel guardianModel);
    Optional<GuardianModel> findById(Long id);
    List<GuardianModel> findAll();
    void deleteById(Long id);
}
