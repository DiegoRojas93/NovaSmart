package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import java.util.Optional;

public interface IUserDashboardService {
    Optional <InstitutionAndUserModel> getFullUserProfileByUserId(Long userId);
}
