package com.NovaSmart.Backend.Repositories.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;

import java.util.Optional;

public interface IInstitutionsAndUserRepository {
    Optional<InstitutionAndUserModel> findInfoByUserId (Long id);
}
