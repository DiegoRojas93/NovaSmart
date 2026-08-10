package com.NovaSmart.Backend.Repositories.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.GuardianModel;

import java.util.List;
import java.util.Optional;

public interface IGuardianRepository {
    GuardianModel save(GuardianModel guardianModel);
    Optional<GuardianModel> findById(Long id);
    List<GuardianModel> findAll();
    Optional<GuardianModel> findByProfession(String profession);
    void deleteById(Long id);
}
